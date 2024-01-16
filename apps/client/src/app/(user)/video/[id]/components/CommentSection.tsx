"use client";

import { getVideoComments } from "@/api/comments/getVideoComments";
import { getTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FC } from "react";

interface Props {
  id: string;
}

const CommentSection: FC<Props> = ({ id }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getVideoComments(id),
  });
  return (
    <div>
      <h2 className="text-lg font-bold"> {data?.comments.length} Comments</h2>

      <div className="space-y-2 w-full">
        {data?.comments.map((comment) => (
          <div key={comment._id} className="w-full flex items-center gap-2">
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
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
