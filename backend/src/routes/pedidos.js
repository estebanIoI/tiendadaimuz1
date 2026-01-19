const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// Listar pedidos (admin)
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Pedido ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Crear pedido (public)
router.post('/', async (req, res) => {
  try {
    const { cliente, total, detalles, productos } = req.body; // productos: [{ id, cantidad }]
    const [result] = await pool.query('INSERT INTO Pedido (cliente, total, detalles) VALUES (?, ?, ?)', [cliente || 'Cliente', total || 0, detalles ? JSON.stringify(detalles) : null]);
    const pedidoId = result.insertId;
    if (Array.isArray(productos)) {
      const insertPromises = productos.map(p => pool.query('INSERT INTO PedidoProducto (pedidoId, productoId, cantidad) VALUES (?, ?, ?)', [pedidoId, p.id || p.productoId, p.cantidad || 1]));
      await Promise.all(insertPromises);
    }
    res.status(201).json({ id: pedidoId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

// Actualizar estado del pedido (admin)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    await pool.query('UPDATE Pedido SET estado = ? WHERE id = ?', [estado, id]);
    res.json({ message: 'Estado actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

module.exports = router;
