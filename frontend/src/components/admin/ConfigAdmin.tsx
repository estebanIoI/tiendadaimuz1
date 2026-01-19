"use client";

import { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Image, X, Check, Eye, EyeOff } from 'lucide-react';
import type { Banner } from '@/types';
import { ensureAbsoluteUrl } from '@/utils/url';
import { useConfig } from '@/hooks/useConfig';

interface ConfigAdminProps {
  banners: Banner[];
  subiendoImagen: boolean;
  onAgregarBanner: (banner: Omit<Banner, 'id' | 'createdAt'>) => Promise<Banner | undefined>;
  onActualizarBanner: (id: number, banner: Omit<Banner, 'id' | 'createdAt'>) => Promise<Banner | undefined>;
  onEliminarBanner: (id: number) => Promise<void>;
  onSubirImagen: (file: File) => Promise<string | null>;
  authToken: string;
}

interface BannerForm {
  imagen: string;
  titulo: string;
  subtitulo: string;
  textoBoton: string;
  linkBoton: string;
  activo: boolean;
  orden: number;
}

const initialBannerForm: BannerForm = {
  imagen: '',
  titulo: '',
  subtitulo: '',
  textoBoton: 'SHOP NOW',
  linkBoton: '',
  activo: true,
  orden: 0
};

