"use client";

import { FC } from "react";
import { CldVideoPlayer } from "next-cloudinary";

import { Video } from "@/interfaces";

interface Props {
  video: Video;
}

const VideoPlayer: FC<Props> = ({ video }) => {
  return (
    <div className="w-full rounded-lg bg-foreground aspect-video overflow-hidden">
      <video
        src={
          "https://res.cloudinary.com/sahilverma-dev/video/upload/v1704746802/hfqbcfsuboykeegvqdiy.mp4"
        }
        // src={video.video}
        poster={video.thumbnail}
        muted
        className="w-full h-full object-fill"
        autoPlay
        controls
      />
      {/* <CldVideoPlayer
        id={video._id}
        width="1920"
        height="1080"
        className="w-full h-full object-fill"
        src={video.video}
        autoPlay
        muted
        controls
      /> */}
    </div>
  );
};

export default VideoPlayer;
