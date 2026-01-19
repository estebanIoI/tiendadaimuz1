"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Banner } from '@/types';
import { fetchBanners, fetchAllBanners, createBanner, updateBanner, deleteBanner, uploadImages } from '@/services/api';

export function useBanners(authToken: string | null = null) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [cargando, setCargando] = useState(true);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const cargarBanners = useCallback(async () => {
    try {
      setCargando(true);
      const data = authToken
        ? await fetchAllBanners(authToken)
        : await fetchBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error cargando banners:', error);
    } finally {
      setCargando(false);
    }
  }, [authToken]);

  useEffect(() => {
    cargarBanners();
  }, [cargarBanners]);

  const agregarBanner = async (bannerData: Omit<Banner, 'id' | 'createdAt'>) => {
    if (!authToken) return;

    try {
      const nuevo = await createBanner(bannerData, authToken);
      setBanners(prev => [...prev, nuevo]);
      return nuevo;
    } catch (error) {
      console.error('Error creando banner:', error);
      throw error;
    }
  };

  const actualizarBanner = async (id: number, bannerData: Omit<Banner, 'id' | 'createdAt'>) => {
    if (!authToken) return;

    try {
      const actualizado = await updateBanner(id, bannerData, authToken);
      setBanners(prev => prev.map(b => b.id === id ? actualizado : b));
      return actualizado;
    } catch (error) {
      console.error('Error actualizando banner:', error);
      throw error;
    }
  };

  const eliminarBanner = async (id: number) => {
    if (!authToken) return;

    try {
      await deleteBanner(id, authToken);
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error eliminando banner:', error);
      throw error;
    }
  };

  const subirImagenBanner = async (file: File): Promise<string | null> => {
    if (!authToken) return null;

    try {
      setSubiendoImagen(true);
      const urls = await uploadImages([file], authToken);
      return urls[0] || null;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    } finally {
      setSubiendoImagen(false);
    }
  };

  return {
    banners,
    cargando,
    subiendoImagen,
    cargarBanners,
    agregarBanner,
    actualizarBanner,
    eliminarBanner,
    subirImagenBanner
  };
}
