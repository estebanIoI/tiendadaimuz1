"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchPedidos, createPedido, updateEstadoPedido, sendOrderEmail } from '@/services/api';
import { INITIAL_PEDIDO_FORM } from '@/constants';
import { generarNumeroPedido } from '@/utils/url';
import type { Pedido, PedidoForm, ProductoCarrito, PedidoConfirmado } from '@/types';

export function usePedidos(authToken: string | null) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [formData, setFormData] = useState<PedidoForm>(INITIAL_PEDIDO_FORM);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<PedidoConfirmado | null>(null);
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  const cargarPedidos = useCallback(async () => {
    if (!authToken) return;
    try {
      const data = await fetchPedidos(authToken);
      setPedidos(data);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      cargarPedidos();
    }
  }, [authToken, cargarPedidos]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'departamento') {
        return { ...prev, [name]: value, municipio: '' };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const confirmarPedido = useCallback(async (
    carrito: ProductoCarrito[],
    totalCarrito: number,
    onSuccess: () => void
  ) => {
    // Validar campos obligatorios
    if (!formData.nombre || !formData.telefono || !formData.email || !formData.cedula ||
        !formData.departamento || !formData.municipio || !formData.direccion) {
      alert('Por favor completa todos los campos obligatorios');
      return false;
    }

    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return false;
    }

    setEnviandoEmail(true);
    const numeroPedido = generarNumeroPedido();

    try {
      await createPedido(numeroPedido, formData, carrito, totalCarrito);

      // Intentar enviar email (no bloquear si falla)
      sendOrderEmail(numeroPedido, formData, carrito, totalCarrito).catch(console.error);

      setPedidoConfirmado({
        numeroPedido,
        fecha: new Date().toLocaleString('es-CO'),
        email: formData.email,
        total: totalCarrito,
        productos: carrito
      });
      setMostrarModalExito(true);
      onSuccess();
      return true;
    } catch (error) {
      console.error('Error creando pedido:', error);
      alert('Error al procesar el pedido');
      return false;
    } finally {
      setEnviandoEmail(false);
    }
  }, [formData]);

  const cerrarModalExito = useCallback(() => {
    setMostrarModalExito(false);
    setPedidoConfirmado(null);
    setFormData(INITIAL_PEDIDO_FORM);
  }, []);

  const actualizarEstado = useCallback(async (id: number, estado: string) => {
    if (!authToken) return false;
    try {
      await updateEstadoPedido(id, estado, authToken);
      await cargarPedidos();
      return true;
    } catch (error) {
      console.error('Error actualizando estado:', error);
      return false;
    }
  }, [authToken, cargarPedidos]);

  return {
    pedidos,
    formData,
    mostrarModalExito,
    pedidoConfirmado,
    enviandoEmail,
    handleInputChange,
    confirmarPedido,
    cerrarModalExito,
    actualizarEstado,
    cargarPedidos,
    setFormData
  };
}
