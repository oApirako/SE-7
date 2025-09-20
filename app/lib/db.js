// app/lib/db.js
import mysql from 'mysql2/promise';

export async function connect() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'research',
    port: 3306
  });
  return connection;
}
