import { getChannelByUsername } from "@/api/channel/getChannelByUsername";
import Image from "next/image";
import { FC } from "react";

interface Props {
  params: { username: string };
  searchParams: {};
}

const Channel: FC<Props> = async ({ params }) => {
  const { username } = params;

  const { data: channel } = await getChannelByUsername(username);

  return (
    <div>
      <Image
        src={channel.avatar}
        height={300}
        width={300}
        alt={channel.fullName}
        className="w-40 h-40 aspect-square rounded-full"
      />
    </div>
  );
};

export default Channel;
