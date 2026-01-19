"use client";

import { Edit, Trash2 } from 'lucide-react';
import { ProductoForm } from './ProductoForm';
import { ensureAbsoluteUrl } from '@/utils/url';
import type { Producto, NuevoProducto, ColorProducto } from '@/types';

interface ProductosAdminProps {
  productos: Producto[];
  mostrarForm: boolean;
  productoEditando: Producto | null;
  nuevoProducto: NuevoProducto;
  subiendoImagenes: boolean;
  onMostrarForm: (show: boolean) => void;
  onEditar: (producto: Producto) => void;
  onEliminar: (id: number) => void;
  onUpdateProducto: (updates: Partial<NuevoProducto>) => void;
  onImageUpload: (files: FileList) => void;
  onEliminarImagen: (index: number) => void;
  onSetPrincipal: (index: number) => void;
  onToggleTalla: (talla: string) => void;
  onToggleColor: (color: ColorProducto) => void;
  onGuardar: () => void;
  onCancelar: () => void;
}

export function ProductosAdmin({
  productos,
  mostrarForm,
  productoEditando,
  nuevoProducto,
  subiendoImagenes,
  onMostrarForm,
  onEditar,
  onEliminar,
  onUpdateProducto,
  onImageUpload,
  onEliminarImagen,
  onSetPrincipal,
  onToggleTalla,
  onToggleColor,
  onGuardar,
  onCancelar
}: ProductosAdminProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-gray-900">Productos</h2>
        {!mostrarForm && (
          <button
            onClick={() => onMostrarForm(true)}
            className="px-4 py-2 bg-gray-900 text-white font-light text-sm hover:bg-gray-800 transition-colors"
          >
            + NUEVO PRODUCTO
          </button>
        )}
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <ProductoForm
          producto={nuevoProducto}
          editando={!!productoEditando}
          subiendoImagenes={subiendoImagenes}
          onUpdate={onUpdateProducto}
          onImageUpload={onImageUpload}
          onEliminarImagen={onEliminarImagen}
          onSetPrincipal={onSetPrincipal}
          onToggleTalla={onToggleTalla}
          onToggleColor={onToggleColor}
          onGuardar={onGuardar}
          onCancelar={onCancelar}
        />
      )}

      {/* Tabla de productos */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">IMAGEN</th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">NOMBRE</th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">CATEGORÍA</th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">PRECIO</th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">STOCK</th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 tracking-wide">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {productos.map(producto => (
              <tr key={producto.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={ensureAbsoluteUrl(producto.imagen)}
                    alt={producto.nombre}
                    className="w-12 h-12 object-cover border border-gray-100"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{producto.nombre}</div>
                  {producto.esRopa && (
                    <span className="text-xs text-gray-500">Ropa</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{producto.categoria || '-'}</td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">
                    ${producto.precio.toLocaleString('es-CO')}
                  </div>
                  {producto.precioAnterior > producto.precio && (
                    <div className="text-xs text-gray-400 line-through">
                      ${producto.precioAnterior.toLocaleString('es-CO')}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${producto.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {producto.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditar(producto)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onEliminar(producto.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productos.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-light">
            No hay productos. Agrega el primero.
          </div>
        )}
      </div>
    </div>
  );
}
