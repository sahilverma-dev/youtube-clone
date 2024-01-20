import { ApiResponse, Channel } from "@/interfaces";
import { api } from "..";

type Type = (username: string) => Promise<ApiResponse<Channel>>;

export const getChannelByUsername: Type = async (username) => {
  const response = await fetch(
    `http://localhost:5000/api/v1/users/c/${username}`,
    {
      cache: "no-cache",
    }
  );
  const data = await response.json();

  return data;
};
