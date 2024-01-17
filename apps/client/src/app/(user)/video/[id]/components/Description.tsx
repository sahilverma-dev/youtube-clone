"use client";

import { FC, useState } from "react";

import { motion } from "framer-motion";
import { cn, formatViewCount, getTime } from "@/lib/utils";

interface Props {
  views: number;
  description: string;
  time: string;
}

const Description: FC<Props> = ({ description, time, views }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-secondary p-4 rounded-xl w-full h-auto text-sm cursor-pointer transition-all"
      onClick={() => {
        setOpen((state) => !state);
      }}
    >
      <p className="font-medium text-foreground">
        {/* {formatViewCount(video.views)} */}
        {formatViewCount(3546)} uploaded {getTime(time)}
      </p>
      <p
        //   ! TBD
        className={cn(["text-secondary-foreground w-full"])}
      >
        {open ? description : description.slice(0, 200)}
      </p>
    </div>
  );
};

export default Description;
