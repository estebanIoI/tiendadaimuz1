import type { ColorProducto } from '@/types';

// Tallas disponibles para productos de ropa
export const TALLAS_DISPONIBLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Colores predefinidos con sus códigos hexadecimales
export const COLORES_PREDEFINIDOS: ColorProducto[] = [
  { nombre: 'Negro', codigo: '#000000' },
  { nombre: 'Blanco', codigo: '#FFFFFF' },
  { nombre: 'Rojo', codigo: '#EF4444' },
  { nombre: 'Azul', codigo: '#3B82F6' },
  { nombre: 'Verde', codigo: '#22C55E' },
  { nombre: 'Amarillo', codigo: '#EAB308' },
  { nombre: 'Gris', codigo: '#6B7280' },
  { nombre: 'Rosa', codigo: '#EC4899' },
  { nombre: 'Naranja', codigo: '#F97316' },
  { nombre: 'Morado', codigo: '#A855F7' },
];

// URL base del API
const _RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const API_URL = _RAW_API_URL.replace(/\/+$|\/+$/g, '').replace(/\/api$/i, '');

// Departamentos y municipios de Colombia
export const departamentosMunicipios: Record<string, string[]> = {
  'Amazonas': ['Leticia', 'Puerto Nariño'],
  'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Turbo', 'Rionegro'],
  'Arauca': ['Arauca', 'Arauquita', 'Saravena', 'Fortul', 'Tame'],
  'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Puerto Colombia'],
  'Bogotá D.C.': ['Bogotá D.C.'],
  'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar'],
  'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa'],
  'Caldas': ['Manizales', 'Villamaría', 'Chinchiná', 'La Dorada', 'Riosucio'],
  'Caquetá': ['Florencia', 'San Vicente del Caguán', 'Puerto Rico', 'El Doncello'],
  'Casanare': ['Yopal', 'Aguazul', 'Villanueva', 'Monterrey', 'Tauramena'],
  'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Patía', 'Piendamó'],
  'Cesar': ['Valledupar', 'Aguachica', 'Bosconia', 'Codazzi', 'Curumaní'],
  'Chocó': ['Quibdó', 'Istmina', 'Condoto', 'Tadó', 'Acandí'],
  'Cundinamarca': ['Soacha', 'Facatativá', 'Zipaquirá', 'Chía', 'Mosquera', 'Fusagasugá'],
  'Córdoba': ['Montería', 'Cereté', 'Lorica', 'Sahagún', 'Planeta Rica'],
  'Guainía': ['Inírida', 'Barranco Minas'],
  'Guaviare': ['San José del Guaviare', 'Calamar', 'El Retorno'],
  'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre'],
  'La Guajira': ['Riohacha', 'Maicao', 'Uribia', 'Manaure', 'Fonseca'],
  'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco', 'Plato'],
  'Meta': ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'San Martín'],
  'Nariño': ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres', 'Samaniego'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios'],
  'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito', 'Sibundoy', 'Valle del Guamuez'],
  'Quindío': ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro', 'Circasia'],
  'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'],
  'San Andrés y Providencia': ['San Andrés', 'Providencia'],
  'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
  'Sucre': ['Sincelejo', 'Corozal', 'Sampués', 'Tolú', 'Majagual'],
  'Tolima': ['Ibagué', 'Espinal', 'Girardot', 'Melgar', 'Honda'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Buga'],
  'Vaupés': ['Mitú', 'Carurú'],
  'Vichada': ['Puerto Carreño', 'La Primavera', 'Cumaribo']
};

// Estados de pedido
export const ESTADOS_PEDIDO = [
  'Pendiente',
  'Procesando',
  'Enviado',
  'Entregado',
  'Cancelado'
] as const;

// Estado inicial del formulario de pedido
export const INITIAL_PEDIDO_FORM = {
  nombre: '',
  telefono: '',
  email: '',
  cedula: '',
  departamento: '',
  municipio: '',
  direccion: '',
  barrio: '',
  notas: ''
};

// Estado inicial de nuevo producto
export const INITIAL_NUEVO_PRODUCTO = {
  nombre: '',
  descripcion: '',
  precioAnterior: '',
  precio: '',
  imagen: '',
  stock: '',
  categoria: '',
  esRopa: false,
  tallas: [] as string[],
  colores: [] as { nombre: string; codigo: string }[],
  imagenes: [] as { url: string; principal: boolean }[]
};
