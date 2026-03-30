import { Database } from '../database/Database';
import { IUser } from '@shared/globalTypes';
import { RowDataPacket } from 'mysql2';

export class UserRepository {
  private db = Database.getConnection();

  async create(user: IUser): Promise<void> {
    const sql = 'INSERT INTO usuarios (nome, email, cpf, senha) VALUES (?, ?, ?, ?)';
    await this.db.execute(sql, [user.nome, user.email, user.cpf, user.senha]);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows.length > 0 ? (rows[0] as IUser) : null;
  }

  async findById(id: number): Promise<IUser | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>('SELECT id, nome, email, cpf FROM usuarios WHERE id = ?', [id]);
    return rows.length > 0 ? (rows[0] as IUser) : null;
  }

  async update(id: number, nome: string, cpf: string): Promise<void> {
    const sql = 'UPDATE usuarios SET nome = ?, cpf = ? WHERE id = ?';
    await this.db.execute(sql, [nome, cpf, id]);
  }
}