import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../services/cloudnary/config";
import { Video } from "../models/video.model";
import { Types } from "mongoose";

export const getVideoInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "owner",
          as: "owner",
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
          owner: {
            $first: "$owner",
          },
        },
      },
    ]);

    if (video.length) {
      res.status(200).json(
        new ApiResponse(200, "Video found", {
          video: video[0],
        })
      );
    } else {
      res.status(404).json(
        new ApiResponse(404, "Video not found", {
          video: null,
        })
      );
    }
  }
);

export const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const user = req?.user;

  if (!user) {
    throw new ApiError(400, "Unauthenticated");
  }

  //   video data
  const { title, description, isPublished } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "All fields are required");
  }
  // video files
  const { videoFile, thumbnailFile } = req.files as {
    [key: string]: Express.Multer.File[];
  };

  if (!videoFile || !thumbnailFile) {
    throw new ApiError(400, "All files are required");
  }

  //   upload file on cloudnary
  const video = await uploadOnCloudinary(videoFile[0].path);
  const thumbnail = await uploadOnCloudinary(thumbnailFile[0].path);

  if (!video || !thumbnail) {
    throw new ApiError(500, "Failed to upload files");
  }

  // create a new video document
  const videoDoc = await Video.create({
    title: title?.trim(),
    description: description?.trim(),
    owner: new Types.ObjectId(user?._id),
    video: video?.url,
    thumbnail: thumbnail?.url,
    isPublished: isPublished === "true" ? true : false,
    duration: video?.duration as number,
  });

  if (!videoDoc) {
    throw new ApiError(500, "Can't save video data on database");
  }

  const videoData = await videoDoc.populate(
    "owner",
    "fullName username avatar"
  );

  res.status(200).json(
    new ApiResponse(200, "Video successfully uploaded", {
      video: videoData,
    })
  );
});
