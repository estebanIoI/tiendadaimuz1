"use client";

import { ShoppingBag } from 'lucide-react';
import { ensureAbsoluteUrl } from '@/utils/url';
import type { Producto } from '@/types';

interface ProductCardProps {
  producto: Producto;
  onImageClick: () => void;
}

export function ProductCard({ producto, onImageClick }: ProductCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onImageClick}>
      {/* Imagen con icono de carrito */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden mb-3">
        <img
          src={ensureAbsoluteUrl(producto.imagen)}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Icono de carrito */}
        <button
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onImageClick();
          }}
        >
          <ShoppingBag size={18} className="text-gray-700" />
        </button>
      </div>

      {/* Info */}
      <div className="space-y-1 text-center">
        <h3 className="text-sm font-light text-gray-900 line-clamp-2 leading-tight">
          {producto.nombre}
        </h3>

        {/* Precios */}
        <div className="flex items-baseline justify-center gap-2">
          {producto.precioAnterior > producto.precio && (
            <span className="text-xs text-gray-400 line-through">
              ${producto.precioAnterior.toLocaleString('es-CO')}
            </span>
          )}
          <span className="text-sm font-medium text-gray-900">
            ${producto.precio.toLocaleString('es-CO')}
          </span>
        </div>
      </div>
    </div>
  );
}
