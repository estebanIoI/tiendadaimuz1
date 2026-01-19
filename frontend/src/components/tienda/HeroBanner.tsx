"use client";

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import type { Banner } from '@/types';
import { ensureAbsoluteUrl } from '@/utils/url';
import { useConfig } from '@/hooks/useConfig';
import { useProductos } from '@/hooks/useProductos';

interface HeroBannerProps {
  banners: Banner[];
  onShopNow?: () => void;
  onAgregarAlCarrito?: (producto: any) => void;
}

export function HeroBanner({ banners, onShopNow, onAgregarAlCarrito }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mostrarModalDescuento, setMostrarModalDescuento] = useState(false);
  const [posicionBoton, setPosicionBoton] = useState<'left' | 'right'>('left');
  const currentBanner = banners[currentIndex];
  const { config } = useConfig();
  const { productos } = useProductos(null);

  const nextSlide = useCallback(() => {
    if (banners.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  // Cambiar posición del botón spam cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setPosicionBoton(prev => prev === 'left' ? 'right' : 'left');
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (banners.length === 0) {
    return (
      <div className="relative h-[70vh] min-h-[500px] bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-light">No hay banners configurados</p>
          <p className="text-gray-400 text-sm mt-2">Agrega banners desde el panel de administración</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Imagen de fondo */}
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={ensureAbsoluteUrl(banner.imagen)}
              alt={banner.titulo || 'Banner'}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Overlay oscuro sutil */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Contenido del banner */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {currentBanner.titulo && (
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {currentBanner.titulo}
            </h1>
          )}
          {currentBanner.subtitulo && (
            <p className="text-lg md:text-xl text-white mb-8 drop-shadow-md">
              {currentBanner.subtitulo}
            </p>
          )}
          <button
            onClick={onShopNow}
            className="px-8 py-3 bg-white text-gray-900 font-medium tracking-wide hover:bg-gray-100 transition-colors"
          >
            {currentBanner.textoBoton || 'SHOP NOW'}
          </button>
        </div>

        {/* Indicadores de slide */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir al banner ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Botón descuento spam */}
        {config.descuento_spam_activo === 'true' && (
          <div className={`absolute ${posicionBoton === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 animate-bounce transition-all duration-1000`}>
            <button
              onClick={() => setMostrarModalDescuento(true)}
              className="bg-red-500 text-white px-3 py-2 text-sm font-bold tracking-wider hover:bg-red-600 transition-colors shadow-lg rounded"
            >
              <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                {config.descuento_spam || '10'}% OFF
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de productos con descuento */}
      {mostrarModalDescuento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                ¡{config.descuento_spam || '10'}% OFF en todos los productos!
              </h3>
              <button
                onClick={() => setMostrarModalDescuento(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productos.map((producto) => {
                  const descuento = parseInt(config.descuento_spam || '10');
                  const precioConDescuento = Math.round(producto.precio * (1 - descuento / 100));
                  return (
                    <div key={producto.id} className="border border-gray-200 p-4">
                      <img
                        src={ensureAbsoluteUrl(producto.imagen)}
                        alt={producto.nombre}
                        className="w-full h-48 object-cover mb-4"
                      />
                      <h4 className="font-medium text-gray-900 mb-2">{producto.nombre}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-red-600">
                          ${precioConDescuento}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${producto.precio}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{producto.descripcion}</p>
                      <button 
                        onClick={() => onAgregarAlCarrito?.(producto)}
                        className="w-full bg-red-500 text-white py-2 px-4 hover:bg-red-600 transition-colors"
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
