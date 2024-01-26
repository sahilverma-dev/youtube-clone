import { ApiResponse, Video } from "@/interfaces";
import { api } from "..";

type Type = (formData: FormData) => Promise<ApiResponse<Video>>;

export const uploadVideo: Type = async (formData) => {
  try {
    const { data } = await api.v1({
      url: `/videos/upload`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload video");
  }
};
