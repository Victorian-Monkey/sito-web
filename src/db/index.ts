import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Lazy connection pool initialization with error handling
// Environment variables should be loaded at application entry point, not here
let connectionPool: mysql.Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getConnectionPool(): mysql.Pool {
  if (!connectionPool) {
    try {
      connectionPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'victorian_monkey',
      });
    } catch (error) {
      console.error('Failed to create database connection pool:', error);
      throw new Error('Database connection initialization failed');
    }
  }
  return connectionPool;
}

function getDb() {
  if (!dbInstance) {
    try {
      const pool = getConnectionPool();
      dbInstance = drizzle(pool, { schema, mode: 'default' });
    } catch (error) {
      console.error('Failed to initialize database instance:', error);
      throw new Error('Database instance initialization failed');
    }
  }
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});

export { schema };
