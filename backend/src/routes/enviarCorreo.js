const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    // Si están configuradas las credenciales SMTP, intentar enviar
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const html = (data && data.productos) ? `<p>Pedido ${data.numeroPedido} - Total: ${data.total}</p>` : '<p>Pedido recibido</p>';

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        to: (data.cliente && data.cliente.email) || process.env.SMTP_TO || 'admin@example.com',
        subject: `Confirmación pedido ${data.numeroPedido || ''}`,
        html
      });
      return res.json({ success: true, message: 'Correo enviado' });
    }

    // Si no hay SMTP, simular envío
    console.log('Simulando envío de correo', data && data.cliente && data.cliente.email);
    res.json({ success: true, message: 'Simulado: correo preparado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar correo' });
  }
});

module.exports = router;
