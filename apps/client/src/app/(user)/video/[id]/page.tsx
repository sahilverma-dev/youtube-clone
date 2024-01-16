import { getFeedVideos } from "@/api/videos/getFeedVideos";
import { getVideoWithId } from "@/api/videos/getVideoWithId";
import VideoCard from "@/components/custom/VideoCard";
import VideoPlayer from "@/components/custom/VideoPlayer";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

// icons
import { MdDownload as DownloadIcon } from "react-icons/md";
import {
  AiOutlineShareAlt as ShareIcon,
  AiOutlineLike as LikeOutlineIcon,
  AiOutlineDislike as DislikeOutlineIcon,
  AiFillLike as LikeFillIcon,
  AiFillDislike as DislikeFillIcon,
} from "react-icons/ai";
import { HiOutlineDotsHorizontal as DotsIcon } from "react-icons/hi";

// components
import Description from "./components/Description";
import CommentSection from "./components/CommentSection";

interface Props {
  params: { id: string };
  searchParams: {};
}

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
          <div className="w-full flex items-center gap-4">
            <Link href={`/channel/${video.owner.username}`}>
              <Image
                src={video.owner.avatar}
                height={100}
                width={100}
                className="h-11 w-11 aspect-square object-cover rounded-full"
                alt={video.owner.fullName}
              />
            </Link>
            <div className="flex flex-col">
              <Link
                href={`/channel/${video.owner.username}`}
                className="font-bold text-lg text-foreground"
              >
                {video.owner.fullName}
              </Link>
              <p className="text-xs font-medium to-secondary-foreground">
                1M subscribers
              </p>
            </div>
            <Button className="rounded-full">Subscribe</Button>
          </div>
          <div className="w-full flex justify-end items-center gap-2">
            <div className="flex bg-secondary h-10 p-2 rounded-full items-center  divide-x">
              <button className="flex items-center gap-2 px-2">
                <LikeFillIcon />
                <p className="text-sm">1k</p>
              </button>
              <button className="flex items-center gap-2 px-2">
                <DislikeOutlineIcon />
                <p className="text-sm">0</p>
              </button>
            </div>
            <Button className="rounded-full gap-3" variant={"secondary"}>
              <ShareIcon size={20} />
              Share
            </Button>
            <Button className="rounded-full gap-3" variant={"secondary"}>
              <DownloadIcon size={20} />
              Download
            </Button>
            <Button
              className="rounded-full"
              variant={"secondary"}
              size={"icon"}
            >
              <DotsIcon size={20} />
            </Button>
          </div>
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
        {Array.from({ length: 10 }).map((_, index) => (
          <VideoCard key={index} video={videos[0]} />
        ))}
      </div>
    </div>
  );
};

export default Video;
