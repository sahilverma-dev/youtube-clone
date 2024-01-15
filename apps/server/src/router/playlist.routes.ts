import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware";

import {
  addVideosToPlaylist,
  createPlaylist,
  deletePlaylist,
  getGetPlaylist,
  removeVideosFromPlaylist,
} from "../controllers/playlist.controller";

const router = Router();

router.get("/:id", getGetPlaylist);
router.delete("/:id", verifyJWT, deletePlaylist);
router.post("/create", verifyJWT, createPlaylist);
router.post("/add-videos", verifyJWT, addVideosToPlaylist);
router.post("/remove-videos", verifyJWT, removeVideosFromPlaylist);

export const playlistRouter = router;
