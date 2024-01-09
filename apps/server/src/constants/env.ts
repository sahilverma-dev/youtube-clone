import { config } from "dotenv";

// dotenv config
config();

// MongoDB
export const MONGODB_URI = process.env.MONGODB_URI as string;
export const PORT = process.env.PORT || 5000;

// Authentication
export const COOKIE_SECRET = process.env.COOKIE_SECRET;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

// CORS
export const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
