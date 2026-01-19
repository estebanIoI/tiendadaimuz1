import { API_URL } from '@/constants';
import type { Producto, Pedido, PedidoForm, NuevoProducto, ProductoCarrito, ImagenProducto, Banner } from '@/types';
import { ensureAbsoluteUrl } from '@/utils/url';

// ============ PRODUCTOS ============

export async function fetchProductos(): Promise<Producto[]> {
  const response = await fetch(`${API_URL}/api/productos`);
  if (!response.ok) throw new Error('Error cargando productos');

  const data = await response.json();
  return data.map((p: {
    id: number;
    nombre: string;
    descripcion?: string;
    precioAnterior?: number;
    precio: number;
    imagen?: string;
    stock: number;
    categoria?: string;
    esRopa?: boolean;
    tallas?: string;
    colores?: string;
    imagenes?: ImagenProducto[];
  }) => ({
    ...p,
    descripcion: p.descripcion || '',
    precioAnterior: p.precioAnterior || p.precio,
    imagen: p.imagen || (p.imagenes && p.imagenes[0]?.url) || '',
    categoria: p.categoria || '',
    tallas: p.tallas ? JSON.parse(p.tallas) : [],
    colores: p.colores ? JSON.parse(p.colores) : [],
    imagenes: p.imagenes || [],
  }));
}

export async function createProducto(producto: NuevoProducto, token: string): Promise<Producto> {
  const response = await fetch(`${API_URL}/api/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioAnterior: Number(producto.precioAnterior) || Number(producto.precio),
      precio: Number(producto.precio),
      imagen: producto.imagenes.find(img => img.principal)?.url || producto.imagenes[0]?.url || producto.imagen,
      stock: Number(producto.stock),
      categoria: producto.categoria,
      esRopa: producto.esRopa,
      tallas: JSON.stringify(producto.tallas),
      colores: JSON.stringify(producto.colores),
      imagenes: producto.imagenes
    })
  });

  if (!response.ok) throw new Error('Error creando producto');
  return response.json();
}

export async function updateProducto(id: number, producto: NuevoProducto, token: string): Promise<Producto> {
  const response = await fetch(`${API_URL}/api/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioAnterior: Number(producto.precioAnterior) || Number(producto.precio),
      precio: Number(producto.precio),
      imagen: producto.imagenes.find(img => img.principal)?.url || producto.imagenes[0]?.url || producto.imagen,
      stock: Number(producto.stock),
      categoria: producto.categoria,
      esRopa: producto.esRopa,
      tallas: JSON.stringify(producto.tallas),
      colores: JSON.stringify(producto.colores),
      imagenes: producto.imagenes
    })
  });

  if (!response.ok) throw new Error('Error actualizando producto');
  return response.json();
}

export async function deleteProducto(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/productos/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error('Error eliminando producto');
}

// ============ PEDIDOS ============

export async function fetchPedidos(token: string): Promise<Pedido[]> {
  const response = await fetch(`${API_URL}/api/pedidos`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error('Error cargando pedidos');

  const data = await response.json();
  return data.map((p: {
    id: number;
    fecha: string;
    cliente: string;
    total: number;
    estado: string;
    detalles?: string;
  }) => {
    let detallesParsed = undefined;
    if (p.detalles) {
      try {
        detallesParsed = typeof p.detalles === 'string' ? JSON.parse(p.detalles) : p.detalles;
      } catch {
        detallesParsed = undefined;
      }
    }

    return {
      id: p.id,
      fecha: new Date(p.fecha).toISOString().split('T')[0],
      cliente: p.cliente,
      total: p.total,
      estado: p.estado,
      detalles: detallesParsed,
    };
  });
}

export async function createPedido(
  numeroPedido: string,
  formData: PedidoForm,
  carrito: ProductoCarrito[],
  total: number
): Promise<Pedido> {
  const response = await fetch(`${API_URL}/api/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      numeroPedido,
      cliente: formData.nombre,
      total,
      detalles: { ...formData, items: carrito },
      estado: 'Pendiente',
      productos: carrito.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad
      }))
    })
  });

  if (!response.ok) throw new Error('Error creando pedido');
  return response.json();
}

export async function updateEstadoPedido(id: number, estado: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/pedidos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ estado })
  });

  if (!response.ok) throw new Error('Error actualizando pedido');
}

// ============ AUTH ============

export async function loginApi(usuario: string, password: string): Promise<string> {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password })
  });

  if (!response.ok) throw new Error('Credenciales inválidas');

  const data = await response.json();
  return data.token;
}

// ============ UPLOAD ============

export async function uploadImages(files: File[], token: string): Promise<string[]> {
  const formData = new FormData();
  files.forEach(file => formData.append('imagenes', file));

  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  if (!response.ok) throw new Error('Error subiendo imágenes');

  const data = await response.json();
  return data.urls.map((url: string) => ensureAbsoluteUrl(url));
}

// ============ EMAIL ============

export async function sendOrderEmail(
  numeroPedido: string,
  formData: PedidoForm,
  carrito: ProductoCarrito[],
  total: number
): Promise<void> {
  const response = await fetch(`${API_URL}/api/enviar-correo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      numeroPedido,
      cliente: formData,
      productos: carrito.map(item => ({
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal: item.precio * item.cantidad
      })),
      total,
      fecha: new Date().toLocaleString('es-CO')
    })
  });

  if (!response.ok) {
    console.error('Error enviando email de confirmación');
  }
}

// ============ BANNERS ============

export async function fetchBanners(): Promise<Banner[]> {
  const response = await fetch(`${API_URL}/api/banners`);
  if (!response.ok) throw new Error('Error cargando banners');
  return response.json();
}

export async function fetchAllBanners(token: string): Promise<Banner[]> {
  const response = await fetch(`${API_URL}/api/banners/all`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Error cargando banners');
  return response.json();
}

export async function createBanner(banner: Omit<Banner, 'id' | 'createdAt'>, token: string): Promise<Banner> {
  const response = await fetch(`${API_URL}/api/banners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(banner)
  });
  if (!response.ok) throw new Error('Error creando banner');
  return response.json();
}

export async function updateBanner(id: number, banner: Omit<Banner, 'id' | 'createdAt'>, token: string): Promise<Banner> {
  const response = await fetch(`${API_URL}/api/banners/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(banner)
  });
  if (!response.ok) throw new Error('Error actualizando banner');
  return response.json();
}

export async function deleteBanner(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/banners/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Error eliminando banner');
}

// ============ CONFIGURACIONES ============

export async function fetchConfig(): Promise<Record<string, string>> {
  const response = await fetch(`${API_URL}/api/config`);
  if (!response.ok) throw new Error('Error cargando configuraciones');
  return response.json();
}

export async function updateConfig(clave: string, valor: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/config/${clave}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ valor })
  });
  if (!response.ok) throw new Error('Error actualizando configuración');
}
