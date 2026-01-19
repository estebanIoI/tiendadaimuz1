"use client";

import React, { useState } from 'react';
import { Copy, Check, Send, Mail } from 'lucide-react';
import { ESTADOS_PEDIDO } from '@/constants';
import type { Pedido } from '@/types';

interface PedidosAdminProps {
  pedidos: Pedido[];
  onActualizarEstado: (id: number, estado: string) => void;
}

export function PedidosAdmin({ pedidos = [], onActualizarEstado }: PedidosAdminProps) {
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showMessages, setShowMessages] = useState(false);

  function generarMensajeWhatsApp(pedido: Pedido): string {
    const items = pedido.detalles?.items || [];
    const productosTexto = items.map(item =>
      `• ${item.nombre}\n  Talla: ${item.tallaSeleccionada} | Color: ${item.colorSeleccionado}\n  Cantidad: ${item.cantidad} x $${item.precio.toLocaleString('es-CO')}`
    ).join('\n\n');

    return `🛍️ *CONFIRMACIÓN DE PEDIDO #${pedido.id}*

Hola ${pedido.detalles?.nombre || pedido.cliente}! 👋

Hemos recibido tu pedido exitosamente. Aquí están los detalles:

📦 *PRODUCTOS:*
${productosTexto}

💰 *TOTAL: $${pedido.total.toLocaleString('es-CO')}*

📍 *DIRECCIÓN DE ENVÍO:*
${pedido.detalles?.direccion || 'N/A'}
${pedido.detalles?.barrio ? `Barrio: ${pedido.detalles.barrio}` : ''}
${pedido.detalles?.municipio}, ${pedido.detalles?.departamento}

📅 *Fecha del pedido:* ${pedido.fecha}
📊 *Estado:* ${pedido.estado}

${pedido.detalles?.notas ? `📝 *Notas:* ${pedido.detalles.notas}\n\n` : ''}Te mantendremos informado sobre el estado de tu pedido.

¡Gracias por tu compra! 🎉`;
  }

  function generarMensajeEmail(pedido: Pedido): string {
    const items = pedido.detalles?.items || [];
    const productosHTML = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.nombre}</strong><br>
          Talla: ${item.tallaSeleccionada} | Color: ${item.colorSeleccionado}<br>
          Cantidad: ${item.cantidad}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${item.precio.toLocaleString('es-CO')}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${(item.precio * item.cantidad).toLocaleString('es-CO')}
        </td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Confirmación de Pedido #${pedido.id}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">¡Pedido Confirmado! 🎉</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px;">Pedido #${pedido.id}</p>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p>Hola <strong>${pedido.detalles?.nombre || pedido.cliente}</strong>,</p>

    <p>Hemos recibido tu pedido exitosamente y estamos preparándolo con mucho cuidado.</p>

    <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Resumen del Pedido</h2>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 5px; overflow: hidden;">
      <thead>
        <tr style="background: #667eea; color: white;">
          <th style="padding: 12px; text-align: left;">Producto</th>
          <th style="padding: 12px; text-align: right;">Precio</th>
          <th style="padding: 12px; text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${productosHTML}
        <tr style="background: #f0f0f0; font-weight: bold;">
          <td colspan="2" style="padding: 15px; text-align: right;">TOTAL:</td>
          <td style="padding: 15px; text-align: right; color: #667eea; font-size: 18px;">$${pedido.total.toLocaleString('es-CO')}</td>
        </tr>
      </tbody>
    </table>

    <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Información de Envío</h2>

    <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
      <p style="margin: 5px 0;"><strong>Nombre:</strong> ${pedido.detalles?.nombre || 'N/A'}</p>
      <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${pedido.detalles?.telefono || 'N/A'}</p>
      <p style="margin: 5px 0;"><strong>Dirección:</strong> ${pedido.detalles?.direccion || 'N/A'}</p>
      ${pedido.detalles?.barrio ? `<p style="margin: 5px 0;"><strong>Barrio:</strong> ${pedido.detalles.barrio}</p>` : ''}
      <p style="margin: 5px 0;"><strong>Ciudad:</strong> ${pedido.detalles?.municipio}, ${pedido.detalles?.departamento}</p>
    </div>

    ${pedido.detalles?.notas ? `
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <strong>📝 Notas del pedido:</strong><br>
      ${pedido.detalles.notas}
    </div>
    ` : ''}

    <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>📅 Fecha del pedido:</strong> ${pedido.fecha}</p>
      <p style="margin: 5px 0;"><strong>📊 Estado actual:</strong> <span style="color: #667eea;">${pedido.estado}</span></p>
    </div>

    <p style="margin-top: 30px;">Te mantendremos informado sobre cada etapa de tu pedido.</p>

    <p style="margin-top: 30px;">¡Gracias por tu compra!</p>

    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
      <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
      <p>Si tienes alguna pregunta, contáctanos por WhatsApp.</p>
    </div>
  </div>
