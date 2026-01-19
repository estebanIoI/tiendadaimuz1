"use client";

import { useState, useCallback, useMemo } from 'react';
import type { Producto, ProductoCarrito } from '@/types';

export function useCarrito() {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<Set<number>>(new Set());
  const [cantidades, setCantidades] = useState<Record<number, number>>({});

  const totalCarrito = useMemo(() => {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }, [carrito]);

  const toggleProducto = useCallback((producto: Producto) => {
    setProductosSeleccionados(prev => {
      const nuevosSeleccionados = new Set(prev);
      if (nuevosSeleccionados.has(producto.id)) {
        nuevosSeleccionados.delete(producto.id);
        setCarrito(c => c.filter(item => item.id !== producto.id));
        setCantidades(cant => {
          const nuevas = { ...cant };
          delete nuevas[producto.id];
          return nuevas;
        });
      } else {
        nuevosSeleccionados.add(producto.id);
        setCarrito(c => [...c, { ...producto, cantidad: 1 }]);
        setCantidades(cant => ({ ...cant, [producto.id]: 1 }));
      }
      return nuevosSeleccionados;
    });
  }, []);

  const actualizarCantidad = useCallback((id: number, cambio: number) => {
    setCarrito(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nuevaCantidad = Math.max(1, item.cantidad + cambio);
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      })
    );

    setCantidades(prev => {
      const cantidadActual = prev[id] || 1;
      const nuevaCantidad = Math.max(1, cantidadActual + cambio);
      return { ...prev, [id]: nuevaCantidad };
    });
  }, []);

  const addFromModal = useCallback((producto: Producto, cantidad: number, talla?: string, color?: string) => {
    setCarrito(prev => {
      // Buscar si existe el mismo producto con la misma talla y color
      const existe = prev.findIndex(item =>
        item.id === producto.id &&
        item.tallaSeleccionada === talla &&
        item.colorSeleccionado === color
      );

      if (existe >= 0) {
        return prev.map((item, index) =>
          index === existe
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        return [...prev, {
          ...producto,
          cantidad,
          tallaSeleccionada: talla,
          colorSeleccionado: color
        }];
      }
    });

    setProductosSeleccionados(prev => new Set(prev).add(producto.id));
    setCantidades(prev => ({
      ...prev,
      [producto.id]: (prev[producto.id] || 0) + cantidad
    }));
  }, []);

  const limpiarCarrito = useCallback(() => {
    setCarrito([]);
    setProductosSeleccionados(new Set());
    setCantidades({});
  }, []);

  const estaEnCarrito = useCallback((productoId: number) => {
    return productosSeleccionados.has(productoId);
  }, [productosSeleccionados]);

  return {
    carrito,
    productosSeleccionados,
    cantidades,
    totalCarrito,
    toggleProducto,
    actualizarCantidad,
    addFromModal,
    limpiarCarrito,
    estaEnCarrito
  };
}
