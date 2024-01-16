"use client";

import { Video } from "@/interfaces";
import { FC } from "react";

interface Props {
  video: Video;
}

const VideoPlayer: FC<Props> = ({ video }) => {
  return (
    <div className="w-full rounded-lg bg-primary aspect-video overflow-hidden">
      <video
        src={video.video}
        poster={video.thumbnail}
        muted
        // autoPlay
        // controls
      />
    </div>
  );
};

export default VideoPlayer;
