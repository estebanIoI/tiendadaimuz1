const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// DB pool (used to test connection at startup)
const pool = require('./db');

// Routes
app.use('/api/login', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/enviar-correo', require('./routes/enviarCorreo'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/config', require('./routes/config'));

const PORT = Number(process.env.PORT) || 4000;

// Test de conexión a la base de datos antes de arrancar
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Conexión a la base de datos: OK');
  } catch (err) {
    console.error('Error conectando a la base de datos:', err && err.message ? err.message : err);
  }
})();

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
