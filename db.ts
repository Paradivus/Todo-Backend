import mysql from 'mysql2/promise';

// Database Configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'tasks_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = {
  query: async (sql: string, params: any[] = []) => {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('SQL Error:', error);
      throw error;
    }
  },

  init: async () => {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('Connected to MySQL.');

      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL
        )
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          status ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        )
      `);
      
      console.log('Schema verified.');
    } catch (err) {
      console.error('Database Initialization Failed:', err);
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }
};