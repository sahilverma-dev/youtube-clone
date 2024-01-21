import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiErrors";
import { ApiResponse } from "../utils/ApiResponse";
import { mapToFileObject, removeFiles, uploadFile } from "../configs/cloudnary";

import { Video } from "../models/video.model";
import { Types } from "mongoose";
import { User } from "../models/user.model";

export const getVideoInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Video ID is required");
  }

  const userId = req.user ? req.user._id : null; // Get user ID from req.user if available

  const video = await Video.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              displayName: 1,
              avatar: 1,
              fullName: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "likes",
        let: {
          videoId: "$_id",
          userId,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$video", "$$videoId"],
                  },
                  {
                    $cond: {
                      if: {
                        $eq: ["$$userId", null],
                      },
                      then: false,
                      else: {
                        $eq: ["$likedBy", "$$userId"],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
        as: "userLikes",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        likes: {
          $size: "$likes",
        },
        isLikedByUser: {
          $gt: [{ $size: "$userLikes" }, 0],
        },
      },
    },
    {
      $project: {
        owner: 1,
        source: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        likes: 1,
        video: 1,
        isPublished: 1,
        views: 1,
        createdAt: 1,
        updatedAt: 1,
        isLikedByUser: 1,
      },
    },
  ]);

  if (video.length) {
    res.status(200).json(new ApiResponse(200, "Video found", video[0]));
  } else {
    res.status(404).json(
      new ApiResponse(404, "Video not found", {
        video: null,
      })
    );
  }
});

export const getVideos = asyncHandler(async (req, res) => {
  const { query, page, limit } = req.query;

  const aggregate = Video.aggregate([
    {
      $match: { isPublished: true },
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

  res.send({
    videos: videos?.docs,
    totalVideos: videos?.totalDocs,
    nextPage: videos?.nextPage,
    prevPage: videos?.prevPage,
    hasNextPage: videos?.hasNextPage,
    hasPrevPage: videos?.hasPrevPage,
  });
});

export const uploadVideo = asyncHandler(async (req, res) => {
  const user = req?.user;

  if (!user) {
    throw new ApiError(400, "Unauthenticated");
  }

  //   video data
  const { title, description, isPublished } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "All fields are required");
  }
  // files
  const { videoFile, thumbnailFile } = req.files as {
    [key: string]: Express.Multer.File[];
  };

  if (!videoFile || !thumbnailFile) {
    throw new ApiError(400, "All files are required");
  }

  //   upload file on cloudnary
  const video = await uploadFile(videoFile[0].path, "videos");
  const thumbnail = await uploadFile(thumbnailFile[0].path, "thumbnails");

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

export const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const { user } = req;

  const videoExist = await Video.findById(id);

  if (!videoExist) {
    throw new ApiError(404, "Video not found");
  }

  if (
    videoExist.owner.toString() !== (user?._id as Types.ObjectId).toString()
  ) {
    throw new ApiError(403, "You don't have access to this video");
  }

  const { thumbnailFile } = req.files as {
    [key: string]: Express.Multer.File[];
  };

  if (thumbnailFile) {
    const oldThumbnailFile = videoExist.thumbnail;

    try {
      const newThumbnail = await uploadFile(
        thumbnailFile[0].path,
        "thumbnails"
      );

      await removeFiles(oldThumbnailFile.public_id);

      try {
        videoExist.title = title;
        videoExist.description = description;
        // TODO
        // videoExist.thumbnail = mapToFileObject(newThumbnail);

        const updatedVideo = await videoExist.save();
        res.status(200).json(
          new ApiResponse(
            200,
            "Video Updated successfully with new thumbnail",
            {
              video: updatedVideo,
            }
          )
        );
      } catch (error) {
        throw new ApiError(500, "Failed to upload thumbnail");
      }
    } catch (error) {
      throw new ApiError(500, "Failed to upload thumbnail");
    }
  } else {
    try {
      videoExist.title = title;
      videoExist.description = description;

      const updatedVideo = await videoExist.save();
      res.status(200).json(
        new ApiResponse(200, "Video Updated successfully without thumbnail", {
          video: updatedVideo,
        })
      );
    } catch (error) {
      throw new ApiError(500, "Failed to upload thumbnail");
    }
  }
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { user } = req;

  const videoExist = await Video.findById(id);

  if (!videoExist) {
    throw new ApiError(404, "Video not found");
  }

  if (
    videoExist.owner.toString() !== (user?._id as Types.ObjectId).toString()
  ) {
    throw new ApiError(403, "You don't have access to this video");
  }

  try {
    videoExist.isPublished = !videoExist.isPublished;

    const updatedVideo = await videoExist.save();
    res.status(200).json(
      new ApiResponse(200, "Video publish toggled successfully", {
        video: updatedVideo,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Failed to toggle video publish");
  }
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const videoExist = await Video.findById(id);

  if (!videoExist) {
    throw new ApiError(404, "Video not found");
  }

  if (
    videoExist.owner.toString() !== (user?._id as Types.ObjectId).toString()
  ) {
    throw new ApiError(403, "You don't have access to this video");
  }

  try {
    await videoExist.deleteOne();
    // TODO delete old video and image file
    res.status(200).json(
      new ApiResponse(200, "Video deleted successfully", {
        video: videoExist,
      })
    );
  } catch (error) {
    console.log(error);

    throw new ApiError(500, "Failed to delete the video");
  }
});

// add view to video
export const watchVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params as { videoId: string };

  // check for video id
  if (!videoId) {
    throw new ApiError(404, "Video id is required");
  }

  // check for video
  const videoExist = await Video.findById(videoId);
  if (!videoExist) {
    throw new ApiError(404, "Video doesn't exists");
  }

  // if there's a user add to the watch history and increase the view count
  const { user } = req;
  if (user) {
    const newUser = await User.findByIdAndUpdate(user?._id, {
      $push: {
        watchHistory: videoExist?._id,
      },
    });

    // check for comment
    if (!newUser) {
      throw new ApiError(404, "Failed to add video on user history");
    }
  }
  // if there's no user do nothing
  else {
    return;
  }
  videoExist.views = videoExist?.views || 0 + 1;
  await videoExist.save();
});
