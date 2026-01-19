const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/banners - Obtener todos los banners activos (público)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Banner WHERE activo = TRUE ORDER BY orden ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo banners:', error);
    res.status(500).json({ error: 'Error obteniendo banners' });
  }
});

// GET /api/banners/all - Obtener todos los banners (admin)
router.get('/all', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Banner ORDER BY orden ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo banners:', error);
    res.status(500).json({ error: 'Error obteniendo banners' });
  }
});

// POST /api/banners - Crear banner (admin)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { imagen, titulo, subtitulo, textoBoton, linkBoton, activo, orden } = req.body;

    const [result] = await pool.query(
      `INSERT INTO Banner (imagen, titulo, subtitulo, textoBoton, linkBoton, activo, orden)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [imagen, titulo || null, subtitulo || null, textoBoton || 'SHOP NOW', linkBoton || null, activo !== false, orden || 0]
    );

    const [newBanner] = await pool.query('SELECT * FROM Banner WHERE id = ?', [result.insertId]);
    res.status(201).json(newBanner[0]);
  } catch (error) {
    console.error('Error creando banner:', error);
    res.status(500).json({ error: 'Error creando banner' });
  }
});

// PUT /api/banners/:id - Actualizar banner (admin)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { imagen, titulo, subtitulo, textoBoton, linkBoton, activo, orden } = req.body;

    await pool.query(
      `UPDATE Banner SET imagen = ?, titulo = ?, subtitulo = ?, textoBoton = ?, linkBoton = ?, activo = ?, orden = ? WHERE id = ?`,
      [imagen, titulo || null, subtitulo || null, textoBoton || 'SHOP NOW', linkBoton || null, activo !== false, orden || 0, id]
    );

    const [updated] = await pool.query('SELECT * FROM Banner WHERE id = ?', [id]);
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Banner no encontrado' });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error('Error actualizando banner:', error);
    res.status(500).json({ error: 'Error actualizando banner' });
  }
});

// DELETE /api/banners/:id - Eliminar banner (admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Banner WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Banner no encontrado' });
    }
    res.json({ message: 'Banner eliminado' });
  } catch (error) {
    console.error('Error eliminando banner:', error);
    res.status(500).json({ error: 'Error eliminando banner' });
  }
});

module.exports = router;
