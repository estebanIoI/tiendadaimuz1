"use client";

import type { Credenciales } from '@/types';

interface LoginFormProps {
  credenciales: Credenciales;
  onCredencialesChange: (field: keyof Credenciales, value: string) => void;
  onLogin: () => void;
  onVolver: () => void;
}

export function LoginForm({ credenciales, onCredencialesChange, onLogin, onVolver }: LoginFormProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 max-w-sm w-full shadow-sm border border-gray-200">
        <h2 className="text-xl font-light text-gray-900 mb-6 text-center tracking-wide">
          inicia sesión
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
              USUARIO
            </label>
            <input
              type="text"
              value={credenciales.usuario}
              onChange={(e) => onCredencialesChange('usuario', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light"
              placeholder="Usuario"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-600 mb-2 tracking-wide">
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={credenciales.password}
              onChange={(e) => onCredencialesChange('password', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-light"
              placeholder="Contraseña"
              onKeyDown={(e) => e.key === 'Enter' && onLogin()}
            />
          </div>
          <button
            onClick={onLogin}
            className="w-full bg-gray-900 text-white py-3 font-light tracking-wide hover:bg-gray-800 transition-colors"
          >
            INGRESAR
          </button>
          <button
            onClick={onVolver}
            className="w-full text-gray-600 py-2 font-light text-sm hover:text-gray-900 transition-colors"
          >
            ← Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
}