export function ConfigAdmin({
  banners,
  subiendoImagen,
  onAgregarBanner,
  onActualizarBanner,
  onEliminarBanner,
  onSubirImagen,
  authToken
}: ConfigAdminProps) {
  const { config, actualizarConfig } = useConfig(authToken);
  const [logoForm, setLogoForm] = useState('');
  const [descuentoForm, setDescuentoForm] = useState('');
  const [mostrarFormBanner, setMostrarFormBanner] = useState(false);
  const [bannerEditando, setBannerEditando] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState<BannerForm>(initialBannerForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditarBanner = (banner: Banner) => {
    setBannerEditando(banner);
    setBannerForm({
      imagen: banner.imagen,
      titulo: banner.titulo || '',
      subtitulo: banner.subtitulo || '',
      textoBoton: banner.textoBoton || 'SHOP NOW',
      linkBoton: banner.linkBoton || '',
      activo: banner.activo,
      orden: banner.orden
    });
    setMostrarFormBanner(true);
  };

  const handleCancelarForm = () => {
    setMostrarFormBanner(false);
    setBannerEditando(null);
    setBannerForm(initialBannerForm);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await onSubirImagen(file);
    if (url) {
      setBannerForm(prev => ({ ...prev, imagen: url }));
    }
  };

  const handleGuardarBanner = async () => {
    if (!bannerForm.imagen) {
      alert('Debes subir una imagen para el banner');
      return;
    }

    try {
      if (bannerEditando) {
        await onActualizarBanner(bannerEditando.id, bannerForm);
      } else {
        await onAgregarBanner(bannerForm);
      }
      handleCancelarForm();
    } catch (error) {
      console.error('Error guardando banner:', error);
      alert('Error al guardar el banner');
    }
  };

  const handleEliminarBanner = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este banner?')) return;

    try {
      await onEliminarBanner(id);
    } catch (error) {
      console.error('Error eliminando banner:', error);
      alert('Error al eliminar el banner');
    }
  };

  const toggleActivoBanner = async (banner: Banner) => {
    try {
      await onActualizarBanner(banner.id, {
        ...banner,
        activo: !banner.activo
      });
    } catch (error) {
      console.error('Error actualizando banner:', error);
    }
  };

  const handleGuardarLogo = async () => {
    if (!logoForm.trim()) return;
    try {
      await actualizarConfig('logo', logoForm.trim());
      setLogoForm('');
    } catch (error) {
      console.error('Error guardando logo:', error);
      alert('Error al guardar el logo');
    }
  };

  const handleGuardarDescuento = async () => {
    if (!descuentoForm.trim()) return;
    try {
      await actualizarConfig('descuento_spam', descuentoForm.trim());
      setDescuentoForm('');
    } catch (error) {
      console.error('Error guardando descuento:', error);
      alert('Error al guardar el descuento');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-light text-gray-900 mb-6">Configuración</h2>

      {/* Sección de Logo */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Logo de la Tienda</h3>
            <p className="text-sm text-gray-500 mt-1">
              Personaliza el nombre que aparece en el header de la tienda
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
              LOGO ACTUAL
            </label>
            <div className="text-2xl font-black tracking-tight text-gray-900" style={{ fontFamily: 'serif' }}>
              {config.logo || 'DAIMUZ'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
              NUEVO LOGO
            </label>
            <input
              type="text"
              value={logoForm}
              onChange={(e) => setLogoForm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
              placeholder="Ingresa el nuevo logo"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGuardarLogo}
              disabled={!logoForm.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              Guardar Logo
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Descuento Spam */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Botón de Descuento Spam</h3>
            <p className="text-sm text-gray-500 mt-1">
              Configura el porcentaje de descuento que se muestra en el botón flotante del banner
            </p>
          </div>
          <button
            onClick={() => actualizarConfig('descuento_spam_activo', config.descuento_spam_activo === 'true' ? 'false' : 'true')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.descuento_spam_activo === 'true' ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.descuento_spam_activo === 'true' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className={`space-y-4 ${config.descuento_spam_activo !== 'true' ? 'opacity-50 pointer-events-none' : ''}`}>
          <div>
            <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
              PORCENTAJE DE DESCUENTO ACTUAL
            </label>
            <div className="text-2xl font-black tracking-tight text-red-600">
              {config.descuento_spam || '10'}%
            </div>
          </div>

          <div>
            <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
              NUEVO PORCENTAJE DE DESCUENTO
            </label>
            <input
              type="number"
              value={descuentoForm}
              onChange={(e) => setDescuentoForm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
              placeholder="Ej: 20"
              min="0"
              max="100"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGuardarDescuento}
              disabled={!descuentoForm.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-light hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              Guardar Descuento
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Banners */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Banners del Hero</h3>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona las imágenes que aparecen en el slider principal de la tienda
            </p>
          </div>
          <button
            onClick={() => setMostrarFormBanner(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            Agregar Banner
          </button>
        </div>

        {/* Lista de banners */}
        {banners.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300">
            <Image size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-light">No hay banners configurados</p>
            <p className="text-gray-400 text-sm mt-1">Agrega tu primer banner para mostrar en la tienda</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`flex items-center gap-4 p-4 border ${banner.activo ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-60'}`}
              >
                {/* Preview de imagen */}
                <div className="w-32 h-20 bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={ensureAbsoluteUrl(banner.imagen)}
                    alt={banner.titulo || 'Banner'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info del banner */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${banner.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {banner.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className="text-xs text-gray-400">Orden: {banner.orden}</span>
                  </div>
                  {banner.titulo && (
                    <p className="font-medium text-gray-900 truncate mt-1">{banner.titulo}</p>
                  )}
                  {banner.subtitulo && (
                    <p className="text-sm text-gray-500 truncate">{banner.subtitulo}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Botón: {banner.textoBoton}</p>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActivoBanner(banner)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title={banner.activo ? 'Desactivar' : 'Activar'}
                  >
                    {banner.activo ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleEditarBanner(banner)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleEliminarBanner(banner.id)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal/Form de Banner */}
      {mostrarFormBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {bannerEditando ? 'Editar Banner' : 'Nuevo Banner'}
              </h3>
              <button
                onClick={handleCancelarForm}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Imagen del banner */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
                  IMAGEN DEL BANNER *
                </label>
                <div className="border border-dashed border-gray-300 p-4">
                  {bannerForm.imagen ? (
                    <div className="relative">
                      <img
                        src={ensureAbsoluteUrl(bannerForm.imagen)}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => setBannerForm(prev => ({ ...prev, imagen: '' }))}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {subiendoImagen ? (
                        <div className="text-gray-500">Subiendo imagen...</div>
                      ) : (
                        <>
                          <Image size={32} className="text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">Haz clic para subir una imagen</p>
                          <p className="text-xs text-gray-400 mt-1">Recomendado: 1920x1080px</p>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
                  TÍTULO (opcional)
                </label>
                <input
                  type="text"
                  value={bannerForm.titulo}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, titulo: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
                  placeholder="Ej: Nueva Colección"
                />
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
                  SUBTÍTULO (opcional)
                </label>
                <input
                  type="text"
                  value={bannerForm.subtitulo}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, subtitulo: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
                  placeholder="Ej: Descubre nuestras nuevas piezas"
                />
              </div>

              {/* Texto del botón */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
                  TEXTO DEL BOTÓN
                </label>
                <input
                  type="text"
                  value={bannerForm.textoBoton}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, textoBoton: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
                  placeholder="SHOP NOW"
                />
              </div>

              {/* Orden */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
                  ORDEN DE APARICIÓN
                </label>
                <input
                  type="number"
                  value={bannerForm.orden}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, orden: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 font-light text-gray-900 bg-white"
                  min="0"
                />
                <p className="text-xs text-gray-400 mt-1">Los banners se muestran de menor a mayor orden</p>
              </div>

              {/* Activo */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="bannerActivo"
                  checked={bannerForm.activo}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, activo: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="bannerActivo" className="text-sm text-gray-700">
                  Banner activo (visible en la tienda)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={handleCancelarForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-light hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarBanner}
                disabled={!bannerForm.imagen || subiendoImagen}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} />
                {bannerEditando ? 'Guardar Cambios' : 'Crear Banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
