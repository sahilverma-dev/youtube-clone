import { Video } from "@/interfaces";

type Type = () => Promise<{
  videos: Video[];
  totalVideos: number;
  nextPage: boolean;
  prevPage: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}>;

export const getFeedVideos: Type = async () => {
  const response = await fetch(
    "http://localhost:5000/api/v1/videos/?page=0&query=hello&limit=20",
    {
      cache: "no-cache",
    }
  );
  const data = await response.json();

  return data;
};
