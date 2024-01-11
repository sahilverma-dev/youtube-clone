import { Video } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

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
        <div className="absolute bottom-2 right-2 bg-secondary-foreground/50  dark:bg-secondary-foreground/10 backdrop-blur rounded-md text-xs text-primary-foreground font-medium py-1 px-2">
          1:20:22
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
            className="h-9 w-9 aspect-square rounded-full object-cover"
          />
        </Link>
        <div className="w-full flex flex-col ">
          <Link
            href={`/video/${video._id}`}
            className="font-semibold text-foreground"
          >
            {video.title}
          </Link>
          <p className="text-xs font-medium text-secondary-foreground">
            {video.owner.fullName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
