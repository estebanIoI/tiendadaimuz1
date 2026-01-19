"use client";

import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useConfig } from '@/hooks/useConfig';

interface HeaderProps {
  cantidadCarrito: number;
  onCarritoClick: () => void;
  onAdminClick: () => void;
}

export function Header({ cantidadCarrito, onCarritoClick, onAdminClick }: HeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { config } = useConfig();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menú hamburguesa */}
            <button
              onClick={() => setMenuAbierto(true)}
              className="p-2 text-gray-900 hover:text-gray-600 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>

            {/* Logo centrado */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black tracking-tight text-gray-900" style={{ fontFamily: 'serif' }}>
                  {config.logo || 'DAIMUZ'}
                </span>
              </div>
            </div>

            {/* Carrito */}
            <button
              onClick={onCarritoClick}
              className="p-2 text-gray-900 hover:text-gray-600 transition-colors relative"
              aria-label="Ver carrito"
            >
              <ShoppingCart size={24} />
              {cantidadCarrito > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cantidadCarrito}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menú lateral */}
      {menuAbierto && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuAbierto(false)}
          />

          {/* Panel del menú */}
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-100">
              <button
                onClick={() => setMenuAbierto(false)}
                className="p-2 text-gray-900 hover:text-gray-600 transition-colors"
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="block text-lg font-light text-gray-900 hover:text-gray-600 py-2"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#productos"
                    className="block text-lg font-light text-gray-900 hover:text-gray-600 py-2"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Productos
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setMenuAbierto(false);
                      onAdminClick();
                    }}
                    className="block text-lg font-light text-gray-900 hover:text-gray-600 py-2 w-full text-left"
                  >
                    acceder
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
