import { api } from "@/api";
import { Cookies } from "react-cookie";

const COOKIE_OPTIONS: any = {
  path: "/", // Adjust the path as needed
  secure: true, // Enable if using HTTPS
  sameSite: "strict", // Adjust based on your requirements
};

export const registerUser = async (formData: FormData) => {
  try {
    console.log(formData);

    const { data } = await api.v1({
      url: "/users/register",
      method: "post",
      data: formData,
    });

    const cookie = new Cookies();
    cookie.set("accessToken", data?.data?.accessToken, COOKIE_OPTIONS);
    cookie.set("refreshToken", data?.data?.refreshToken, COOKIE_OPTIONS);

    return data;
  } catch (e) {
    console.log(e);
  }
};
