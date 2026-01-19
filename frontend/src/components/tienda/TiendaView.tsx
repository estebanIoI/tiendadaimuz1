"use client";

import { useState } from 'react';
import { Header } from './Header';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { CarritoFlotante } from './CarritoFlotante';
import type { Producto, ProductoCarrito, Banner } from '@/types';

interface TiendaViewProps {
  productos: Producto[];
  cargando: boolean;
  carrito: ProductoCarrito[];
  totalCarrito: number;
  banners: Banner[];
  onToggleProducto: (producto: Producto) => void;
  onAddFromModal: (producto: Producto, cantidad: number, talla?: string, color?: string) => void;
  onActualizarCantidad: (id: number, cambio: number) => void;
  onCheckout: () => void;
  onAdmin: () => void;
}

export function TiendaView({
  productos,
  cargando,
  carrito,
  totalCarrito,
  banners,
  onToggleProducto,
  onAddFromModal,
  onActualizarCantidad,
  onCheckout,
  onAdmin
}: TiendaViewProps) {
  const [modalProducto, setModalProducto] = useState<Producto | null>(null);

  const handleOpenModal = (producto: Producto) => {
    setModalProducto(producto);
  };

  const handleCloseModal = () => {
    setModalProducto(null);
  };

  const handleAddToCart = (cantidad: number, talla?: string, color?: string) => {
    if (modalProducto) {
      onAddFromModal(modalProducto, cantidad, talla, color);
      handleCloseModal();
    }
  };

  const handleBuyNow = (cantidad: number, talla?: string, color?: string) => {
    if (modalProducto) {
      onAddFromModal(modalProducto, cantidad, talla, color);
      handleCloseModal();
      onCheckout();
    }
  };

  const scrollToProducts = () => {
    const productosSection = document.getElementById('productos');
    if (productosSection) {
      productosSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        cantidadCarrito={carrito.length}
        onCarritoClick={onCheckout}
        onAdminClick={onAdmin}
      />

      {/* Hero Banner con Slider */}
      <HeroBanner
        banners={banners}
        onShopNow={scrollToProducts}
        onAgregarAlCarrito={onToggleProducto}
      />

      {/* Sección de productos */}
      <main id="productos" className="px-4 py-8">
        {cargando ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 font-light">Cargando productos...</div>
          </div>
        ) : productos.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 font-light">No hay productos disponibles</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onImageClick={() => handleOpenModal(producto)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de producto */}
      {modalProducto && (
        <ProductModal
          producto={modalProducto}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Carrito flotante móvil */}
      <CarritoFlotante
        carrito={carrito}
        totalCarrito={totalCarrito}
        onActualizarCantidad={onActualizarCantidad}
        onRemover={onToggleProducto}
        onCheckout={onCheckout}
      />
    </div>
  );
}
