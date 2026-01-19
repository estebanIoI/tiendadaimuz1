"use client";

import { useState } from 'react';
import { ShoppingCart, X, Minus, Plus, ChevronUp } from 'lucide-react';
import { ensureAbsoluteUrl } from '@/utils/url';
import type { ProductoCarrito } from '@/types';

interface CarritoFlotanteProps {
  carrito: ProductoCarrito[];
  totalCarrito: number;
  onActualizarCantidad: (id: number, cambio: number) => void;
  onRemover: (producto: ProductoCarrito) => void;
  onCheckout: () => void;
}

export function CarritoFlotante({
  carrito,
  totalCarrito,
  onActualizarCantidad,
  onRemover,
  onCheckout
}: CarritoFlotanteProps) {
  const [abierto, setAbierto] = useState(false);

  if (carrito.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:hidden">
      {/* Panel expandido del carrito */}
      <div
        className={`absolute bottom-16 right-0 w-80 bg-white border border-gray-200 shadow-2xl transition-all duration-300 origin-bottom-right ${
          abierto
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header del carrito */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-gray-900" />
            <span className="font-light text-sm tracking-wide text-gray-900">MI CARRITO</span>
          </div>
          <button
            onClick={() => setAbierto(false)}
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="max-h-64 overflow-y-auto">
          {carrito.map((item, index) => (
            <div key={`${item.id}-${item.tallaSeleccionada || ''}-${item.colorSeleccionado || ''}-${index}`} className="p-3 border-b border-gray-50 last:border-0">
              <div className="flex gap-3">
                <img
                  src={ensureAbsoluteUrl(item.imagen)}
                  alt={item.nombre}
                  className="w-14 h-14 object-cover border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-light text-gray-900 line-clamp-1 leading-tight">
                    {item.nombre}
                  </h4>
                  {(item.tallaSeleccionada || item.colorSeleccionado) && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {item.tallaSeleccionada && `T: ${item.tallaSeleccionada}`}
                      {item.tallaSeleccionada && item.colorSeleccionado && ' / '}
                      {item.colorSeleccionado && `C: ${item.colorSeleccionado}`}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onActualizarCantidad(item.id, -1)}
                        className="w-6 h-6 border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-light w-4 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => onActualizarCantidad(item.id, 1)}
                        className="w-6 h-6 border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="text-xs font-light text-gray-900">
                      ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemover(item)}
                  className="p-1 text-gray-400 hover:text-gray-600 self-start"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer con total y botón de compra */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-light text-gray-600 tracking-wide">TOTAL</span>
            <span className="text-lg font-light text-gray-900">
              ${totalCarrito.toLocaleString('es-CO')}
            </span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-gray-900 text-white py-3 font-light text-sm tracking-wide hover:bg-gray-800 transition-colors"
          >
            FINALIZAR COMPRA
          </button>
        </div>
      </div>

      {/* Botón flotante */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-105"
      >
        {abierto ? (
          <ChevronUp size={24} />
        ) : (
          <div className="relative">
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-white text-gray-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
              {carrito.length}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
