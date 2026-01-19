"use client";

import React, { useState } from 'react';
import { ESTADOS_PEDIDO } from '@/constants';
import type { Pedido } from '@/types';

interface PedidosAdminProps {
  pedidos: Pedido[];
  onActualizarEstado: (id: number, estado: string) => void;
}

export function PedidosAdmin({ pedidos, onActualizarEstado }: PedidosAdminProps) {
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  function openModal(p: Pedido) {
    setSelectedPedido(p);
  }

  function closeModal() {
    setSelectedPedido(null);
  }

  function handleChangeEstado(id: number, estado: string) {
    onActualizarEstado(id, estado);
    setSelectedPedido(prev => prev ? { ...prev, estado } : prev);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-gray-900">Pedidos</h2>
        <div className="flex gap-2">
          <button
            onClick={exportPedidosToCSV}
            className="text-sm bg-green-600 text-white px-3 py-1 rounded"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
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
              <tr key={pedido.id} className="hover:bg-gray-50">
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
                    className={`text-xs px-2 py-1 border rounded font-light ${
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
                    className="text-xs text-gray-600 hover:text-gray-900 font-light"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeModal} />
          <div className="bg-white rounded shadow-lg z-10 w-full max-w-2xl mx-4 p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">Pedido #{selectedPedido.id}</h3>
              <button onClick={closeModal} className="text-gray-500">Cerrar</button>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <div className="mb-4">
                <h4 className="font-medium text-base mb-2">Datos del Comprador</h4>
                <p><strong>Nombre:</strong> {selectedPedido.detalles?.nombre || selectedPedido.cliente}</p>
                <p><strong>Teléfono:</strong> {selectedPedido.detalles?.telefono}</p>
                <p><strong>Email:</strong> {selectedPedido.detalles?.email}</p>
                <p><strong>Cédula:</strong> {selectedPedido.detalles?.cedula}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-base mb-2">Datos de Envío</h4>
                <p><strong>Departamento:</strong> {selectedPedido.detalles?.departamento}</p>
                <p><strong>Municipio:</strong> {selectedPedido.detalles?.municipio}</p>
                <p><strong>Dirección:</strong> {selectedPedido.detalles?.direccion}</p>
                <p><strong>Barrio:</strong> {selectedPedido.detalles?.barrio}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-base mb-2">Resumen del Pedido</h4>
                {selectedPedido.detalles?.items ? (
                  selectedPedido.detalles.items.map((item, i) => (
                    <div key={i} className="mb-3 p-2 border rounded">
                      <p className="font-medium">{item.nombre}</p>
                      <p>Talla: {item.tallaSeleccionada} / Color: {item.colorSeleccionado}</p>
                      <p>Cantidad: {item.cantidad}</p>
                      <p>${item.precio.toLocaleString('es-CO')} c/u</p>
                      <p>Subtotal: ${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                    </div>
                  ))
                ) : (
                  <p>No hay detalles de productos disponibles.</p>
                )}
                <p className="mt-2 font-medium"><strong>Total:</strong> ${selectedPedido.total.toLocaleString('es-CO')}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-base mb-2">Notas Adicionales</h4>
                <p>{selectedPedido.detalles?.notas || 'Sin notas adicionales.'}</p>
              </div>

              <div className="mt-3">
                <label className="block text-xs text-gray-600 mb-1">Estado</label>
                <select
                  value={selectedPedido.estado}
                  onChange={(e) => handleChangeEstado(selectedPedido.id, e.target.value)}
                  className="text-sm px-2 py-1 border rounded"
                >
                  {ESTADOS_PEDIDO.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={closeModal} className="px-3 py-1 bg-gray-200 rounded mr-2">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
