const multer = require('multer');
const path = require('path');
const fs = require('fs');

const os = require('os');
// Use /tmp if deployed on Vercel (or any serverless that sets NODE_ENV=production or similar), otherwise use local 'uploads'
const isServerless = process.env.VERCEL || process.env.NODE_ENV === 'production';
const uploadDir = isServerless ? '/tmp' : 'uploads';

if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir);
  } catch (err) {
    console.warn("Could not create upload directory, ignoring for serverless environments:", err.message);
  }
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images and Documents only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
