const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/config - Obtener todas las configuraciones (público)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT clave, valor FROM Config');
    const config = {};
    rows.forEach(row => {
      config[row.clave] = row.valor;
    });
    res.json(config);
  } catch (error) {
    console.error('Error obteniendo configuraciones:', error);
    res.status(500).json({ error: 'Error obteniendo configuraciones' });
  }
});

// PUT /api/config/:clave - Actualizar configuración (admin)
router.put('/:clave', requireAuth, async (req, res) => {
  try {
    const { clave } = req.params;
    const { valor } = req.body;

    await pool.query(
      `INSERT INTO Config (clave, valor) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE valor = VALUES(valor)`,
      [clave, valor]
    );

    res.json({ clave, valor });
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({ error: 'Error actualizando configuración' });
  }
});

module.exports = router;