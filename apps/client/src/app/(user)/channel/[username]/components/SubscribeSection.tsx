"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";
import { Channel } from "@/interfaces";

interface Props {
  channel: Channel;
}

const SubscribeSection: FC<Props> = ({ channel }) => {
  return (
    <div>
      <Button className="rounded-full w-auto">Subscribe</Button>
    </div>
  );
};

export default SubscribeSection;
