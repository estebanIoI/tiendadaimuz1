-- SQL para crear las tablas de productos, pedidos, usuarios y relaciones
-- Compatible con MySQL/MariaDB
CREATE DATABASE IF NOT EXISTS devcontend_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE devcontend_db;

-- Tabla de usuarios (admin)
CREATE TABLE IF NOT EXISTS User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Tabla de productos con campos para ropa
CREATE TABLE IF NOT EXISTS Producto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precioAnterior INT,
    precio INT NOT NULL,
    imagen LONGTEXT,
    stock INT NOT NULL,
    categoria VARCHAR(255),
    esRopa BOOLEAN DEFAULT FALSE,
    tallas TEXT,
    colores TEXT
);

-- Tabla de imágenes de productos (LONGTEXT para soportar base64)
CREATE TABLE IF NOT EXISTS ImagenProducto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    url LONGTEXT NOT NULL,
    productoId INT NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (productoId) REFERENCES Producto(id) ON DELETE CASCADE
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS Pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    cliente VARCHAR(255) NOT NULL,
    total INT NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    detalles TEXT
);

-- Tabla de relación pedido-producto
CREATE TABLE IF NOT EXISTS PedidoProducto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedidoId INT NOT NULL,
    productoId INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (pedidoId) REFERENCES Pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (productoId) REFERENCES Producto(id) ON DELETE CASCADE
);

-- Tabla de banners para el hero de la tienda (LONGTEXT para soportar base64)
CREATE TABLE IF NOT EXISTS Banner (
    id INT PRIMARY KEY AUTO_INCREMENT,
    imagen LONGTEXT NOT NULL,
    titulo VARCHAR(255),
    subtitulo VARCHAR(255),
    textoBoton VARCHAR(100) DEFAULT 'SHOP NOW',
    linkBoton VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    orden INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de configuraciones generales
CREATE TABLE IF NOT EXISTS Config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clave VARCHAR(255) NOT NULL UNIQUE,
    valor TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar usuario admin por defecto (password: Admin123!)
-- El hash es generado con bcrypt (actualizado por create_admin.js)
INSERT INTO User (usuario, password) VALUES ('admin', '$2b$10$cgg6BSX9.ka9VYpaqfc1auXIJWDT6KRzmwPZSHsckDzTz.eMZXt7S')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- Insertar configuración por defecto para el logo
INSERT INTO Config (clave, valor) VALUES ('logo', 'DAIMUZ')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- Insertar configuración por defecto para el descuento spam
INSERT INTO Config (clave, valor) VALUES ('descuento_spam', '10')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);
