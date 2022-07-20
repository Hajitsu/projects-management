const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { createPathDirectory } = require("./utility");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, createPathDirectory());
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file?.originalname || "");
    cb(null, Date.now() + ext);
  },
});

const uploadByMulter = multer({ storage: storage });

module.exports = {
  uploadByMulter,
};