</body>
</html>`;
  }

  function copiarMensaje(tipo: 'whatsapp' | 'email', pedido: Pedido) {
    const mensaje = tipo === 'whatsapp'
      ? generarMensajeWhatsApp(pedido)
      : generarMensajeEmail(pedido);

    navigator.clipboard.writeText(mensaje);
    setCopiedType(tipo);
    setTimeout(() => setCopiedType(null), 2000);
  }

  function enviarWhatsApp(pedido: Pedido) {
    const mensaje = generarMensajeWhatsApp(pedido);
    const telefono = pedido.detalles?.telefono?.replace(/\D/g, '') || '';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  function enviarEmail(pedido: Pedido) {
    const asunto = `Confirmación de Pedido #${pedido.id}`;
    const mensaje = generarMensajeEmail(pedido);
    const email = pedido.detalles?.email || '';

    const url = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent('Por favor, usa un cliente de email que soporte HTML para ver este mensaje correctamente.')}`;
    window.open(url, '_blank');

    navigator.clipboard.writeText(mensaje);
    alert('Mensaje HTML copiado al portapapeles. Pégalo en tu cliente de email para enviar con formato.');
  }

  function exportPedidosToCSV() {
    const headers = ['ID', 'FECHA', 'CLIENTE', 'PRODUCTOS', 'TOTAL', 'ESTADO'];
    const rows = pedidos.map(p => {
      const productos = Array.isArray((p as any).productos)
        ? (p as any).productos.map((pr: any) => (typeof pr === 'string' ? pr : pr.nombre || JSON.stringify(pr))).join('; ')
        : String((p as any).productos || '');
      return [p.id, p.fecha, p.cliente, productos, p.total, p.estado];
    });

    const csv = [headers, ...rows]
      .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pedidos.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function openModal(p: Pedido) {
    setSelectedPedido(p);
    setShowMessages(false);
  }

  function closeModal() {
    setSelectedPedido(null);
    setShowMessages(false);
  }

  function handleChangeEstado(id: number, estado: string) {
    onActualizarEstado(id, estado);
    setSelectedPedido(prev => prev ? { ...prev, estado } : prev);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-gray-900">Pedidos</h2>
        <div className="flex gap-2">
          <button
            onClick={exportPedidosToCSV}
            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">FECHA</th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">CLIENTE</th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">PRODUCTOS</th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">TOTAL</th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">ESTADO</th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pedidos.map(pedido => (
              <tr key={pedido.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm text-gray-600">{pedido.fecha}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{pedido.cliente}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {Array.isArray(pedido.productos) ? pedido.productos.length + ' items' : String(pedido.productos || 'N/A')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  ${pedido.total.toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={pedido.estado}
                    onChange={(e) => onActualizarEstado(pedido.id, e.target.value)}
                    className={`text-xs px-2 py-1 border rounded font-light transition ${
                      pedido.estado === 'Pendiente' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                      pedido.estado === 'Procesando' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                      pedido.estado === 'Enviado' ? 'border-purple-300 bg-purple-50 text-purple-700' :
                      pedido.estado === 'Entregado' ? 'border-green-300 bg-green-50 text-green-700' :
                      'border-red-300 bg-red-50 text-red-700'
                    }`}
                  >
                    {ESTADOS_PEDIDO.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openModal(pedido)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                  >
                    VER DETALLES
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pedidos.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-light">
            No hay pedidos aún.
          </div>
        )}
      </div>

      {selectedPedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeModal} />
          <div className="bg-white rounded-lg shadow-2xl z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-2xl font-medium">Pedido #{selectedPedido.id}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="p-6">
              {/* Botones de acción */}
              <div className="mb-6 flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowMessages(!showMessages)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <Send size={16} />
                  {showMessages ? 'Ocultar' : 'Ver'} Mensajes
                </button>
                <button
                  onClick={() => enviarWhatsApp(selectedPedido)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Send size={16} />
                  Enviar WhatsApp
                </button>
                <button
                  onClick={() => enviarEmail(selectedPedido)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Mail size={16} />
                  Enviar Email
                </button>
              </div>

              {/* Mensajes de confirmación */}
              {showMessages && (
                <div className="mb-6 space-y-4">
                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <span className="text-green-600">WhatsApp</span>
                      </h4>
                      <button
                        onClick={() => copiarMensaje('whatsapp', selectedPedido)}
                        className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-1"
                      >
                        {copiedType === 'whatsapp' ? <Check size={14} /> : <Copy size={14} />}
                        {copiedType === 'whatsapp' ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <pre className="text-xs bg-white p-3 rounded border overflow-x-auto whitespace-pre-wrap">
                      {generarMensajeWhatsApp(selectedPedido)}
                    </pre>
                  </div>

                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <span className="text-blue-600">Email (HTML)</span>
                      </h4>
                      <button
                        onClick={() => copiarMensaje('email', selectedPedido)}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        {copiedType === 'email' ? <Check size={14} /> : <Copy size={14} />}
                        {copiedType === 'email' ? 'Copiado' : 'Copiar HTML'}
                      </button>
                    </div>
                    <div className="text-xs bg-white p-3 rounded border max-h-60 overflow-y-auto">
                      <div dangerouslySetInnerHTML={{ __html: generarMensajeEmail(selectedPedido) }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Detalles del pedido */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-base mb-3 text-gray-700">Datos del Comprador</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nombre:</strong> {selectedPedido.detalles?.nombre || selectedPedido.cliente}</p>
                    <p><strong>Teléfono:</strong> {selectedPedido.detalles?.telefono}</p>
                    <p><strong>Email:</strong> {selectedPedido.detalles?.email}</p>
                    <p><strong>Cédula:</strong> {selectedPedido.detalles?.cedula}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-base mb-3 text-gray-700">Datos de Envío</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Departamento:</strong> {selectedPedido.detalles?.departamento}</p>
                    <p><strong>Municipio:</strong> {selectedPedido.detalles?.municipio}</p>
                    <p><strong>Dirección:</strong> {selectedPedido.detalles?.direccion}</p>
                    <p><strong>Barrio:</strong> {selectedPedido.detalles?.barrio}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-base mb-3 text-gray-700">Resumen del Pedido</h4>
                {selectedPedido.detalles?.items ? (
                  <div className="space-y-3">
                    {selectedPedido.detalles.items.map((item, i) => (
                      <div key={i} className="bg-white p-3 border rounded-lg">
                        <p className="font-medium text-gray-900">{item.nombre}</p>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Talla: {item.tallaSeleccionada} / Color: {item.colorSeleccionado}</p>
                          <p>Cantidad: {item.cantidad} x ${item.precio.toLocaleString('es-CO')}</p>
                          <p className="font-medium text-gray-900">Subtotal: ${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 pt-3 border-t-2 text-right">
                      <p className="text-lg font-bold text-gray-900">
                        TOTAL: ${selectedPedido.total.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No hay detalles de productos disponibles.</p>
                )}
              </div>

              {selectedPedido.detalles?.notas && (
                <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-medium text-base mb-2 text-gray-700">Notas Adicionales</h4>
                  <p className="text-sm text-gray-700">{selectedPedido.detalles.notas}</p>
                </div>
              )}

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Pedido</label>
                <select
                  value={selectedPedido.estado}
                  onChange={(e) => handleChangeEstado(selectedPedido.id, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {ESTADOS_PEDIDO.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
