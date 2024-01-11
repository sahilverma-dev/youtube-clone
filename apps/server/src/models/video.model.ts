import { Schema, model, Document, Types, Model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IVideo extends Document {
  video: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views?: number;
  isPublished?: boolean;
  owner: Types.ObjectId;
}

export interface IVideoMethods {
  aggregatePaginate: (data: any) => Promise<any>;
}

export type VideoModel = Model<IVideo, unknown, IVideoMethods>;

const videoSchema = new Schema<IVideo, VideoModel, IVideoMethods>(
  {
    video: {
      type: String,
      required: [true, "Video file is required"],
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = model<IVideo, VideoModel>("Video", videoSchema);
