const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

(async () => {
  try {
    const password = process.argv[2] || 'Admin123!';
    const rounds = 10;
    const hash = await bcrypt.hash(password, rounds);

    const sqlFile = path.resolve(__dirname, '..', 'basedevcontend.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      multipleStatements: true
    });

    // Ejecutar el SQL completo (crea DB y tablas)
    await connection.query(sqlContent);

    // Usar la base de datos configurada
    const dbName = process.env.DB_NAME || 'devcontend_db';
    await connection.query(`USE \`${dbName}\``);

    // Insertar o actualizar admin
    await connection.execute(
      `INSERT INTO User (usuario, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)`,
      ['admin', hash]
    );

    console.log('OK_ADMIN_CREATED');
    console.log('ADMIN_PASSWORD_HASH:' + hash);

    await connection.end();
  } catch (err) {
    console.error('ERROR_RUN:', err.message || err);
    process.exit(1);
  }
})();
