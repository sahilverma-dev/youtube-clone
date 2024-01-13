import { Router } from "express";
import {
  createPost,
  deletePost,
  editPost,
  getPost,
} from "../controllers/post.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/new", verifyJWT, createPost);
router.get("/:id", getPost);
router.patch("/:id", verifyJWT, editPost);
router.delete("/:id", verifyJWT, deletePost);

export const postRoutes = router;
