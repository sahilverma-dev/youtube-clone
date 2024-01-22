import { getChannelByUsername } from "@/api/channel/getChannelByUsername";
import { formatLikeCount } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";
import SubscribeSection from "./components/SubscribeSection";
import TabSection from "./components/TabSection";

interface Props {
  params: { username: string };
  searchParams: {};
}

const Channel: FC<Props> = async ({ params }) => {
  const { username } = params;

  const { data: channel } = await getChannelByUsername(username);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {channel.coverImage && (
        <Image
          src={channel.coverImage.url}
          height={300}
          width={1300}
          className="h-52 w-full rounded-lg object-cover"
          alt={`${channel.fullName} banner`}
        />
      )}
      <div className="flex h-40 w-full items-center justify-start gap-4">
        <Image
          src={channel.avatar ? channel.avatar.url : "/default-user.png"}
          height={300}
          width={300}
          alt={channel.fullName}
          className="h-full w-auto object-cover aspect-square rounded-full"
        />
        <div className="flex-grow h-full flex flex-col gap-2">
          <h1 className="text-lg font-semibold">{channel.fullName}</h1>
          <p className="text-sm">
            @{channel.username} ‧ {formatLikeCount(98798666)} Subscribers ‧
            {formatLikeCount(654)} videos
          </p>

          <p className="text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis, rem
            a? Repellendus amet quod debitis mollitia facilis beatae in atque,
            sapiente dolor nesciunt voluptate repellat, autem nobis odit hic
            quo.
          </p>
          <SubscribeSection channel={channel} />
        </div>
      </div>
      <TabSection channel={channel} />
    </div>
  );
};

export default Channel;
