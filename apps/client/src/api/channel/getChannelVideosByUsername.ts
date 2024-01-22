import { ApiResponse, Video } from "@/interfaces";

type Type = (data: {
  username: string;
  page?: number;
  limit?: number;
}) => Promise<
  ApiResponse<{
    videos: Video[];
    totalVideos: number;
    nextPage: number;
    prevPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>
>;

export const getChannelVideosByUsername: Type = async ({
  username,
  page,
  limit,
}) => {
  const response = await fetch(
    `http://localhost:5000/api/v1/users/c/${username}/videos?page=${page}&limit=${limit}`,
    {
      cache: "no-cache",
    }
  );
  const data = await response.json();

  return data;
};
