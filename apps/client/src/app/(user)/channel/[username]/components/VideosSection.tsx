import { getChannelVideosByUsername } from "@/api/channel/getChannelVideosByUsername";
import VideosGrid from "@/components/custom/VideosGrid";
import { FC } from "react";

interface Props {
  username: string;
}

const VideosSection: FC<Props> = async ({ username }) => {
  const { data } = await getChannelVideosByUsername({ username });

  return (
    <div className="p-4">
      <VideosGrid videos={data.videos} showAvatar={false} />
    </div>
  );
};

export default VideosSection;
