import { ApiError } from "../utils/ApiErrors";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const healthCheck = asyncHandler(async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "ok",
    responseTime: process.hrtime(),
    timestamp: Date.now(),
  };
  try {
    res
      .status(200)
      .json(new ApiResponse(200, "Server is Healthy", healthCheck));
  } catch (error: any) {
    console.error("Error in health check", error);
    healthCheck.message = error;
    throw new ApiError(503, " Got error in health check");
  }
});
