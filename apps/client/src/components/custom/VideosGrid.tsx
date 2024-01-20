import { Video } from "@/interfaces";
import { FC } from "react";
import VideoCard from "./VideoCard";

interface Props {
  videos: Video[];
}

const VideosGrid: FC<Props> = ({ videos }) => {
  return (
    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideosGrid;
