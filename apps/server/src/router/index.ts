import { Router } from "express";

// routes import
import { healthCheckRouter } from "./health-check.routes";
import { userRouter } from "./user.routes";
import { videosRouter } from "./video.routes";
import { postRoutes } from "./post.routes";
import { playlistRouter } from "./playlist.routes";
import { likeRouter } from "./like.routes";
import { commentRouter } from "./comment.routes";

const routers = Router();

// routes declaration
routers.use("/health-check", healthCheckRouter);
routers.use("/users", userRouter);
routers.use("/videos", videosRouter);
routers.use("/posts", postRoutes);
routers.use("/playlists", playlistRouter);
routers.use("/like", likeRouter);
routers.use("/comment", commentRouter);

export { routers };
