import jwt from "jsonwebtoken";
import { User } from "./../models/user.model";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiErrors";

import { removeFiles, mapToFileObject, uploadFile } from "../configs/cloudnary";

import { ApiResponse } from "../utils/ApiResponse";
import { Types } from "mongoose";
import { REFRESH_TOKEN_SECRET } from "../constants/env";
import { Video } from "../models/video.model";

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

export const registerUser = asyncHandler(async (req, res) => {
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

  const avatarLocalPath = files?.coverImage ? files?.avatar[0]?.path : null;

  const coverImageLocalPath = files?.coverImage
    ? files?.coverImage[0]?.path
    : null;

  const avatarResponse =
    avatarLocalPath !== null
      ? await uploadFile(avatarLocalPath, "avatar")
      : null;

  const coverImageResponse =
    coverImageLocalPath !== null
      ? await uploadFile(coverImageLocalPath, "covers")
      : null;

  const user = await User.create({
    avatar: avatarResponse !== null ? mapToFileObject(avatarResponse) : null,
    coverImage:
      coverImageResponse !== null ? mapToFileObject(coverImageResponse) : null,
    email,
    fullName,
    password,
    username: username?.toLowerCase()?.trim(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (createdUser) {
    res.status(201).json(new ApiResponse(200, "User created", createdUser));
  } else {
    throw new ApiError(500, "Something went wrong while creating user");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username = "", email = "", password = "" } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is not correct");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findOne({ _id: user._id }).select(
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
        accessToken,
        refreshToken,
      })
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
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

export const refreshAccessToken = asyncHandler(async (req, res) => {
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
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req?.user?._id);

  if (!user) {
    throw new ApiError(400, "There're no user");
  }

  const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);

  if (isPasswordCorrect) {
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, "Password changed successfully"));
  } else {
    throw new ApiError(400, "Invalid Old password");
  }
});

export const updateUserDetailed = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "Fields are required");
  }

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
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarFile = req.file?.path;

  if (!avatarFile) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadFile(avatarFile, "avatar");
  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  try {
    const user = req.user;

    const updatedUser = await User.findByIdAndUpdate(
      user?._id,
      { $set: { avatar: avatar.url } },
      { new: true }
    ).select("-password -refreshToken");
    await removeFiles(user?.avatar?.public_id as string);

    res
      .status(200)
      .json(new ApiResponse(200, "User info updated", { user: updatedUser }));
  } catch (error) {
    console.log(error);
    new ApiError(200, "Something went wrong while updating avatar");
  }
});

export const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageFile = req.file?.path;

  if (!coverImageFile) {
    throw new ApiError(400, "coverImage file is missing");
  }

  const coverImage = await uploadFile(coverImageFile, "covers");
  if (!coverImage) {
    throw new ApiError(400, "Failed to upload coverImage file");
  }
  try {
    const user = req?.user;

    const updatedUser = await User.findByIdAndUpdate(
      user?._id,
      { $set: { coverImage: coverImage.url } },
      { new: true }
    ).select("-password -refreshToken");

    await removeFiles(user?.coverImage?.public_id as string);
    res
      .status(200)
      .json(new ApiResponse(200, "User info updated", { user: updatedUser }));
  } catch (error) {
    console.log(error);
    new ApiError(200, "Something went wrong while updating cover image");
  }
});

// export const getCurrentUser = asyncHandler(async (req, res) => {
//   res.status(200).json(
//     new ApiResponse(200, "Current user fetched successfully", {
//       user: req?.user,
//     })
//   );
// });

export const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", req?.user));
});

export const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params as { username: string };

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

  res.status(200).json(new ApiResponse(200, "Channel Data", channel[0]));
});

export const getUserChannelVideos = asyncHandler(async (req, res) => {
  const { username } = req.params as { username: string };
  const { page = 1, limit = 20 } = req.query;

  if (!username) {
    throw new ApiError(400, "username is required");
  }

  const userExist = await User.findOne({ username });

  if (!userExist) {
    throw new ApiError(404, "User doesn't exists");
  }

  const aggregate = Video.aggregate([
    {
      $match: {
        isPublished: true,
        owner: userExist?._id,
      },
    },
    {
      $lookup: {
        from: "users",
        as: "owner",
        foreignField: "_id",
        localField: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
      },
    },
  ]);

  // @ts-ignore
  const videos = await Video.aggregatePaginate(aggregate, {
    page: page ? Number(page) : 0,
    limit: limit ? Number(limit) : 10,
  });

  res.status(200).json(
    new ApiResponse(200, "Channel Data", {
      videos: videos?.docs,
      totalVideos: videos?.totalDocs,
      nextPage: videos?.nextPage,
      prevPage: videos?.prevPage,
      hasNextPage: videos?.hasNextPage,
      hasPrevPage: videos?.hasPrevPage,
    })
  );
});

export const addVideoToUserHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.body as { videoId: string };

  if (!videoId) {
    throw new ApiError(404, "Video id is required");
  }
  // check for the video
  const videoExist = await Video.findById(videoId);

  if (!videoExist) {
    throw new ApiError(404, "Video doesn't exist");
  }

  // check of the user
  const { user } = req;
  // add video id to user document

  if (user) {
    const newUser = await User.findByIdAndUpdate(
      user._id,
      {
        // TODO can add timestamps as well and keep the watch history of the unique videos
        $push: {
          watchHistory: videoId,
        },
      },
      {
        new: true,
      }
    ).select("username avatar fullName watchHistory");

    if (!newUser) {
      throw new ApiError(500, "Failed to add video on the watch history");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Video added on the watch history", newUser));
  }
  // if there's no user do nothing
  else {
    return;
  }
});

export const removeVideoFromUserHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.body as { videoId: string };

  if (!videoId) {
    throw new ApiError(404, "Video id is required");
  }
  // check for the video
  const videoExist = await Video.findById(videoId);

  if (!videoExist) {
    throw new ApiError(404, "Video doesn't exist");
  }

  // check of the user
  const { user } = req;
  // remove video id to user document
  if (user) {
    const newUser = await User.findByIdAndUpdate(
      user._id,
      {
        $pull: {
          watchHistory: videoId,
        },
      },
      {
        new: true,
      }
    ).select("username avatar fullName watchHistory");

    if (!newUser) {
      throw new ApiError(500, "Failed to add video on the watch history");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Video added on the watch history", newUser));
  }
  // if there's no user do nothing
  else {
    return;
  }
});

export const getUserHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req?.user?._id),
      },
    },
    {
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
              ],
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
  ]);

  if (!user?.length) {
    throw new ApiError(404, "Failed to fet user watch history Data");
  }

  const videos = user[0]?.watchHistory;

  res.status(200).json(
    new ApiResponse(200, "Get Watch History Data", {
      videos,
      totalVideos: videos?.length || 0,
    })
  );
});
