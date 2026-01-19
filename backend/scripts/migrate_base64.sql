-- Migración para soportar imágenes base64
-- Ejecutar en la base de datos de producción

-- Cambiar columna imagen en Producto a LONGTEXT
ALTER TABLE Producto MODIFY COLUMN imagen LONGTEXT;

-- Cambiar columna url en ImagenProducto a LONGTEXT
ALTER TABLE ImagenProducto MODIFY COLUMN url LONGTEXT NOT NULL;

-- Cambiar columna imagen en Banner a LONGTEXT
ALTER TABLE Banner MODIFY COLUMN imagen LONGTEXT NOT NULL;
