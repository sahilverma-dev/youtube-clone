import { Schema, Document, Types, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IComment {
  content: string;
  video: Types.ObjectId | string;
  owner: Types.ObjectId | string;
}

export interface CommentDocument extends IComment, Document {
  // additional methods
}

const commentSchema = new Schema<CommentDocument>(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = model<CommentDocument>("Comment", commentSchema);
