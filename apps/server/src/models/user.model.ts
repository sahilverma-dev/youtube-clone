import { Schema, model, Types, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../constants/env";

export interface IUser {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: Types.ObjectId[];
  password: string;
  refreshToken?: string;
}

export interface IUserMethods {
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

export type UserModel = Model<IUser, unknown, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const { _id, email, username, fullName } = this;
  return jwt.sign(
    { _id, email, username, fullName },
    ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  const { _id } = this;
  return jwt.sign({ _id }, REFRESH_TOKEN_SECRET as string, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const User = model<IUser, UserModel>("User", userSchema); // Changed export name to UserModel
