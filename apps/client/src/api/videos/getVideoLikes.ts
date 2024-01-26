import { ApiResponse } from "@/interfaces";
import { api } from "..";

type Type = (videoId: string) => Promise<
  ApiResponse<{
    liked: boolean;
    likes: number;
  }>
>;

export const getVideoLikes: Type = async (videoId) => {
  try {
    const { data } = await api.v1({
      url: `/like/video/${videoId}/likes`,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};
