import { Router } from "express";
import { healthCheck } from "../controllers/health-check.controller";

const router = Router();

router.get("/", healthCheck);

export const healthCheckRouter = router;
