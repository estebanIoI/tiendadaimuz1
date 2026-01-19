"use client";

import { BarChart3, ShoppingBag, Package, Settings, Eye, LogOut } from 'lucide-react';

type SeccionAdmin = 'dashboard' | 'productos' | 'pedidos' | 'config';

interface SidebarProps {
  seccionActual: SeccionAdmin;
  onCambiarSeccion: (seccion: SeccionAdmin) => void;
  onVerTienda: () => void;
  onSalir: () => void;
}

export function Sidebar({ seccionActual, onCambiarSeccion, onVerTienda, onSalir }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as SeccionAdmin, label: 'Dashboard', icon: BarChart3 },
    { id: 'productos' as SeccionAdmin, label: 'Productos', icon: ShoppingBag },
    { id: 'pedidos' as SeccionAdmin, label: 'Pedidos', icon: Package },
    { id: 'config' as SeccionAdmin, label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-10">
        <span className="text-2xl font-light tracking-widest">G&S</span>
        <span className="text-xs text-gray-400 block mt-1">Panel de Control</span>
      </div>

      <nav className="space-y-2">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onCambiarSeccion(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-light transition-colors ${
              seccionActual === id
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-10 pt-6 border-t border-gray-800 space-y-2">
        <button
          onClick={onVerTienda}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-light text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Eye size={18} />
          Ver Tienda
        </button>
        <button
          onClick={onSalir}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-light text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={18} />
          Salir
        </button>
      </div>
    </aside>
  );
}
