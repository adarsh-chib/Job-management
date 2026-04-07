import multer from "multer";
import { ApiError } from "../utils/api.error";

const imageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

const documentMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const createUploader = (allowedMimeTypes: Set<string>, maxFileSize: number) =>
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimeTypes.has(file.mimetype)) {
        cb(new ApiError(400, "Invalid file type"));
        return;
      }

      cb(null, true);
    },
  });

export const uploadProfileImage = createUploader(
  imageMimeTypes,
  5 * 1024 * 1024,
).single("avatar");

export const uploadResume = createUploader(
  documentMimeTypes,
  10 * 1024 * 1024,
).single("resume");
