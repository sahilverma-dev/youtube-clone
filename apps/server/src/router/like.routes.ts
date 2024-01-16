import { Router } from "express";
import { likeVideo } from "../controllers/likes.controller";

const router = Router();

router.post("/video/:id", likeVideo);

export const likeRouter = router;
