"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchProductos, createProducto, updateProducto, deleteProducto, uploadImages } from '@/services/api';
import { INITIAL_NUEVO_PRODUCTO } from '@/constants';
import type { Producto, NuevoProducto, ColorProducto } from '@/types';

export function useProductos(authToken: string | null) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [nuevoProducto, setNuevoProducto] = useState<NuevoProducto>(INITIAL_NUEVO_PRODUCTO);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false);

  const cargarProductos = useCallback(async () => {
    try {
      const data = await fetchProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const editarProducto = useCallback((producto: Producto) => {
    setProductoEditando(producto);
    setNuevoProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioAnterior: producto.precioAnterior,
      precio: producto.precio,
      imagen: producto.imagen,
      stock: producto.stock,
      categoria: producto.categoria,
      esRopa: producto.esRopa || false,
      tallas: producto.tallas || [],
      colores: producto.colores || [],
      imagenes: producto.imagenes || []
    });
    setMostrarFormProducto(true);
  }, []);

  const agregarProducto = useCallback(async () => {
    if (!authToken) return false;
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      alert('Nombre y precio son obligatorios');
      return false;
    }
    if (nuevoProducto.imagenes.length === 0 && !nuevoProducto.imagen) {
      alert('Debes agregar al menos una imagen');
      return false;
    }

    try {
      await createProducto(nuevoProducto, authToken);
      await cargarProductos();
      setNuevoProducto(INITIAL_NUEVO_PRODUCTO);
      setMostrarFormProducto(false);
      return true;
    } catch (error) {
      console.error('Error agregando producto:', error);
      alert('Error al agregar producto');
      return false;
    }
  }, [authToken, nuevoProducto, cargarProductos]);

  const actualizarProductoExistente = useCallback(async () => {
    if (!authToken || !productoEditando) return false;

    try {
      await updateProducto(productoEditando.id, nuevoProducto, authToken);
      await cargarProductos();
      setNuevoProducto(INITIAL_NUEVO_PRODUCTO);
      setProductoEditando(null);
      setMostrarFormProducto(false);
      return true;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      alert('Error al actualizar producto');
      return false;
    }
  }, [authToken, productoEditando, nuevoProducto, cargarProductos]);

  const eliminarProductoHandler = useCallback(async (id: number) => {
    if (!authToken) return false;
    if (!confirm('¿Estás seguro de eliminar este producto?')) return false;

    try {
      await deleteProducto(id, authToken);
      await cargarProductos();
      return true;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('Error al eliminar producto');
      return false;
    }
  }, [authToken, cargarProductos]);

  const handleImageUpload = useCallback(async (files: FileList) => {
    if (!authToken) return;

    setSubiendoImagenes(true);
    try {
      const urls = await uploadImages(Array.from(files), authToken);
      const nuevasImagenes = urls.map((url, index) => ({
        url,
        principal: nuevoProducto.imagenes.length === 0 && index === 0
      }));
      setNuevoProducto(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...nuevasImagenes]
      }));
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      alert('Error al subir imágenes');
    } finally {
      setSubiendoImagenes(false);
    }
  }, [authToken, nuevoProducto.imagenes.length]);

  const eliminarImagen = useCallback((index: number) => {
    setNuevoProducto(prev => {
      const nuevas = prev.imagenes.filter((_, i) => i !== index);
      // Si eliminamos la principal, asignar la primera como principal
      if (prev.imagenes[index]?.principal && nuevas.length > 0) {
        nuevas[0].principal = true;
      }
      return { ...prev, imagenes: nuevas };
    });
  }, []);

  const setImagenPrincipal = useCallback((index: number) => {
    setNuevoProducto(prev => ({
      ...prev,
      imagenes: prev.imagenes.map((img, i) => ({
        ...img,
        principal: i === index
      }))
    }));
  }, []);

  const toggleTalla = useCallback((talla: string) => {
    setNuevoProducto(prev => ({
      ...prev,
      tallas: prev.tallas.includes(talla)
        ? prev.tallas.filter(t => t !== talla)
        : [...prev.tallas, talla]
    }));
  }, []);

  const toggleColor = useCallback((color: ColorProducto) => {
    setNuevoProducto(prev => ({
      ...prev,
      colores: prev.colores.some(c => c.codigo === color.codigo)
        ? prev.colores.filter(c => c.codigo !== color.codigo)
        : [...prev.colores, color]
    }));
  }, []);

  const resetForm = useCallback(() => {
    setNuevoProducto(INITIAL_NUEVO_PRODUCTO);
    setProductoEditando(null);
    setMostrarFormProducto(false);
  }, []);

  const updateNuevoProducto = useCallback((updates: Partial<NuevoProducto>) => {
    setNuevoProducto(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    productos,
    cargando,
    mostrarFormProducto,
    setMostrarFormProducto,
    productoEditando,
    nuevoProducto,
    subiendoImagenes,
    editarProducto,
    agregarProducto,
    actualizarProductoExistente,
    eliminarProducto: eliminarProductoHandler,
    handleImageUpload,
    eliminarImagen,
    setImagenPrincipal,
    toggleTalla,
    toggleColor,
    resetForm,
    updateNuevoProducto,
    cargarProductos
  };
}
