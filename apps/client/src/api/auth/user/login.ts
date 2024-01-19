import { api } from "@/api";
import { AxiosError } from "axios";
import { Cookies } from "react-cookie";

const COOKIE_OPTIONS: any = {
  path: "/", // Adjust the path as needed
  secure: true, // Enable if using HTTPS
  sameSite: "strict", // Adjust based on your requirements
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await api.v1({
      url: "/users/login",
      method: "post",
      data: {
        email,
        password,
      },
    });

    const cookie = new Cookies();
    cookie.set("accessToken", data?.data?.accessToken, COOKIE_OPTIONS);
    cookie.set("refreshToken", data?.data?.refreshToken, COOKIE_OPTIONS);

    return data;
  } catch (e) {
    const { response } = e as AxiosError;

    if (response?.status === 401) throw new Error("Password is wrong");

    throw new Error("Failed to login");
  }
};
