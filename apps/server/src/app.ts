import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { COOKIE_SECRET, CORS_ORIGIN } from "./constants/env";

const app = express();

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    limit: "16kb",
    extended: true,
  })
);
app.use(express.static("public"));
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(cookieParser(COOKIE_SECRET));
app.use("/", (req, res) => {
  res.send("Hello");
});

export { app };
