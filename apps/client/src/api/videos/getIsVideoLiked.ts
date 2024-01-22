import { ApiResponse } from "@/interfaces";
import { api } from "..";

type Type = (videoId: string) => Promise<ApiResponse<boolean>>;

export const getIsVideoLiked: Type = async (videoId) => {
  try {
    const { data } = await api.v1({
      url: `/like/video/${videoId}/liked`,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};
