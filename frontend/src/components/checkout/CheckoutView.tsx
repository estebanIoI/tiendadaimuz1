"use client";

import { Minus, Plus, Trash2 } from 'lucide-react';
import { departamentosMunicipios } from '@/constants';
import { ModalExito } from './ModalExito';
import type { ProductoCarrito, PedidoForm, PedidoConfirmado } from '@/types';

interface CheckoutViewProps {
  carrito: ProductoCarrito[];
  totalCarrito: number;
  formData: PedidoForm;
  enviandoEmail: boolean;
  mostrarModalExito: boolean;
  pedidoConfirmado: PedidoConfirmado | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onActualizarCantidad: (id: number, cambio: number) => void;
  onRemoverProducto: (producto: ProductoCarrito) => void;
  onConfirmar: () => void;
  onCerrarModal: () => void;
  onVolver: () => void;
}

export function CheckoutView({
  carrito,
  totalCarrito,
  formData,
  enviandoEmail,
  mostrarModalExito,
  pedidoConfirmado,
  onInputChange,
  onActualizarCantidad,
  onRemoverProducto,
  onConfirmar,
  onCerrarModal,
  onVolver
}: CheckoutViewProps) {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onVolver}
          className="mb-8 text-gray-600 hover:text-gray-900 flex items-center gap-2 font-light text-sm tracking-wide"
        >
          ← VOLVER
        </button>

        <div className="border border-gray-200 p-6 sm:p-10 light-form">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-900 mb-2">Finalizar Compra</h1>
          <p className="text-gray-500 mb-10 font-light text-sm">Completa tus datos para procesar tu pedido</p>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Columna izquierda - Datos */}
            <div className="space-y-8">
              {/* Datos del Comprador */}
              <div>
                <h2 className="text-lg font-light tracking-wide text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  Datos del Comprador
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      NOMBRE COMPLETO *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light rounded-none placeholder-gray-400"
                      placeholder="Ingresa tu nombre completo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      TELÉFONO / WHATSAPP *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light rounded-none placeholder-gray-400"
                      placeholder="Ej: 3001234567"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      CORREO ELECTRÓNICO *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light rounded-none placeholder-gray-400"
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      CÉDULA / DOCUMENTO *
                    </label>
                    <input
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light rounded-none placeholder-gray-400"
                      placeholder="Número de documento"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Datos de Envío */}
              <div>
                <h2 className="text-lg font-light tracking-wide text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  Datos de Envío
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      DEPARTAMENTO *
                    </label>
                    <select
                      name="departamento"
                      value={formData.departamento}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light rounded-none"
                      required
                    >
                      <option value="">Selecciona departamento</option>
                      {Object.keys(departamentosMunicipios).map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      MUNICIPIO *
                    </label>
                    <select
                      name="municipio"
                      value={formData.municipio}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light rounded-none disabled:bg-gray-100 disabled:text-gray-500"
                      required
                      disabled={!formData.departamento}
                    >
                      <option value="">
                        {formData.departamento ? 'Selecciona municipio' : 'Primero selecciona departamento'}
                      </option>
                      {formData.departamento && departamentosMunicipios[formData.departamento].map(mun => (
                        <option key={mun} value={mun}>{mun}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      DIRECCIÓN DE ENTREGA *
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light rounded-none placeholder-gray-400"
                      placeholder="Calle, carrera, número..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                      BARRIO
                    </label>
                    <input
                      type="text"
                      name="barrio"
                      value={formData.barrio}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light rounded-none placeholder-gray-400"
                      placeholder="Nombre del barrio"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Resumen */}
            <div>
              <h2 className="text-lg font-light tracking-wide text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Resumen del Pedido
              </h2>
              <div className="space-y-6">
                {carrito.map((item, index) => (
                  <div key={`${item.id}-${item.tallaSeleccionada || ''}-${item.colorSeleccionado || ''}-${index}`} className="pb-6 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-light text-gray-900 text-sm">{item.nombre}</div>
                        {(item.tallaSeleccionada || item.colorSeleccionado) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.tallaSeleccionada && <span>Talla: {item.tallaSeleccionada}</span>}
                            {item.tallaSeleccionada && item.colorSeleccionado && <span> / </span>}
                            {item.colorSeleccionado && <span>Color: {item.colorSeleccionado}</span>}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoverProducto(item)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onActualizarCantidad(item.id, -1)}
                          className="w-8 h-8 border border-gray-300 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-900 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-medium text-sm w-8 text-center text-gray-900">{item.cantidad}</span>
                        <button
                          onClick={() => onActualizarCantidad(item.id, 1)}
                          className="w-8 h-8 border border-gray-300 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-900 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 font-light mb-1">
                          ${item.precio.toLocaleString('es-CO')} c/u
                        </div>
                        <div className="font-light text-gray-900">
                          ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-light tracking-wide text-gray-600">TOTAL</span>
                    <span className="text-xl font-light text-gray-900">${totalCarrito.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                    NOTAS ADICIONALES
                  </label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={onInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light text-sm resize-none rounded-none placeholder-gray-400"
                    placeholder="Instrucciones especiales, preferencias de entrega..."
                  />
                </div>

                <button
                  onClick={onConfirmar}
                  disabled={enviandoEmail}
                  className="w-full bg-gray-900 hover:bg-gray-700 text-white font-medium py-4 transition-colors tracking-widest text-sm mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {enviandoEmail ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pedido Exitoso */}
      {mostrarModalExito && pedidoConfirmado && (
        <ModalExito pedido={pedidoConfirmado} onCerrar={onCerrarModal} />
      )}
    </div>
  );
}
