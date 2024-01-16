import { ApiResponse, Comments } from "@/interfaces";
import { api } from "..";

export const getVideoComments = async (id: string) => {
  try {
    const { data } = await api.v1<ApiResponse<Comments>>(
      `/comment/video/${id}`
    );
    return data.data;
  } catch (error) {
    console.log(error);
  }
};
