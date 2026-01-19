"use client";

import { useState } from 'react';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useCarrito } from '@/hooks/useCarrito';
import { useProductos } from '@/hooks/useProductos';
import { usePedidos } from '@/hooks/usePedidos';
import { useBanners } from '@/hooks/useBanners';

// Vistas
import { TiendaView } from '@/components/tienda/TiendaView';
import { CheckoutView } from '@/components/checkout/CheckoutView';
import { AdminView } from '@/components/admin/AdminView';
import { LoginForm } from '@/components/admin/LoginForm';

type Vista = 'tienda' | 'checkout' | 'admin';

export default function TiendaGS() {
  const [vistaActual, setVistaActual] = useState<Vista>('tienda');

  // Hooks
  const auth = useAuth();
  const carrito = useCarrito();
  const productosHook = useProductos(auth.authToken);
  const pedidosHook = usePedidos(auth.authToken);
  const bannersHook = useBanners(vistaActual === 'admin' ? auth.authToken : null);

  // ============ VISTA LOGIN ============
  if (vistaActual === 'admin' && !auth.autenticado) {
    return (
      <LoginForm
        credenciales={auth.credenciales}
        onCredencialesChange={auth.updateCredenciales}
        onLogin={async () => {
          const success = await auth.login();
          if (success) {
            // Se queda en admin, ya autenticado
          }
        }}
        onVolver={() => setVistaActual('tienda')}
      />
    );
  }

  // ============ VISTA ADMIN ============
  if (vistaActual === 'admin' && auth.autenticado) {
    return (
      <AdminView
        // Productos
        productos={productosHook.productos}
        mostrarFormProducto={productosHook.mostrarFormProducto}
        setMostrarFormProducto={productosHook.setMostrarFormProducto}
        productoEditando={productosHook.productoEditando}
        nuevoProducto={productosHook.nuevoProducto}
        subiendoImagenes={productosHook.subiendoImagenes}
        editarProducto={productosHook.editarProducto}
        agregarProducto={productosHook.agregarProducto}
        actualizarProductoExistente={productosHook.actualizarProductoExistente}
        eliminarProducto={productosHook.eliminarProducto}
        handleImageUpload={productosHook.handleImageUpload}
        eliminarImagen={productosHook.eliminarImagen}
        setImagenPrincipal={productosHook.setImagenPrincipal}
        toggleTalla={productosHook.toggleTalla}
        toggleColor={productosHook.toggleColor}
        resetForm={productosHook.resetForm}
        updateNuevoProducto={productosHook.updateNuevoProducto}
        // Pedidos
        pedidos={pedidosHook.pedidos}
        actualizarEstado={pedidosHook.actualizarEstado}
        // Banners
        banners={bannersHook.banners}
        subiendoImagenBanner={bannersHook.subiendoImagen}
        agregarBanner={bannersHook.agregarBanner}
        actualizarBanner={bannersHook.actualizarBanner}
        eliminarBanner={bannersHook.eliminarBanner}
        subirImagenBanner={bannersHook.subirImagenBanner}
        // Auth
        authToken={auth.authToken || ''}
        logout={auth.logout}
        // Navegación
        onVolver={() => setVistaActual('tienda')}
      />
    );
  }

  // ============ VISTA CHECKOUT ============
  if (vistaActual === 'checkout') {
    return (
      <CheckoutView
        carrito={carrito.carrito}
        totalCarrito={carrito.totalCarrito}
        formData={pedidosHook.formData}
        enviandoEmail={pedidosHook.enviandoEmail}
        mostrarModalExito={pedidosHook.mostrarModalExito}
        pedidoConfirmado={pedidosHook.pedidoConfirmado}
        onInputChange={pedidosHook.handleInputChange}
        onActualizarCantidad={carrito.actualizarCantidad}
        onRemoverProducto={carrito.toggleProducto}
        onConfirmar={() => {
          pedidosHook.confirmarPedido(
            carrito.carrito,
            carrito.totalCarrito,
            () => carrito.limpiarCarrito()
          );
        }}
        onCerrarModal={() => {
          pedidosHook.cerrarModalExito();
          setVistaActual('tienda');
        }}
        onVolver={() => setVistaActual('tienda')}
      />
    );
  }

  // ============ VISTA TIENDA (default) ============
  return (
    <TiendaView
      productos={productosHook.productos}
      cargando={productosHook.cargando}
      carrito={carrito.carrito}
      totalCarrito={carrito.totalCarrito}
      banners={bannersHook.banners}
      onToggleProducto={carrito.toggleProducto}
      onAddFromModal={carrito.addFromModal}
      onActualizarCantidad={carrito.actualizarCantidad}
      onCheckout={() => setVistaActual('checkout')}
      onAdmin={() => setVistaActual('admin')}
    />
  );
}
