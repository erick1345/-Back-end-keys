import mysql from 'mysql2/promise';

export class Database {
  private static connection: mysql.Pool;

  public static getConnection(): mysql.Pool {
    if (!this.connection) {
      this.connection = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }

    return this.connection;
  }
}