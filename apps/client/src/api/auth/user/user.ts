import { api } from "@/api";

export const getUser = async () => {
  try {
    const { data } = await api.v1({
      url: "/users/current-user",
      withCredentials: true,
    });

    return data;
  } catch (e) {
    console.log(e);
  }
};
