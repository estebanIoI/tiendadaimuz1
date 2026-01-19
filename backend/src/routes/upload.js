const express = require('express');
const router = express.Router();
const multer = require('multer');

// Usar memoria en lugar de disco para convertir a base64
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo por imagen
  }
});

router.post('/', upload.any(), async (req, res) => {
  try {
    const files = req.files || [];
    const urls = files.map(f => {
      // Convertir buffer a base64 data URL
      const base64 = f.buffer.toString('base64');
      const mimeType = f.mimetype || 'image/png';
      return `data:${mimeType};base64,${base64}`;
    });
    res.json({ urls, files: files.map(f => ({ originalname: f.originalname, size: f.size })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error subiendo archivos' });
  }
});

module.exports = router;
