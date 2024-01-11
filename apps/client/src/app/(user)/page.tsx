import { getFeedVideos } from "@/api/videos/getFeedVideos";
import VideosGrid from "@/components/custom/VideosGrid";

const Home = async () => {
  const { videos } = await getFeedVideos();

  return (
    <div>
      <VideosGrid videos={videos} />
    </div>
  );
};

export default Home;
