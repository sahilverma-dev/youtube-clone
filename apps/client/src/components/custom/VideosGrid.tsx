import { Video } from "@/interfaces";
import { FC } from "react";
import VideoCard from "./VideoCard";

interface Props {
  videos: Video[];
  showAvatar?: boolean;
}

const VideosGrid: FC<Props> = ({ videos, showAvatar = true }) => {
  return (
    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} showAvatar={showAvatar} />
      ))}
    </div>
  );
};

export default VideosGrid;
