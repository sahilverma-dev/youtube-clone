import { Types } from "mongoose";
import { Playlist } from "../models/playlist.model";
import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Video } from "../models/video.model";

// TODO populate videos
export const getGetPlaylist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "ID is required");
  }

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        as: "owner",
        from: "users",
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
      $lookup: {
        from: "Videos",
        let: { videoIds: "$videos" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$videoIds"],
              },
            },
          },
          // Add more stages if needed
        ],
        as: "videoDetails",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        totalVideos: {
          $size: "$videos",
        },
      },
    },
  ]);

  if (playlist) {
    res.status(200).json(new ApiResponse(200, "playlist found", playlist));
  } else {
    res.status(200).json(
      new ApiResponse(404, "playlist not found", {
        playlist: null,
      })
    );
  }
});

export const addVideosToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoIds } = req.body as {
    playlistId: string;
    videoIds: string[];
  };

  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required");
  }

  if (!videoIds.length) {
    throw new ApiError(400, "At least one video id is required");
  }

  const playlistExist = await Playlist.findById(playlistId);

  if (!playlistExist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlistExist.owner.toString() !== req?.user?._id.toString()) {
    throw new ApiError(403, "Playlist does not belong to you");
  }

  const videos = await Promise.all(
    videoIds.map(async (id) => {
      const videoExist = await Video.findById(id);

      if (!videoExist) {
        return;
      }

      return videoExist._id;
    })
  );

  if (!videos.length) {
    throw new ApiError(404, "There're no videos");
  }

  const playlistWithAddedVideos = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        videos: { $in: videoIds },
      },
    },
    { new: true }
  ).populate({
    path: "owner",
    select: "username fullName avatar",
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Videos added", playlistWithAddedVideos));
});

export const removeVideosFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoIds } = req.body as {
    playlistId: string;
    videoIds: string[];
  };

  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required");
  }

  if (!videoIds.length) {
    throw new ApiError(400, "At least one video id is required");
  }

  const playlistExist = await Playlist.findById(playlistId);

  if (!playlistExist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlistExist.owner.toString() !== req?.user?._id.toString()) {
    throw new ApiError(403, "Playlist does not belong to you");
  }

  const videos = await Promise.all(
    videoIds.map(async (id) => {
      const videoExist = await Video.findById(id);

      if (!videoExist) {
        return;
      }

      return videoExist._id;
    })
  );

  if (!videos.length) {
    throw new ApiError(404, "There're no videos");
  }

  const playlistWithRemovedVideos = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: { $in: videoIds },
      },
    },
    { new: true }
  ).populate({
    path: "owner",
    select: "username fullName avatar",
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Videos added", playlistWithRemovedVideos));
});

export const createPlaylist = asyncHandler(async (req, res) => {
  const { title, description } = req.body as {
    title: string;
    description: string;
  };

  if (!title) {
    throw new ApiError(400, "Fields are required");
  }

  const playlist = await Playlist.create({
    title,
    description,
    owner: new Types.ObjectId(req.user?._id),
  });

  if (!playlist) {
    throw new ApiError(500, "Failed to created playlist");
  }

  const playlistData = await playlist.populate(
    "owner",
    "fullName username avatar"
  );

  res.status(200).json(new ApiResponse(200, "Playlist created", playlistData));
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const { id } = req.params as {
    id: string;
  };

  const playlistExist = await Playlist.findById(id);

  if (!playlistExist) {
    throw new ApiError(404, "Playlist doesn't exist");
  }

  if (playlistExist.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Playlist doesn't belongs to you");
  }

  const playlistData = await Playlist.findByIdAndDelete(id, {
    new: false,
  });

  res.status(200).json(new ApiResponse(200, "Playlist Deleted", playlistData));
});
