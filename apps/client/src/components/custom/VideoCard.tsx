import { Video } from "@/interfaces";
import { formatVideoDuration, formatViewCount, getTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Button } from "../ui/button";

import { HiOutlineDotsVertical as DotsIcon } from "react-icons/hi";

interface Props {
  video: Video;
}

const VideoCard: FC<Props> = ({ video }) => {
  return (
    <div className="w-full space-y-2 mb-4 group">
      <Link
        href={`/video/${video._id}`}
        className="relative block aspect-video w-full rounded-lg overflow-hidden border group-hover:rounded-none transition-all"
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          height={500}
          width={600}
          className="w-full h-full object-cover hover:scale-105 transition-all"
        />
        <div className="absolute bottom-2 right-2 bg-secondary-foreground/50  dark:bg-secondary/10 backdrop-blur rounded-md text-xs text-primary-foreground font-medium py-1 px-2">
          {formatVideoDuration(video.duration)}
        </div>
      </Link>
      <div className="flex flex-grow gap-2">
        <Link
          href={`/channel/${video.owner.username}`}
          className="flex-shrink-0"
        >
          <Image
            src={video.owner.avatar}
            height={70}
            width={70}
            alt={video.owner.fullName}
            className="h-10 w-10 aspect-square rounded-full object-cover"
          />
        </Link>
        <div className="flex-grow flex flex-col ">
          <Link
            href={`/video/${video._id}`}
            className="font-semibold text-foreground"
          >
            {video.title}
          </Link>
          <p className="text-xs font-medium text-secondary-foreground">
            {video.owner.fullName}
          </p>
          <p className="text-xs text-secondary-foreground">
            {formatViewCount(98765)} • {getTime(video.createdAt)}
          </p>
        </div>
        <Button
          className="rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
          variant={"ghost"}
          size={"icon"}
        >
          <DotsIcon size={20} />
        </Button>
      </div>
    </div>
  );
};

export default VideoCard;
