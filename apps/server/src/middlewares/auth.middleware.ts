import { asyncHandler } from "../utils/asyncHandler";

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
      // No token provided, proceed with req.user set to null
      req.user = undefined;
      return next();
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET as string) as {
      _id: Types.ObjectId;
    };

    if (!decodedToken) {
      // Invalid token, proceed with req.user set to null
      req.user = undefined;
      return next();
    }

    const user = await User.findById(decodedToken._id).select(
      "username email fullName avatar"
    );

    if (!user) {
      // User not found, proceed with req.user set to null
      req.user = undefined;
      return next();
    }

    req.user = user;
    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle token verification errors
    req.user = undefined;
    return next();
  }
});
