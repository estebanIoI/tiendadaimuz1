import { NextRequest, NextResponse } from 'next/server';

interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

interface ClienteData {
  nombre: string;
  telefono: string;
  email: string;
  cedula: string;
  departamento: string;
  municipio: string;
  direccion: string;
  barrio: string;
  notas: string;
}

interface PedidoData {
  numeroPedido: string;
  fecha: string;
  cliente: ClienteData;
  productos: ProductoCarrito[];
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    const data: PedidoData = await request.json();

    // Generar HTML del correo
    const htmlEmail = generarHTMLCorreo(data);

    // Aquí puedes integrar tu servicio de email preferido:
    // Opción 1: Resend (recomendado, fácil de configurar)
    // Opción 2: Nodemailer con SMTP
    // Opción 3: SendGrid, Mailgun, etc.

    // Por ahora, simulamos el envío exitoso
    // Para producción, descomenta y configura una de las opciones abajo

    /*
    // OPCIÓN 1: Usar Resend (npm install resend)
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'G&S Muebles <pedidos@gsmuebles.com>',
      to: data.cliente.email,
      subject: `Confirmación de Pedido #${data.numeroPedido} - G&S Muebles`,
      html: htmlEmail,
    });
    */

    /*
    // OPCIÓN 2: Usar Nodemailer (npm install nodemailer)
    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"G&S Muebles" <pedidos@gsmuebles.com>',
      to: data.cliente.email,
      subject: `Confirmación de Pedido #${data.numeroPedido} - G&S Muebles`,
      html: htmlEmail,
    });
    */

    console.log('Email preparado para:', data.cliente.email);
    console.log('Pedido:', data.numeroPedido);

    return NextResponse.json({
      success: true,
      message: 'Correo enviado exitosamente',
      pedido: data.numeroPedido
    });

  } catch (error) {
    console.error('Error al enviar correo:', error);
    return NextResponse.json(
      { success: false, error: 'Error al enviar el correo' },
      { status: 500 }
    );
  }
}

function generarHTMLCorreo(data: PedidoData): string {
  const productosHTML = data.productos.map(item => `
    <tr>
      <td style="padding: 16px; border-bottom: 1px solid #f3f4f6;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${item.imagen}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border: 1px solid #e5e7eb;">
          <div>
            <div style="font-weight: 400; color: #111827;">${item.nombre}</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Cantidad: ${item.cantidad}</div>
          </div>
        </div>
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #111827;">
        $${(item.precio * item.cantidad).toLocaleString('es-CO')}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido - G&S Muebles</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

    <!-- Header -->
    <div style="background-color: #111827; padding: 32px; text-align: center;">
      <h1 style="margin: 0; color: white; font-weight: 300; font-size: 28px; letter-spacing: 2px;">G&S</h1>
      <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px; letter-spacing: 1px;">MUEBLES</p>
    </div>

    <!-- Contenido principal -->
    <div style="background-color: white; padding: 40px 32px;">

      <!-- Mensaje de éxito -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="width: 64px; height: 64px; background-color: #d1fae5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 style="margin: 0 0 8px; color: #111827; font-weight: 300; font-size: 24px;">¡Pedido Confirmado!</h2>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Gracias por tu compra, ${data.cliente.nombre}</p>
      </div>

      <!-- Número de pedido -->
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; margin-bottom: 32px; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 4px; color: #6b7280; font-size: 11px; letter-spacing: 1px;">NÚMERO DE PEDIDO</p>
        <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 400; letter-spacing: 2px;">${data.numeroPedido}</p>
      </div>

      <!-- Detalles del pedido -->
      <h3 style="margin: 0 0 16px; color: #111827; font-weight: 400; font-size: 14px; letter-spacing: 1px; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px;">DETALLES DEL PEDIDO</h3>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 12px 16px; background-color: #f9fafb; font-size: 11px; color: #6b7280; letter-spacing: 1px; font-weight: 400;">PRODUCTO</th>
            <th style="text-align: right; padding: 12px 16px; background-color: #f9fafb; font-size: 11px; color: #6b7280; letter-spacing: 1px; font-weight: 400;">SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${productosHTML}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding: 20px 16px; font-weight: 500; color: #111827; border-top: 2px solid #111827;">TOTAL</td>
            <td style="padding: 20px 16px; text-align: right; font-weight: 500; color: #111827; font-size: 20px; border-top: 2px solid #111827;">$${data.total.toLocaleString('es-CO')} COP</td>
          </tr>
        </tfoot>
      </table>

      <!-- Datos de envío -->
      <h3 style="margin: 32px 0 16px; color: #111827; font-weight: 400; font-size: 14px; letter-spacing: 1px; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px;">DATOS DE ENVÍO</h3>

      <table style="width: 100%; font-size: 14px; color: #374151;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 40%;">Nombre:</td>
          <td style="padding: 8px 0;">${data.cliente.nombre}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Teléfono:</td>
          <td style="padding: 8px 0;">${data.cliente.telefono}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Email:</td>
          <td style="padding: 8px 0;">${data.cliente.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Cédula:</td>
          <td style="padding: 8px 0;">${data.cliente.cedula}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Dirección:</td>
          <td style="padding: 8px 0;">${data.cliente.direccion}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Barrio:</td>
          <td style="padding: 8px 0;">${data.cliente.barrio || 'No especificado'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Municipio:</td>
          <td style="padding: 8px 0;">${data.cliente.municipio}, ${data.cliente.departamento}</td>
        </tr>
        ${data.cliente.notas ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Notas:</td>
          <td style="padding: 8px 0;">${data.cliente.notas}</td>
        </tr>
        ` : ''}
      </table>

      <!-- Mensaje de contacto -->
      <div style="background-color: #fef3c7; border: 1px solid #fcd34d; padding: 16px; margin-top: 32px;">
        <p style="margin: 0; color: #92400e; font-size: 13px;">
          <strong>¿Tienes preguntas?</strong><br>
          Contáctanos por WhatsApp al <a href="https://wa.me/573102673695" style="color: #92400e;">+57 310 267 3695</a> o responde a este correo.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding: 24px; text-align: center;">
      <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">© 2026 G&S Muebles. Todos los derechos reservados.</p>
      <p style="margin: 0; color: #9ca3af; font-size: 11px;">Mocoa, Putumayo - Colombia</p>
    </div>

  </div>
</body>
</html>
  `;
}
