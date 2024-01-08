import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiErrors";

import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET } from "../constants/env";
import { User } from "../models/user.model";
import { Types } from "mongoose";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized user");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET as string) as {
      _id: Types.ObjectId;
    };

    if (!decodedToken) {
      throw new ApiError(401, "Unauthorized user");
    }

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized user");
    }

    req.user = user;
    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Unauthorized user");
  }
});
