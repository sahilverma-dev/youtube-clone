import fs from "fs";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../constants/env";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export type FolderType =
  | "videos"
  | "avatar"
  | "thumbnails"
  | "covers"
  | "others";

const defaultFolder: FolderType = "others";

export const uploadFile = async (
  file: string,
  folder?: FolderType
): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder || defaultFolder,
    });
    console.error(`File uploaded to Cloudinary on ${folder}`);

    return result;
  } catch (error: any) {
    console.error("Error uploading file to Cloudinary:".red, error.message);
    throw error;
  } finally {
    fs.unlinkSync(file);
  }
};

export const mapToFileObject = (file: UploadApiResponse | null | undefined) => {
  if (!file) {
    return null;
  }

  return {
    secure_url: file?.secure_url,
    url: file?.url,
    width: file?.width,
    height: file?.height,
    public_id: file?.public_id,
    resource_type: file?.resource_type,
    duration: file?.duration,
  };
};

export const removeFiles = async (...publicIds: string[]) => {
  try {
    if (publicIds.length == 0) return;

    const response = await cloudinary.api.delete_resources(publicIds);
    return response;
  } catch (error) {
    console.log("CLOUDINARY: Failed to remove file. ".red, error);
    throw error;
  }
};
