import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const allowedFormats = ["jpg", "jpeg", "png", "webp", "gif"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const safeName =
      file.originalname
        ?.toLowerCase()
        ?.replace(/\.[^/.]+$/, "")
        ?.replace(/[^a-z0-9]+/g, "-")
        ?.replace(/^-+|-+$/g, "") || "image";

    return {
      folder: "maryama-collections",
      resource_type: "image",
      public_id: `${Date.now()}-${safeName}`,
      allowed_formats: allowedFormats,
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(new Error("Only JPG, JPEG, PNG, WEBP, and GIF image files are allowed"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;