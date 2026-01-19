"use client";

import type { Producto, Pedido } from '@/types';

interface DashboardProps {
  productos: Producto[];
  pedidos: Pedido[];
}

export function Dashboard({ productos, pedidos }: DashboardProps) {
  const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente').length;
  const ventasMes = pedidos
    .filter(p => p.estado !== 'Cancelado')
    .reduce((sum, p) => sum + p.total, 0);

  return (
    <div>
      <h2 className="text-2xl font-light text-gray-900 mb-8">Dashboard</h2>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 border border-gray-200">
          <div className="text-3xl font-light text-gray-900 mb-2">{productos.length}</div>
          <div className="text-xs text-gray-500 tracking-wide">TOTAL DE PRODUCTOS</div>
        </div>
        <div className="bg-white p-6 border border-gray-200">
          <div className="text-3xl font-light text-gray-900 mb-2">{pedidosPendientes}</div>
          <div className="text-xs text-gray-500 tracking-wide">PEDIDOS PENDIENTES</div>
        </div>
        <div className="bg-white p-6 border border-gray-200">
          <div className="text-3xl font-light text-gray-900 mb-2">
            ${ventasMes.toLocaleString('es-CO')}
          </div>
          <div className="text-xs text-gray-500 tracking-wide">VENTAS DEL MES</div>
        </div>
      </div>

      {/* Últimos pedidos */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-lg font-light text-gray-900 mb-4">Últimos Pedidos</h3>
        {pedidos.length === 0 ? (
          <p className="text-gray-500 text-sm font-light">No hay pedidos aún</p>
        ) : (
          <div className="space-y-3">
            {pedidos.slice(0, 5).map(pedido => (
              <div
                key={pedido.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <div className="text-sm text-gray-900">{pedido.cliente}</div>
                  <div className="text-xs text-gray-500">{pedido.fecha}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900">
                    ${pedido.total.toLocaleString('es-CO')}
                  </div>
                  <div className={`text-xs ${
                    pedido.estado === 'Pendiente' ? 'text-yellow-600' :
                    pedido.estado === 'Entregado' ? 'text-green-600' :
                    pedido.estado === 'Cancelado' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {pedido.estado}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
