"use client";

import { FC } from "react";

interface Props {
  video: Video;
}

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
import { RiPlayListAddLine as SaveIcon } from "react-icons/ri";

// components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button, buttonVariants } from "@/components/ui/button";
import { Video } from "@/interfaces";
import { cn, formatLikeCount } from "@/lib/utils";

const LikeUnlikeSection: FC<Props> = ({ video }) => {
  const shareVideo = async () => {
    await navigator.share({
      title: video.title,
      url: window.location.href,
    });
  };

  return (
    <div className="w-full flex justify-end items-center gap-2">
      <div className="flex bg-secondary h-10 p-2 rounded-full items-center  divide-x divide-foreground">
        <button className="flex items-center gap-2 px-2">
          {video?.likedByUser ? <LikeFillIcon /> : <LikeOutlineIcon />}
          <p className="text-sm">{formatLikeCount(video?.likes || 0)}</p>
        </button>
        <button className="flex items-center gap-2 px-2">
          <DislikeOutlineIcon />
          <p className="text-sm">0</p>
        </button>
      </div>
      <Button
        className="rounded-full gap-3"
        variant={"secondary"}
        onClick={shareVideo}
      >
        <ShareIcon size={20} />
        Share
      </Button>
      <a
        href={video?.video}
        target="_blank"
        className={cn([
          buttonVariants({ variant: "secondary" }),
          "rounded-full gap-3",
        ])}
        download={`${video.title}.mp4`}
      >
        <DownloadIcon size={20} />
        Download
      </a>
      <Button className="rounded-full gap-3" variant={"secondary"}>
        <SaveIcon size={18} />
        Save
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" variant={"secondary"} size={"icon"}>
            <DotsIcon size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52">
          <DropdownMenuItem>Report</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LikeUnlikeSection;
