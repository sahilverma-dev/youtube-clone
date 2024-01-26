"use client";

import { FC } from "react";

interface Props {
  video: Video;
}

// icons
import { MdDownload as DownloadIcon } from "react-icons/md";
import { CgSpinner as SpinnerIcon } from "react-icons/cg";

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

// icons

import { Video } from "@/interfaces";
import { cn, formatLikeCount } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";

import { likeVideo } from "@/api/likes/likeVideo";
import { toast } from "@/components/ui/use-toast";
import { unLikeVideo } from "@/api/likes/unlikeVideo";
import { getVideoLikes } from "@/api/videos/getVideoLikes";

const LikeUnlikeSection: FC<Props> = ({ video }) => {
  const isLiked = useQuery({
    queryKey: [video._id, "likes"],
    queryFn: () => getVideoLikes(video._id),
  });

  const shareVideo = async () => {
    await navigator.share({
      title: video.title,
      url: window.location.href,
    });
  };

  // mutations
  const likeMutation = useMutation({
    mutationFn: () =>
      likeVideo({
        videoId: video._id,
      }),
    onSuccess: (data) => {
      toast({
        title: "Video liked",
      });
      isLiked.refetch();
    },
    onError: (error: any) => {
      toast({
        title: error?.message || "Failed to like",
        variant: "destructive",
      });
    },
  });

  const unLikeMutation = useMutation({
    mutationFn: () =>
      unLikeVideo({
        videoId: video._id,
      }),
    onSuccess: () => {
      toast({
        title: "Video unliked",
      });
      isLiked.refetch();
    },
    onError: (error: any) => {
      toast({
        title: error?.message || "Failed to like",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="w-full flex justify-end items-center gap-2">
      <div
        className={cn([
          "flex bg-secondary h-10 p-2 rounded-full items-center divide-x divide-foreground",
          isLiked.isLoading && "aspect-square justify-center",
        ])}
      >
        {isLiked.isLoading && <SpinnerIcon className="animate-spin text-xl" />}
        {isLiked.data && (
          <>
            <button
              className="flex items-center gap-2 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLiked?.isLoading}
              onClick={
                isLiked?.data?.data.liked
                  ? () => unLikeMutation.mutate()
                  : () => likeMutation.mutate()
              }
            >
              {isLiked?.data?.data ? <LikeFillIcon /> : <LikeOutlineIcon />}
              <p className="text-sm">
                {formatLikeCount(isLiked.data.data.likes || 0)}
              </p>
            </button>
            <button
              className="flex items-center gap-2 px-2"
              onClick={() => {
                toast({
                  title:
                    "Due to procrastination, dislike functionality will not working. I hope you can understand 🙂",
                });
              }}
            >
              <DislikeOutlineIcon />
              <p className="text-sm">0</p>
            </button>
          </>
        )}
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
        href={video?.video.url}
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
