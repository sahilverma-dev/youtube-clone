"use client";

import { FC } from "react";
import { Comment } from "@/interfaces";

// utils
import { getTime } from "@/lib/utils";

// components
import Image from "next/image";
import Link from "next/link";

interface Props {
  comment: Comment;
}

const CommentCard: FC<Props> = ({ comment }) => {
  return (
    <div className="w-full flex items-center gap-2">
      <Link href={`/channel/${comment.owner?.username}`}>
        <Image
          src={
            comment?.owner?.avatar
              ? comment?.owner.avatar.url
              : "/default-user.png"
          }
          alt={comment?.owner?.fullName}
          height={50}
          width={50}
          className="h-10 w-10 aspect-square rounded-full object-cover"
        />
      </Link>
      <div className="w-full ">
        <p className="font-medium text-sm">
          <Link
            href={`/channel/${comment?.owner?.username}`}
            className="hover:text-secondary-foreground"
          >
            @{comment?.owner?.username}
          </Link>{" "}
          <span className="text-xs text-secondary-foreground">
            {getTime(comment?.createdAt)}
          </span>
        </p>
        <p className="text-sm">{comment?.content}</p>
      </div>
    </div>
  );
};

export default CommentCard;
