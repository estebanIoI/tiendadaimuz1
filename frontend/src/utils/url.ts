import { API_URL } from '@/constants';

/**
 * Convierte URLs relativas a absolutas usando la URL base del API
 */
export function ensureAbsoluteUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // URL relativa: agregar base
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${API_URL}${cleanUrl}`;
}

/**
 * Genera un número de pedido único basado en timestamp
 */
export function generarNumeroPedido(): string {
  return `GS-${Date.now()}`;
}

/**
 * Formatea una fecha a formato local colombiano
 */
export function formatearFecha(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
