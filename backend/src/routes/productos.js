const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET todos los productos con sus imágenes
router.get('/', async (req, res) => {
  try {
    // Obtener todos los productos
    const [productos] = await pool.query('SELECT * FROM Producto ORDER BY id DESC');

    // Obtener todas las imágenes
    const [imagenes] = await pool.query('SELECT * FROM ImagenProducto ORDER BY principal DESC');

    // Agrupar imágenes por productoId
    const imagenesPorProducto = {};
    for (const img of imagenes) {
      if (!imagenesPorProducto[img.productoId]) {
        imagenesPorProducto[img.productoId] = [];
      }
      imagenesPorProducto[img.productoId].push({
        id: img.id,
        url: img.url,
        principal: img.principal === 1 || img.principal === true
      });
    }

    // Agregar imágenes a cada producto
    const productosConImagenes = productos.map(p => ({
      ...p,
      imagenes: imagenesPorProducto[p.id] || []
    }));

    res.json(productosConImagenes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST crear producto con imágenes
router.post('/', requireAuth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { nombre, descripcion, categoria, imagen, precioAnterior, precio, stock, esRopa, tallas, colores, imagenes } = req.body;

    // Insertar producto
    const [result] = await connection.query(
      `INSERT INTO Producto (nombre, descripcion, categoria, imagen, precioAnterior, precio, stock, esRopa, tallas, colores) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion || '', categoria || '', imagen || '', precioAnterior || precio || 0, precio || 0, stock || 0, esRopa ? 1 : 0, tallas || null, colores || null]
    );

    const productoId = result.insertId;

    // Insertar imágenes si existen
    if (imagenes && Array.isArray(imagenes) && imagenes.length > 0) {
      for (const img of imagenes) {
        await connection.query(
          `INSERT INTO ImagenProducto (url, productoId, principal) VALUES (?, ?, ?)`,
          [img.url, productoId, img.principal ? 1 : 0]
        );
      }
    }

    await connection.commit();

    // Obtener el producto creado con sus imágenes
    const [rows] = await pool.query('SELECT * FROM Producto WHERE id = ?', [productoId]);
    const [imgs] = await pool.query('SELECT * FROM ImagenProducto WHERE productoId = ? ORDER BY principal DESC', [productoId]);

    const producto = {
      ...rows[0],
      imagenes: imgs.map(img => ({
        id: img.id,
        url: img.url,
        principal: img.principal === 1 || img.principal === true
      }))
    };

    res.status(201).json(producto);
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  } finally {
    connection.release();
  }
});

// PUT actualizar producto con imágenes
router.put('/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { nombre, descripcion, categoria, imagen, precioAnterior, precio, stock, esRopa, tallas, colores, imagenes } = req.body;

    // Actualizar producto
    await connection.query(
      `UPDATE Producto SET nombre=?, descripcion=?, categoria=?, imagen=?, precioAnterior=?, precio=?, stock=?, esRopa=?, tallas=?, colores=? WHERE id=?`,
      [nombre, descripcion || '', categoria || '', imagen || '', precioAnterior || precio || 0, precio || 0, stock || 0, esRopa ? 1 : 0, tallas || null, colores || null, id]
    );

    // Eliminar imágenes antiguas
    await connection.query('DELETE FROM ImagenProducto WHERE productoId = ?', [id]);

    // Insertar nuevas imágenes si existen
    if (imagenes && Array.isArray(imagenes) && imagenes.length > 0) {
      for (const img of imagenes) {
        await connection.query(
          `INSERT INTO ImagenProducto (url, productoId, principal) VALUES (?, ?, ?)`,
          [img.url, id, img.principal ? 1 : 0]
        );
      }
    }

    await connection.commit();

    // Obtener el producto actualizado con sus imágenes
    const [rows] = await pool.query('SELECT * FROM Producto WHERE id = ?', [id]);
    const [imgs] = await pool.query('SELECT * FROM ImagenProducto WHERE productoId = ? ORDER BY principal DESC', [id]);

    const producto = {
      ...rows[0],
      imagenes: imgs.map(img => ({
        id: img.id,
        url: img.url,
        principal: img.principal === 1 || img.principal === true
      }))
    };

    res.json(producto);
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  } finally {
    connection.release();
  }
});

// DELETE eliminar producto (las imágenes se eliminan automáticamente por CASCADE)
router.delete('/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM Producto WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
