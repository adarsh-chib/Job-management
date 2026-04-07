import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import cloudinary from "../configs/cloudinary";

export const uploadBufferToCloudinary = async (
  fileBuffer: Buffer,
  options: UploadApiOptions,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      if (!result) {
        reject(new Error("Cloudinary upload failed"));
        return;
      }

      resolve(result);
    });

    stream.end(fileBuffer);
  });
};
