import multer from "multer";
import fs from "node:fs";

export const Multer_Local = ({
  custom_path = "General",
  custom_types = [],
} = {}) => {
  const full_path = `Uploads/${custom_path}`;
  if (!fs.existsSync(full_path)) {
    fs.mkdirSync(full_path, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, full_path);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "_" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.mimetype)) {
      cb(new Error("Invalid file type 🔴"));
    }
    cb(null, true);
  }
  const upload = multer({ storage, fileFilter });
  return upload;
};

export const Multer_Host = (custom_types = []) => {

  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.mimetype)) {
      return cb(new Error("Invalid file type 🔴"));
    }

    cb(null, true);
  }
  const upload = multer({ storage, fileFilter });
  return upload;
};
