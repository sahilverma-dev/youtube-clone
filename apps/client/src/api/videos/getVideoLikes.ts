import { ApiResponse } from "@/interfaces";
import { api } from "..";

type Type = (videoId: string) => Promise<ApiResponse<any>>;

export const getVideoLikes: Type = async (videoId) => {
  try {
    const { data } = await api.v1({});

    return data;
  } catch (error) {
    console.log(error);
  }
};
