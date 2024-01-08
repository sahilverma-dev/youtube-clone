import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../constants/env";
import { isValidUrl } from "../utils";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File is uploaded on cloudinary".green, response.url.blue);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export const destroyFromCloudinary = async (cdn: string) => {
  try {
    if (!cdn) {
      console.error("CDN URL is missing. Cannot delete from Cloudinary.");
      return null;
    }
    if (!isValidUrl(cdn)) {
      console.error("CDN URL is not valid");
      return null;
    }

    const response = await cloudinary.uploader.destroy(cdn);

    if (response.result === "ok") {
      console.log(
        "File successfully deleted from Cloudinary. URL:",
        response.url.blue
      );
      return response;
    } else {
      console.error(
        "Failed to delete file from Cloudinary. Response:",
        response
      );
      return null;
    }
  } catch (error) {
    console.error("An error occurred while deleting from Cloudinary:", error);
    return null;
  }
};
