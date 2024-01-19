import axios from "axios";

export const api = {
  v1: axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
  }),
};
