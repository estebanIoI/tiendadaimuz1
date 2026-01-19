"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchConfig, updateConfig } from '@/services/api';

export function useConfig(authToken: string | null = null) {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(true);

  const cargarConfig = useCallback(async () => {
    try {
      setCargando(true);
      const data = await fetchConfig();
      setConfig(data);
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarConfig();
  }, [cargarConfig]);

  const actualizarConfig = async (clave: string, valor: string) => {
    if (!authToken) return;

    try {
      await updateConfig(clave, valor, authToken);
      setConfig(prev => ({ ...prev, [clave]: valor }));
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      throw error;
    }
  };

  return {
    config,
    cargando,
    actualizarConfig,
    recargar: cargarConfig
  };
}