import { Router } from "express";
import { likeVideo } from "../controllers/likes.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/video/:id", verifyJWT, likeVideo);

export const likeRouter = router;
