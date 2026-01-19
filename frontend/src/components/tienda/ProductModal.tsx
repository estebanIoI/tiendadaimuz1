"use client";

import { useState } from 'react';
import { X, Package, Minus, Plus } from 'lucide-react';
import { ensureAbsoluteUrl } from '@/utils/url';
import type { Producto } from '@/types';

interface ProductModalProps {
  producto: Producto;
  onClose: () => void;
  onAddToCart: (cantidad: number, talla?: string, color?: string) => void;
  onBuyNow: (cantidad: number, talla?: string, color?: string) => void;
}

export function ProductModal({ producto, onClose, onAddToCart, onBuyNow }: ProductModalProps) {
  const [indiceImagen, setIndiceImagen] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);

  const imagenActual = producto.imagenes && producto.imagenes.length > 0
    ? ensureAbsoluteUrl(producto.imagenes[indiceImagen]?.url || producto.imagen)
    : ensureAbsoluteUrl(producto.imagen);

  const necesitaTalla = producto.esRopa && producto.tallas && producto.tallas.length > 0;
  const necesitaColor = producto.colores && producto.colores.length > 0;

  const puedeAgregar = () => {
    if (producto.stock === 0) return false;
    if (necesitaTalla && !tallaSeleccionada) return false;
    if (necesitaColor && !colorSeleccionado) return false;
    return true;
  };

  const handleAddToCart = () => {
    if (!puedeAgregar()) {
      if (necesitaTalla && !tallaSeleccionada) {
        alert('Por favor selecciona una talla');
        return;
      }
      if (necesitaColor && !colorSeleccionado) {
        alert('Por favor selecciona un color');
        return;
      }
      return;
    }
    onAddToCart(cantidad, tallaSeleccionada || undefined, colorSeleccionado || undefined);
  };

  const handleBuyNow = () => {
    if (!puedeAgregar()) {
      if (necesitaTalla && !tallaSeleccionada) {
        alert('Por favor selecciona una talla');
        return;
      }
      if (necesitaColor && !colorSeleccionado) {
        alert('Por favor selecciona un color');
        return;
      }
      return;
    }
    onBuyNow(cantidad, tallaSeleccionada || undefined, colorSeleccionado || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 z-10"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {/* Columna de imágenes */}
          <div>
            <div className="w-full h-80 bg-gray-50 flex items-center justify-center overflow-hidden">
              <img
                src={imagenActual}
                alt={producto.nombre}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {producto.imagenes && producto.imagenes.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {producto.imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setIndiceImagen(i)}
                    className={`w-20 h-20 flex-shrink-0 border ${
                      i === indiceImagen ? 'border-gray-900' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={ensureAbsoluteUrl(img.url)}
                      alt={`${producto.nombre}-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna de detalles */}
          <div className="space-y-4 p-2">
            <h3 className="text-xl font-medium text-gray-900">{producto.nombre}</h3>

            {producto.categoria && (
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-light rounded-full">
                {producto.categoria}
              </span>
            )}

            <p className="text-sm text-gray-600 leading-relaxed">{producto.descripcion}</p>

            <div className="mt-3 pb-3 border-b border-gray-100">
              {producto.precioAnterior > producto.precio && (
                <div className="text-sm text-gray-400 line-through">
                  ${producto.precioAnterior.toLocaleString('es-CO')}
                </div>
              )}
              <div className="text-2xl font-semibold text-gray-900">
                ${producto.precio.toLocaleString('es-CO')}
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="flex items-center gap-2">
              <Package size={16} className="text-gray-500" />
              <span className={`text-sm font-light ${producto.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Agotado'}
              </span>
            </div>

            {/* Tallas - Seleccionables */}
            {necesitaTalla && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                  SELECCIONA TU TALLA *
                </label>
                <div className="flex flex-wrap gap-2">
                  {producto.tallas!.map((talla) => (
                    <button
                      key={talla}
                      onClick={() => setTallaSeleccionada(talla)}
                      className={`px-4 py-2 border text-sm font-light transition-colors ${
                        tallaSeleccionada === talla
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-700 bg-white hover:border-gray-900'
                      }`}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colores - Seleccionables */}
            {necesitaColor && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                  SELECCIONA TU COLOR *
                </label>
                <div className="flex flex-wrap gap-3">
                  {producto.colores!.map((color) => (
                    <button
                      key={color.codigo}
                      onClick={() => setColorSeleccionado(color.nombre)}
                      className={`flex items-center gap-2 px-3 py-2 border transition-colors ${
                        colorSeleccionado === color.nombre
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border ${
                          colorSeleccionado === color.nombre ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-1' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.codigo }}
                      />
                      <span className="text-sm text-gray-600">{color.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de cantidad */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">CANTIDAD</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-10 h-10 border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors flex items-center justify-center"
                >
                  <Minus size={16} />
                </button>
                <div className="text-lg font-medium text-gray-900 w-10 text-center">{cantidad}</div>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="w-10 h-10 border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors flex items-center justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Resumen de selección */}
            {(tallaSeleccionada || colorSeleccionado) && (
              <div className="mt-4 p-3 bg-gray-50 text-sm">
                <span className="text-gray-600">Selección: </span>
                {tallaSeleccionada && <span className="font-medium">Talla {tallaSeleccionada}</span>}
                {tallaSeleccionada && colorSeleccionado && <span className="text-gray-400"> / </span>}
                {colorSeleccionado && <span className="font-medium">{colorSeleccionado}</span>}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                disabled={producto.stock === 0}
                className="flex-1 bg-gray-900 text-white px-4 py-3 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                AÑADIR AL CARRITO
              </button>
              <button
                onClick={handleBuyNow}
                disabled={producto.stock === 0}
                className="flex-1 border-2 border-gray-900 text-gray-900 px-4 py-3 font-medium hover:bg-gray-900 hover:text-white transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                COMPRAR AHORA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
