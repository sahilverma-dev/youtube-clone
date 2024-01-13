import { Types } from "mongoose";
import { Post } from "../models/post.model";
import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { user } = req;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const post = await Post.create({
    content,
    owner: new Types.ObjectId(user?._id),
  });

  if (!post) {
    throw new ApiError(500, "Failed to save post");
  }

  const postData = await post.populate("owner", "fullName username avatar");

  res
    .status(200)
    .json(new ApiResponse(200, "Post Created Successfully", postData));
});

export const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "ID is required");
  }

  const post = await Post.findById(id);

  if (post) {
    const postData = await post.populate("owner", "username fullName avatar ");
    res.status(200).json(new ApiResponse(200, "Post found", postData));
  } else {
    res.status(200).json(
      new ApiResponse(404, "Post not found", {
        post: null,
      })
    );
  }
});

export const editPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { user } = req;

  if (!id) {
    throw new ApiError(400, "ID is required");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const postExist = await Post.findById(id);

  if (!postExist) {
    throw new ApiError(404, "Post not found");
  }

  if (postExist.owner.toString() !== user?._id.toString()) {
    throw new ApiError(403, "Post not belongs to you");
  }

  if (content?.trim() === postExist.content.trim()) {
    throw new ApiError(400, "Content is same. Made not changes");
  }

  postExist.content = content;

  const editedPost = await postExist.save();

  const postData = await editedPost.populate(
    "owner",
    "avatar username fullName"
  );

  if (!editedPost) {
    throw new ApiError(500, "Failed to update the post");
  }

  res.status(200).json(new ApiResponse(200, "Post updated", postData));
});

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { user } = req;

  if (!id) {
    throw new ApiError(400, "ID is required");
  }

  const postExist = await Post.findById(id);

  if (!postExist) {
    throw new ApiError(404, "Post not found");
  }

  if (postExist.owner.toString() !== user?._id.toString()) {
    throw new ApiError(403, "Post not belongs to you");
  }

  try {
    await Post.findByIdAndDelete(id);
    res
      .status(200)
      .json(new ApiResponse(200, "Post deleted successfully", postExist));
  } catch (error) {
    throw new ApiError(500, "Failed to delete your post");
  }
});
