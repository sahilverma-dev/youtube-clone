"use client";

import { FC } from "react";
import { CldVideoPlayer } from "next-cloudinary";
import { MediaPlayer, MediaProvider } from "@vidstack/react";

import { Video } from "@/interfaces";

interface Props {
  video: Video;
}

const VideoPlayer: FC<Props> = ({ video }) => {
  return (
    <div className="w-full rounded-lg bg-foreground aspect-video overflow-hidden">
      <video
        title={video.title}
        poster={video.thumbnail.url}
        src={video.video.url}
        className="w-full h-full object-fill"
        autoPlay
        muted
        controls
      />
      {/* <MediaPlayer
        title={video.title}
        poster={video.thumbnail.url}
        src={video.video.url}
        className="w-full h-full object-fill"
        autoplay
        muted
        controls
      >
        <MediaProvider />
      </MediaPlayer> */}
      {/* <CldVideoPlayer
        id={video.video.public_id}
        width="1920"
        height="1080"
        className="w-full h-full object-fill"
        src={video.video.secure_url}
        autoPlay
        muted
        controls
      /> */}
    </div>
  );
};

export default VideoPlayer;
