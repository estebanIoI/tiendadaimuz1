// Tipos e interfaces de la aplicación

export interface ImagenProducto {
  id?: number;
  url: string;
  principal: boolean;
}

export interface ColorProducto {
  nombre: string;
  codigo: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioAnterior: number;
  precio: number;
  imagen: string;
  stock: number;
  categoria: string;
  esRopa?: boolean;
  tallas?: string[];
  colores?: ColorProducto[];
  imagenes?: ImagenProducto[];
}

export interface ProductoCarrito extends Producto {
  cantidad: number;
  tallaSeleccionada?: string;
  colorSeleccionado?: string;
}

export interface PedidoDetalles extends PedidoForm {
  items: ProductoCarrito[];
}

export interface Pedido {
  id: number;
  numeroPedido?: string;
  fecha: string;
  cliente: string;
  total: number;
  estado: string;
  productos?: ProductoCarrito[] | string;
  detalles?: PedidoDetalles;
}

export interface PedidoForm {
  nombre: string;
  telefono: string;
  email: string;
  cedula: string;
  departamento: string;
  municipio: string;
  direccion: string;
  barrio: string;
  notas: string;
}

export interface NuevoProducto {
  nombre: string;
  descripcion: string;
  precioAnterior: string | number;
  precio: string | number;
  imagen: string;
  stock: string | number;
  categoria: string;
  esRopa: boolean;
  tallas: string[];
  colores: ColorProducto[];
  imagenes: ImagenProducto[];
}

export interface PedidoConfirmado {
  numeroPedido: string;
  fecha: string;
  email: string;
  total: number;
  productos: ProductoCarrito[];
}

export interface Credenciales {
  usuario: string;
  password: string;
}

export interface Banner {
  id: number;
  imagen: string;
  titulo?: string;
  subtitulo?: string;
  textoBoton: string;
  linkBoton?: string;
  activo: boolean;
  orden: number;
  createdAt?: string;
}
