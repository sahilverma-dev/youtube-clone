"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Channel } from "@/interfaces";

import { FC } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import VideosSection from "./VideosSection";

interface Props {
  channel: Channel;
}

const TabSection: FC<Props> = ({ channel }) => {
  return (
    <Tabs.Root className="" defaultValue="videos">
      <Tabs.List className="shrink-0 flex border-b">
        <Tabs.Trigger
          className={cn([
            buttonVariants({ variant: "ghost" }),
            "rounded-none border-secondary-foreground data-[state=active]:border-b-2",
          ])}
          value="videos"
        >
          Videos
        </Tabs.Trigger>
        <Tabs.Trigger
          className={cn([
            buttonVariants({ variant: "ghost" }),
            "rounded-none border-secondary-foreground data-[state=active]:border-b-2",
          ])}
          value="posts"
        >
          Posts
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="videos">
        <VideosSection username={channel.username} />
      </Tabs.Content>
      <Tabs.Content value="posts">posts</Tabs.Content>
    </Tabs.Root>
  );
};

export default TabSection;
