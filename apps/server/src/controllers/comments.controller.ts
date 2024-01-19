import { Types } from "mongoose";
import { Comment } from "../models/comment.model";
import { Video } from "../models/video.model";
import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params as { videoId: string };
  const { page = 1, limit = 10 } = req.params;

  // check for id
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  // check for video
  const videoExist = await Video.findById(videoId);
  if (!videoExist) {
    throw new ApiError(404, "Video doesn't exists");
  }

  // get comments
  const aggregate = Comment.aggregate([
    {
      $match: {
        video: new Types.ObjectId(videoId),
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
  ]);

  //   @ts-ignore
  const comments = await Comment.aggregatePaginate(aggregate, {
    page: page ? Number(page) : 0,
    limit: limit ? Number(limit) : 10,
  });

  // check for comment
  if (!comments) {
    throw new ApiError(500, "Failed to get comments");
  }

  res.status(200).json(
    new ApiResponse(200, "Comments of the video", {
      comments: comments?.docs,
      totalComments: comments?.totalDocs,
      nextPage: comments?.nextPage,
      prevPage: comments?.prevPage,
      hasNextPage: comments?.hasNextPage,
      hasPrevPage: comments?.hasPrevPage,
    })
  );
});

export const addCommentToVideo = asyncHandler(async (req, res) => {
  const { videoId, content } = req.body as {
    videoId: string;
    content: string;
  };

  // check for id
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  // check for content
  if (!content.trim().length) {
    throw new ApiError(400, "Comment content is required");
  }

  // check for video
  const videoExist = await Video.findById(videoId);
  if (!videoExist) {
    throw new ApiError(404, "Video doesn't exists");
  }

  // add comment
  const comment = await Comment.create({
    video: videoExist._id,
    owner: new Types.ObjectId(req?.user?._id),
    content: content.trim(),
  });

  // check for comment
  if (!comment) {
    throw new ApiError(500, "Failed to add comment");
  }

  const commentData = await comment.populate(
    "owner",
    "fullName avatar username"
  );
  // check for comment data
  if (!comment) {
    throw new ApiError(500, "Failed to add comment");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Comment added to video", commentData));
});

export const editCommentOfVideo = asyncHandler(async (req, res) => {
  const { commentId } = req.query as { commentId: string };

  const { videoId, content } = req.body as {
    videoId: string;
    content: string;
  };

  // check for id
  if (!commentId) {
    throw new ApiError(400, "Comment id is required");
  }

  // check for id
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  // check for content
  if (!content.trim().length) {
    throw new ApiError(400, "Comment content is required");
  }

  // check for video
  const videoExist = await Video.findById(videoId);
  if (!videoExist) {
    throw new ApiError(404, "Video doesn't exists");
  }

  // check for comment
  const commentExist = await Comment.findById(commentId);
  if (!commentExist) {
    throw new ApiError(404, "Comment doesn't exists");
  }

  // check for comment owner
  if (commentExist.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You don't have access to this comment");
  }

  // check for if comment is same
  if (commentExist.content === content) {
    res.status(200).json(new ApiResponse(200, "Comment is the same"));
  }

  // add comment
  const comment = await Comment.findByIdAndUpdate(videoId, {
    content: content.trim(),
  });

  // check for comment
  if (!comment) {
    throw new ApiError(500, "Failed to edit comment");
  }

  res.status(200).json(new ApiResponse(200, "Comment edited", comment));
});

export const removeCommentFromVideo = asyncHandler(async (req, res) => {
  const { commentId } = req.query as { commentId: string };

  // check for id
  if (!commentId) {
    throw new ApiError(400, "Comment id is required");
  }

  const { videoId } = req.body as {
    videoId: string;
  };

  // check for id
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  // check for video
  const videoExist = await Video.findById(videoId);
  if (!videoExist) {
    throw new ApiError(404, "Video doesn't exists");
  }

  // check for comment
  const commentExist = await Comment.findById(commentId);
  if (!commentExist) {
    throw new ApiError(404, "Comment doesn't exists");
  }

  // check for comment owner
  if (commentExist.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You don't have access to this comment");
  }

  // add comment
  const comment = await Comment.findByIdAndDelete(commentId, { new: false });

  // check for comment
  if (!comment) {
    throw new ApiError(500, "Failed to remove comment");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Comment removed from video", comment));
});
