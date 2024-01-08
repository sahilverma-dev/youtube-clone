import jwt from "jsonwebtoken";
import { User } from "./../models/user.model";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

import {
  destroyFromCloudinary,
  uploadOnCloudinary,
} from "../services/cloudnary/config";
import { ApiResponse } from "../utils/ApiResponse";
import { Types } from "mongoose";
import { REFRESH_TOKEN_SECRET } from "../constants/envs";

const generateAccessAndRefreshToken = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();

    if (user) {
      user.refreshToken = refreshToken;
      await user?.save({ validateBeforeSave: false });
    }

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token "
    );
  }
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, username, email, password } = req.body;

    if (
      [fullName, username, email, password].some((item) => item?.trim() === "")
    ) {
      throw new ApiError(400, "All felids are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User already exists");
    }

    const files = req.files as {
      [key: string]: Express.Multer.File[];
    };

    const avatarLocalPath = files?.avatar[0].path;
    const coverImageLocalPath = files?.coverImage
      ? files?.coverImage[0]?.path
      : null;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage =
      coverImageLocalPath !== null
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
      avatar: avatar.url,
      coverImage: coverImage !== null ? coverImage?.url : "",
      email,
      fullName,
      password,
      username: username?.toLowerCase()?.trim(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (createdUser) {
      res
        .status(201)
        .json(new ApiResponse(200, "User created", { user: createdUser }));
    } else {
      throw new ApiError(500, "Something went wrong while creating user");
    }
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if ((!username || !email) && !password) {
    throw new ApiError(400, "username or email are required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (user) {
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (isPasswordCorrect) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );

      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(200, "User Logged In successful", {
            user: loggedInUser,
            refreshToken,
          })
        );
    } else {
      throw new ApiError(401, "Password is not correct");
    }
  } else {
    throw new ApiError(404, "User not found");
  }
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { user } = req;

  await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, "User Logged out Successfully"));
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const inComingRefreshingToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!inComingRefreshingToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      inComingRefreshingToken,
      REFRESH_TOKEN_SECRET as string
    ) as { _id: Types.ObjectId } | null;

    if (decodedToken) {
      if (!inComingRefreshingToken) {
        const user = await User.findById(decodedToken._id);

        if (user) {
          if (inComingRefreshingToken === user?.refreshToken) {
            const { accessToken, refreshToken: newRefreshToken } =
              await generateAccessAndRefreshToken(user?._id);

            const options = {
              httpOnly: true,
              secure: true,
            };

            res
              .status(200)
              .cookie("accessToken", accessToken, options)
              .cookie("refreshToken", newRefreshToken, options)
              .json(
                new ApiResponse(200, "User Logged In successful", {
                  user,
                  refreshToken: newRefreshToken,
                  accessToken,
                })
              );
          } else {
            throw new ApiError(401, "Refresh Token is expired or used");
          }
        } else {
          throw new ApiError(401, "Refresh Token is expired or used");
        }
      } else {
        throw new ApiError(401, "Unauthorized request");
      }
    } else {
      throw new ApiError(401, "Unauthorized request");
    }
  }
);

export const changeCurrentPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = await User.findById(req?.user?._id);

    if (!user) {
      throw new ApiError(400, "There're no user");
    }

    const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);

    if (isPasswordCorrect) {
      user.password = newPassword;
      await user.save({ validateBeforeSave: false });

      res
        .status(200)
        .json(new ApiResponse(200, "Password changed successfully"));
    } else {
      throw new ApiError(400, "Invalid Old password");
    }
  }
);

export const updateUserDetailed = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      throw new ApiError(400, "Fields are required");
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = req.user;

    const updatedUser = await User.findByIdAndUpdate(user?._id, {
      $set: {
        fullName,
        email,
      },
    }).select("-password -refreshToken");

    res
      .status(200)
      .json(new ApiResponse(200, "User info updated", { user: updatedUser }));
  }
);

export const updateUserAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const avatarFile = req.file?.path;

    if (!avatarFile) {
      throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarFile);
    if (!avatar) {
      throw new ApiError(400, "Failed to upload avatar file");
    }

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const user = req.user;

      const updatedUser = await User.findByIdAndUpdate(
        user?._id,
        { $set: { avatar: avatar.url } },
        { new: true }
      ).select("-password -refreshToken");
      await destroyFromCloudinary(user?.avatar);

      res
        .status(200)
        .json(new ApiResponse(200, "User info updated", { user: updatedUser }));
    } catch (error) {
      console.log(error);
      new ApiError(200, "Something went wrong while updating avatar");
    }
  }
);

export const updateUserCoverImage = asyncHandler(
  async (req: Request, res: Response) => {
    const coverImageFile = req.file?.path;

    if (!coverImageFile) {
      throw new ApiError(400, "coverImage file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverImageFile);
    if (!coverImage) {
      throw new ApiError(400, "Failed to upload coverImage file");
    }
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const user = req?.user;

      const updatedUser = await User.findByIdAndUpdate(
        user?._id,
        { $set: { coverImage: coverImage.url } },
        { new: true }
      ).select("-password -refreshToken");

      await destroyFromCloudinary(user?.coverImage);
      res
        .status(200)
        .json(new ApiResponse(200, "User info updated", { user: updatedUser }));
    } catch (error) {
      console.log(error);
      new ApiError(200, "Something went wrong while updating cover image");
    }
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json(
      new ApiResponse(200, "Current user fetched successfully", {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user: req?.user,
      })
    );
  }
);

export const getUserChannelProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.body;

    if (!username) {
      throw new ApiError(400, "username is required");
    }

    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          channelsSubscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: {
            $cond: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              if: { $in: [req?.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
        },
      },
    ]);

    if (!channel?.length) {
      throw new ApiError(404, "channel not found");
    }

    res.status(200).json(
      new ApiResponse(200, "Channel Data", {
        channel: channel[0],
      })
    );
  }
);

export const getUserHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.aggregate([
      {
        $match: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          _id: new Types.ObjectId(req?.user?._id),
        },
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                  {
                    $addFields: {
                      owner: {
                        $first: "$owner",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);

    if (!user?.length) {
      throw new ApiError(404, "Failed to fet user watch history Data");
    }

    res.status(200).json(
      new ApiResponse(200, "Get Watch History Data", {
        watchHistory: user[0]?.watchHistory,
      })
    );
  }
);
