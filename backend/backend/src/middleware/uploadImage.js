const multer = require("multer");
const path = require("path");


// Cấu hình lưu trữ ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/"); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

// Middleware upload ảnh (chỉ chấp nhận ảnh)
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ được upload file ảnh"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
