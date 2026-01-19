"use client";

import { useState, useCallback } from 'react';
import { loginApi } from '@/services/api';
import type { Credenciales } from '@/types';

export function useAuth() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [autenticado, setAutenticado] = useState(false);
  const [credenciales, setCredenciales] = useState<Credenciales>({ usuario: '', password: '' });

  const login = useCallback(async () => {
    try {
      const token = await loginApi(credenciales.usuario, credenciales.password);
      setAuthToken(token);
      setAutenticado(true);
      return true;
    } catch {
      alert('Credenciales incorrectas');
      return false;
    }
  }, [credenciales]);

  const logout = useCallback(() => {
    setAuthToken(null);
    setAutenticado(false);
    setCredenciales({ usuario: '', password: '' });
  }, []);

  const updateCredenciales = useCallback((field: keyof Credenciales, value: string) => {
    setCredenciales(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    authToken,
    autenticado,
    credenciales,
    login,
    logout,
    updateCredenciales,
    setCredenciales
  };
}
