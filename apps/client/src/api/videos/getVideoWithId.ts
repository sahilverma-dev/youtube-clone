import { ApiResponse, Video } from "@/interfaces";

type Type = (id: string) => Promise<ApiResponse<Video>>;

export const getVideoWithId: Type = async (id) => {
  const response = await fetch(`http://localhost:5000/api/v1/videos/${id}`, {
    cache: "no-cache",
  });

  const data = await response.json();

  return data;
};
