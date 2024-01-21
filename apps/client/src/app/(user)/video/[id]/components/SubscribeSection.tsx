"use client";

import { Button } from "@/components/ui/button";
import { Owner } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface Props {
  owner: Owner;
  subscribers: number;
}

const SubscribeSection: FC<Props> = ({ owner }) => {
  return (
    <div className="w-full flex items-center gap-4">
      <Link href={`/channel/${owner.username}`}>
        <Image
          src={owner.avatar ? owner.avatar.url : "/default-user.png"}
          height={100}
          width={100}
          className="h-11 w-11 aspect-square object-cover rounded-full"
          alt={owner.fullName}
        />
      </Link>
      <div className="flex flex-col">
        <Link
          href={`/channel/${owner.username}`}
          className="font-bold text-lg text-foreground"
        >
          {owner.fullName}
        </Link>
        <p className="text-xs font-medium to-secondary-foreground">
          1M subscribers
        </p>
      </div>
      <Button className="rounded-full">Subscribe</Button>
    </div>
  );
};

export default SubscribeSection;
