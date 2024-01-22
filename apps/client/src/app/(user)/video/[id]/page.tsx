import { FC } from "react";

// api calls
import { getFeedVideos } from "@/api/videos/getFeedVideos";
import { getVideoWithId } from "@/api/videos/getVideoWithId";

// components
import VideoPlayer from "@/components/custom/VideoPlayer";
import Description from "./components/Description";
import CommentSection from "./components/CommentSection";
import LikeUnlikeSection from "./components/LikeUnlikeSection";
import SubscribeSection from "./components/SubscribeSection";
import VideoCard from "@/components/custom/VideoCard";
import { Metadata } from "next";

interface Props {
  params: { id: string };
  searchParams: {};
}

export const generateMetadata: (props: Props) => Promise<Metadata> = async ({
  params,
}) => {
  const { id } = params;

  const { data: video } = await getVideoWithId(id);

  return {
    title: video.title,
    description: video.description.slice(1.2),
    openGraph: {
      images: video.thumbnail.url,
    },
  };
};

const Video: FC<Props> = async ({ params }) => {
  const { id } = params;

  const { data: video } = await getVideoWithId(id);
  const { videos } = await getFeedVideos();

  return (
    <div className="md:flex md:gap-4 w-full">
      <div className="w-full flex-grow space-y-4">
        <VideoPlayer video={video} />
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <div className="w-full flex items-center justify-between">
          <SubscribeSection owner={video.owner} subscribers={6540} />
          <LikeUnlikeSection video={video} />
        </div>
        <hr />
        <Description
          description={video.description}
          time={video.createdAt}
          views={video.views}
        />
        <CommentSection id={id} />
      </div>
      <div className="w-full md:w-96 space-y-4">
        <h2 className="text-lg font-medium">Recommended Videos</h2>
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Video;
