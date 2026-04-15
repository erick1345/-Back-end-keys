import { Database } from '../src/database/Database';

afterAll(async () => {
  const connection = Database.getConnection();
  await connection.end();
});