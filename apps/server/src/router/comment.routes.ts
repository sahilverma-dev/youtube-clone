import { Router } from "express";

// middlewares
import { verifyJWT } from "../middlewares/auth.middleware";

// controllers
import {
  addCommentToVideo,
  editCommentOfVideo,
  getVideoComments,
  removeCommentFromVideo,
} from "../controllers/comments.controller";

const router = Router();

router.get("/video/:videoId", getVideoComments);
router.delete("/video/:videoId", removeCommentFromVideo);
router.patch("/video/:videoId", editCommentOfVideo);

router.post("/video", verifyJWT, addCommentToVideo);

export const commentRouter = router;
