import { api } from "@/api";
import { AxiosError } from "axios";

export const unLikeVideo = async ({ videoId }: { videoId: string }) => {
  try {
    const { data } = await api.v1({
      url: `/like/video/${videoId}/unlike`,
      method: "post",
    });

    return data;
  } catch (e) {
    const { response } = e as AxiosError;

    if (response?.status === 401) throw new Error("Login to like the video");

    throw new Error("Failed to add comment");
  }
};
