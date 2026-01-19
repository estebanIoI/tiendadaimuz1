const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, `${timestamp}_${safe}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.any(), async (req, res) => {
  try {
    const files = req.files || [];
    const urls = files.map(f => `/uploads/${f.filename || path.basename(f.path)}`);
    res.json({ urls, files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error subiendo archivos' });
  }
});

module.exports = router;
