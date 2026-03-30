import mysql from 'mysql2/promise';

export class Database {
  private static connection: mysql.Pool;

  public static getConnection(): mysql.Pool {
    if (!this.connection) {
      this.connection = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'keys-forge',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
    return this.connection;
  }
}