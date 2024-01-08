import { Document, Types } from "mongoose";

import { NextFunction, Request, Response } from "express";
import { IUser, IUserMethods } from "../models/user.model";

interface RequestWithUser extends Request {
  user?: Document<unknown, unknown, IUser> &
    Omit<
      IUser & {
        _id: Types.ObjectId;
      },
      keyof IUserMethods
    > &
    IUserMethods;
}

const asyncHandler = (
  requestHandler: (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export { asyncHandler };
