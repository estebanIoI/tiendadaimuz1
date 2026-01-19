"use client";

import { Upload, X, Check } from 'lucide-react';
import { TALLAS_DISPONIBLES, COLORES_PREDEFINIDOS } from '@/constants';
import { ensureAbsoluteUrl } from '@/utils/url';
import type { NuevoProducto, ColorProducto } from '@/types';

interface ProductoFormProps {
  producto: NuevoProducto;
  editando: boolean;
  subiendoImagenes: boolean;
  onUpdate: (updates: Partial<NuevoProducto>) => void;
  onImageUpload: (files: FileList) => void;
  onEliminarImagen: (index: number) => void;
  onSetPrincipal: (index: number) => void;
  onToggleTalla: (talla: string) => void;
  onToggleColor: (color: ColorProducto) => void;
  onGuardar: () => void;
  onCancelar: () => void;
}

export function ProductoForm({
  producto,
  editando,
  subiendoImagenes,
  onUpdate,
  onImageUpload,
  onEliminarImagen,
  onSetPrincipal,
  onToggleTalla,
  onToggleColor,
  onGuardar,
  onCancelar
}: ProductoFormProps) {
  return (
    <div className="bg-white border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-light text-gray-900 mb-6">
        {editando ? 'Editar Producto' : 'Nuevo Producto'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label className="block text-xs font-light text-gray-600 mb-2">NOMBRE *</label>
          <input
            type="text"
            value={producto.nombre}
            onChange={(e) => onUpdate({ nombre: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
            placeholder="Nombre del producto"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-light text-gray-600 mb-2">CATEGORÍA</label>
          <input
            type="text"
            value={producto.categoria}
            onChange={(e) => onUpdate({ categoria: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
            placeholder="Categoría"
          />
        </div>

        {/* Precio Anterior */}
        <div>
          <label className="block text-xs font-light text-gray-600 mb-2">PRECIO ANTERIOR</label>
          <input
            type="number"
            value={producto.precioAnterior}
            onChange={(e) => onUpdate({ precioAnterior: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
            placeholder="0"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-xs font-light text-gray-600 mb-2">PRECIO *</label>
          <input
            type="number"
            value={producto.precio}
            onChange={(e) => onUpdate({ precio: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
            placeholder="0"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-xs font-light text-gray-600 mb-2">STOCK</label>
          <input
            type="number"
            value={producto.stock}
            onChange={(e) => onUpdate({ stock: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
            placeholder="0"
          />
        </div>

        {/* Es Ropa */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="esRopa"
            checked={producto.esRopa}
            onChange={(e) => onUpdate({ esRopa: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="esRopa" className="text-sm font-light text-gray-700">
            Es producto de ropa (tiene tallas y colores)
          </label>
        </div>
      </div>

      {/* Imágenes */}
      <div className="mt-6">
        <label className="block text-xs font-light text-gray-600 mb-2">IMÁGENES</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {producto.imagenes.map((img, index) => (
            <div key={index} className="relative w-24 h-24 border border-gray-200">
              <img
                src={ensureAbsoluteUrl(img.url)}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {img.principal && (
                <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1">
                  Principal
                </span>
              )}
              <div className="absolute top-1 right-1 flex gap-1">
                {!img.principal && (
                  <button
                    onClick={() => onSetPrincipal(index)}
                    className="p-1 bg-blue-500 text-white text-xs"
                    title="Establecer como principal"
                  >
                    <Check size={12} />
                  </button>
                )}
                <button
                  onClick={() => onEliminarImagen(index)}
                  className="p-1 bg-red-500 text-white text-xs"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}

          <label className="w-24 h-24 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            <Upload size={20} className="text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">
              {subiendoImagenes ? 'Subiendo...' : 'Subir'}
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && onImageUpload(e.target.files)}
              className="hidden"
              disabled={subiendoImagenes}
            />
          </label>
        </div>
      </div>

      {/* Tallas (si es ropa) */}
      {producto.esRopa && (
        <div className="mt-6">
          <label className="block text-xs font-light text-gray-600 mb-2">TALLAS DISPONIBLES</label>
          <div className="flex flex-wrap gap-2">
            {TALLAS_DISPONIBLES.map(talla => (
              <button
                key={talla}
                onClick={() => onToggleTalla(talla)}
                className={`px-4 py-2 text-sm font-light transition-colors ${
                  producto.tallas.includes(talla)
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-300 text-gray-700 hover:border-gray-900'
                }`}
              >
                {talla}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colores (si es ropa) */}
      {producto.esRopa && (
        <div className="mt-6">
          <label className="block text-xs font-light text-gray-600 mb-2">COLORES DISPONIBLES</label>
          <div className="flex flex-wrap gap-3">
            {COLORES_PREDEFINIDOS.map(color => (
              <button
                key={color.codigo}
                onClick={() => onToggleColor(color)}
                className={`flex items-center gap-2 px-3 py-2 border transition-colors ${
                  producto.colores.some(c => c.codigo === color.codigo)
                    ? 'border-gray-900 bg-gray-100'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.codigo }}
                />
                <span className="text-sm font-light">{color.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Descripción */}
      <div className="mt-6">
        <label className="block text-xs font-light text-gray-600 mb-2">DESCRIPCIÓN</label>
        <textarea
          value={producto.descripcion}
          onChange={(e) => onUpdate({ descripcion: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white resize-none"
          placeholder="Descripción del producto"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onGuardar}
          className="px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
        >
          {editando ? 'ACTUALIZAR' : 'AGREGAR'}
        </button>
        <button
          onClick={onCancelar}
          className="px-6 py-2 border border-gray-300 text-gray-700 font-light hover:bg-gray-50 transition-colors"
        >
          CANCELAR
        </button>
      </div>
    </div>
  );
}
