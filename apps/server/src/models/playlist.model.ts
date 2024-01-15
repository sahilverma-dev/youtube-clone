import { Schema, Document, Types, model } from "mongoose";

interface IPlaylist {
  title: string;
  description: string;
  videos: (Types.ObjectId | string)[];
  owner: Types.ObjectId | string;
}

interface PlaylistDocument extends IPlaylist, Document {
  // You can add any additional methods or properties here if needed.
}

const playlistSchema = new Schema<PlaylistDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Playlist = model<PlaylistDocument>("Playlist", playlistSchema);
