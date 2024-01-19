"use client";
import { FC } from "react";

import { getVideoComments } from "@/api/comments/getVideoComments";

import { useQuery } from "@tanstack/react-query";

// components
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";
import CommentSkeleton from "./CommentSkeleton";

interface Props {
  id: string;
}

const CommentSection: FC<Props> = ({ id }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getVideoComments(id),
  });

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold"> {data?.comments.length} Comments</h2>
      <CommentForm videoId={id} />
      <hr />

      <div className="space-y-2 py-4 w-full">
        {isLoading && (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <CommentSkeleton key={index} />
            ))}
          </>
        )}
        {data?.comments.map((comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
