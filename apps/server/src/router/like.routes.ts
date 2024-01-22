import { Router } from "express";
import { isVideoLiked, likeVideo } from "../controllers/likes.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/video/:id", verifyJWT, likeVideo);
router.get("/video/:id/liked", verifyJWT, isVideoLiked);

export const likeRouter = router;
