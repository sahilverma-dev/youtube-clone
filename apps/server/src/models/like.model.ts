import { Schema, Document, Types, model } from "mongoose";

export interface ILike {
  video?: Types.ObjectId | string;
  comment?: Types.ObjectId | string;
  post?: Types.ObjectId | string;
  likedBy: Types.ObjectId | string;
}

export interface LikeDocument extends ILike, Document {
  // You can add any additional methods or properties here if needed.
}

const likeSchema = new Schema<LikeDocument>(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Like = model<LikeDocument>("Like", likeSchema);
