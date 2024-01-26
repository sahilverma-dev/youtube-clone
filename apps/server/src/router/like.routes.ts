import { Router } from "express";
import {
  isVideoLiked,
  likeVideo,
  unlikeVideo,
  videoLikes,
} from "../controllers/likes.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/video/:id", verifyJWT, likeVideo);
router.post("/video/:id/unlike", verifyJWT, unlikeVideo);
router.get("/video/:id/likes", verifyJWT, videoLikes);
router.get("/video/:id/liked", verifyJWT, isVideoLiked);

export const likeRouter = router;
