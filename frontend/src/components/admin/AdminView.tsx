"use client";

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { ProductosAdmin } from './ProductosAdmin';
import { PedidosAdmin } from './PedidosAdmin';
import { ConfigAdmin } from './ConfigAdmin';
import type { Producto, Pedido, NuevoProducto, ColorProducto, Banner } from '@/types';

type SeccionAdmin = 'dashboard' | 'productos' | 'pedidos' | 'config';

interface AdminViewProps {
  // Productos
  productos: Producto[];
  mostrarFormProducto: boolean;
  setMostrarFormProducto: (show: boolean) => void;
  productoEditando: Producto | null;
  nuevoProducto: NuevoProducto;
  subiendoImagenes: boolean;
  editarProducto: (producto: Producto) => void;
  agregarProducto: () => void;
  actualizarProductoExistente: () => void;
  eliminarProducto: (id: number) => void;
  handleImageUpload: (files: FileList) => void;
  eliminarImagen: (index: number) => void;
  setImagenPrincipal: (index: number) => void;
  toggleTalla: (talla: string) => void;
  toggleColor: (color: ColorProducto) => void;
  resetForm: () => void;
  updateNuevoProducto: (updates: Partial<NuevoProducto>) => void;
  // Pedidos
  pedidos: Pedido[];
  actualizarEstado: (id: number, estado: string) => void;
  // Banners
  banners: Banner[];
  subiendoImagenBanner: boolean;
  agregarBanner: (banner: Omit<Banner, 'id' | 'createdAt'>) => Promise<Banner | undefined>;
  actualizarBanner: (id: number, banner: Omit<Banner, 'id' | 'createdAt'>) => Promise<Banner | undefined>;
  eliminarBanner: (id: number) => Promise<void>;
  subirImagenBanner: (file: File) => Promise<string | null>;
  // Auth
  authToken: string;
  logout: () => void;
  // Navegación
  onVolver: () => void;
}

export function AdminView({
  productos,
  mostrarFormProducto,
  setMostrarFormProducto,
  productoEditando,
  nuevoProducto,
  subiendoImagenes,
  editarProducto,
  agregarProducto,
  actualizarProductoExistente,
  eliminarProducto,
  handleImageUpload,
  eliminarImagen,
  setImagenPrincipal,
  toggleTalla,
  toggleColor,
  resetForm,
  updateNuevoProducto,
  pedidos,
  actualizarEstado,
  banners,
  subiendoImagenBanner,
  agregarBanner,
  actualizarBanner,
  eliminarBanner,
  subirImagenBanner,
  authToken,
  logout,
  onVolver
}: AdminViewProps) {
  const [seccionAdmin, setSeccionAdmin] = useState<SeccionAdmin>('dashboard');

  const handleGuardarProducto = () => {
    if (productoEditando) {
      actualizarProductoExistente();
    } else {
      agregarProducto();
    }
  };

  const handleCancelarForm = () => {
    resetForm();
  };

  const handleSalir = () => {
    logout();
    onVolver();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        seccionActual={seccionAdmin}
        onCambiarSeccion={setSeccionAdmin}
        onVerTienda={onVolver}
        onSalir={handleSalir}
      />

      <main className="flex-1 p-8">
        {seccionAdmin === 'dashboard' && (
          <Dashboard productos={productos} pedidos={pedidos} />
        )}

        {seccionAdmin === 'productos' && (
          <ProductosAdmin
            productos={productos}
            mostrarForm={mostrarFormProducto}
            productoEditando={productoEditando}
            nuevoProducto={nuevoProducto}
            subiendoImagenes={subiendoImagenes}
            onMostrarForm={setMostrarFormProducto}
            onEditar={editarProducto}
            onEliminar={eliminarProducto}
            onUpdateProducto={updateNuevoProducto}
            onImageUpload={handleImageUpload}
            onEliminarImagen={eliminarImagen}
            onSetPrincipal={setImagenPrincipal}
            onToggleTalla={toggleTalla}
            onToggleColor={toggleColor}
            onGuardar={handleGuardarProducto}
            onCancelar={handleCancelarForm}
          />
        )}

        {seccionAdmin === 'pedidos' && (
          <PedidosAdmin
            pedidos={pedidos}
            onActualizarEstado={actualizarEstado}
          />
        )}

        {seccionAdmin === 'config' && (
          <ConfigAdmin
            banners={banners}
            subiendoImagen={subiendoImagenBanner}
            onAgregarBanner={agregarBanner}
            onActualizarBanner={actualizarBanner}
            onEliminarBanner={eliminarBanner}
            onSubirImagen={subirImagenBanner}
            authToken={authToken}
          />
        )}
      </main>
    </div>
  );
}
