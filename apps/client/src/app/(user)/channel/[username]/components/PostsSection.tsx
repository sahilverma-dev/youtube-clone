"use client";

import { getChannelVideosByUsername } from "@/api/channel/getChannelVideosByUsername";

import { FC } from "react";

interface Props {
  username: string;
}

const PostsSection: FC<Props> = async ({ username }) => {
  return <div className="p-4">PostsSection</div>;
};

export default PostsSection;
