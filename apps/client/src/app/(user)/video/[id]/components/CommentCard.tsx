"use client";

import { FC } from "react";
import { Comment } from "@/interfaces";

// utils
import { getTime } from "@/lib/utils";

// components
import Image from "next/image";

interface Props {
  comment: Comment;
}

const CommentCard: FC<Props> = ({ comment }) => {
  return (
    <div className="w-full flex items-center gap-2">
      <Image
        src={comment.owner.avatar}
        alt={comment.owner.fullName}
        height={50}
        width={50}
        className="h-10 w-10 aspect-square rounded-full object-cover"
      />
      <div className="w-full ">
        <p className="font-medium text-sm">
          @{comment.owner.username}{" "}
          <span className="text-xs text-secondary-foreground">
            {getTime(comment.createdAt)}
          </span>
        </p>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentCard;
