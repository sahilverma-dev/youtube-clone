import { Schema, Document, Types, model } from "mongoose";

interface IPost {
  content: string;
  owner: Types.ObjectId | string;
}

interface PostDocument extends IPost, Document {
  // You can add any additional methods or properties here if needed.
}

const PostSchema = new Schema<PostDocument>(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const PostModel = model<PostDocument>("Post", PostSchema);
