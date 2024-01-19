import { api } from "@/api";
import { AxiosError } from "axios";

export const addVideoComment = async ({
  content,
  videoId,
}: {
  videoId: string;
  content: string;
}) => {
  try {
    const { data } = await api.v1({
      url: "/comment/video",
      method: "post",
      data: {
        videoId,
        content,
      },
    });
    console.log(data);

    return data;
  } catch (e) {
    const { response } = e as AxiosError;

    if (response?.status === 401) throw new Error("Login to comment");

    throw new Error("Failed to add comment");
  }
};
