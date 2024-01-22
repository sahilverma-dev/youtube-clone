import { Types } from "mongoose";
import { Like } from "../models/like.model";
import { Video } from "../models/video.model";
import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Post } from "../models/post.model";

export const likeVideo = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };

  const videoExist = await Video.findOne({ _id: id });

  if (!videoExist) {
    throw new ApiError(404, "Video not found for the given id");
  }

  // Check if the user has already liked the video
  const existingLike = await Like.aggregate([
    {
      $match: {
        video: videoExist._id,
        likedBy: req.user?._id,
      },
    },
  ]);

  if (existingLike) {
    res.status(400).json(new ApiResponse(400, "Video already liked"));

    return;
  }

  // Create a new Like
  const like = await Like.create({
    video: videoExist._id,
    likedBy: req.user?._id,
  });

  if (!like) {
    throw new ApiError(500, "Failed to like video");
  }

  res.status(200).json(new ApiResponse(200, "Video liked", like));
});

export const isVideoLiked = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };

  if (!id) {
    throw new ApiError(400, "Video id is required");
  }

  const { user } = req;

  if (!user) {
    res.status(200).json(new ApiResponse(200, "No user", false));
  }

  const videoExist = await Video.findById(id);
  if (!videoExist) {
    throw new ApiError(401, "Video doesn't exists");
  }

  const liked = await Like.findOne({
    video: videoExist._id,
    likedBy: user?._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Video Liked", liked ? true : false));
});

export const unlikeVideo = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };

  const videoExist = await Video.findOne({ _id: id });

  if (!videoExist) {
    throw new ApiError(404, "Video not found for the given id");
  }

  // Check if the user has already liked the video
  const existingLike = await Like.findOne({
    video: videoExist._id,
    likedBy: new Types.ObjectId(req.user?._id),
  });

  if (!existingLike) {
    res.status(400).json(new ApiResponse(400, "Video not liked yet"));
  }

  // Remove the existing like
  await existingLike?.deleteOne();

  res.status(200).json(new ApiResponse(200, "Video unliked"));
});

export const likePost = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };

  const postExist = await Post.findOne({ _id: id });

  if (!postExist) {
    throw new ApiError(404, "Post not found for the given id");
  }

  // Check if the user has already liked the Post
  const existingLike = await Like.aggregate([
    {
      $match: {
        post: postExist._id,
        likedBy: new Types.ObjectId(req.user?._id),
      },
    },
  ]);

  if (existingLike) {
    res.status(400).json(new ApiResponse(400, "Post already liked"));
  }

  // Create a new Like
  const like = await Like.create({
    post: postExist._id,
    likedBy: new Types.ObjectId(req.user?._id),
  });

  if (!like) {
    throw new ApiError(500, "Failed to like Post");
  }

  res.status(200).json(new ApiResponse(200, "Post liked", like));
});

export const unlikePost = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };

  const postExist = await Post.findOne({ _id: id });

  if (!postExist) {
    throw new ApiError(404, "Post not found for the given id");
  }

  // Check if the user has already liked the Post
  const existingLike = await Like.findOne({
    post: postExist._id,
    likedBy: new Types.ObjectId(req.user?._id),
  });

  if (!existingLike) {
    res.status(400).json(new ApiResponse(400, "Post not liked yet"));
  }

  // Remove the existing like
  await existingLike?.deleteOne();

  res.status(200).json(new ApiResponse(200, "Post unliked"));
});
