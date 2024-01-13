import { Router } from "express";

// routes import
import { userRouter } from "./user.routes";
import { videosRouter } from "./video.routes";
import { postRoutes } from "./post.routes";

const routers = Router();

// routes declaration
routers.use("/users", userRouter);
routers.use("/videos", videosRouter);
routers.use("/posts", postRoutes);

export { routers };
