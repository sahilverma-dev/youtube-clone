import { Router } from "express";

// middlewares
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

// controllers
import {
  getVideoInfo,
  updateVideo,
  uploadVideo,
} from "../controllers/videos.controller";

const router = Router();

// normal routes
router.get("/:id", getVideoInfo);

// secured routes
router.post(
  "/upload",
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnailFile",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

router.patch(
  "/:id",
  verifyJWT,
  upload.fields([
    {
      name: "thumbnailFile",
      maxCount: 1,
    },
  ]),
  updateVideo
);

export const videosRouter = router;
