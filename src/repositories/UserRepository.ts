import { Database } from '../database/Database';
import { IUser } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class UserRepository {
  private db = Database.getConnection();

  async create(user: IUser): Promise<void> {
    const sql = `
      INSERT INTO usuarios (nome, email, cpf, senha, nivel_acesso)
      VALUES (?, ?, ?, ?, ?)
    `;

    await this.db.execute(sql, [
      user.nome,
      user.email,
      user.cpf,
      user.senha || '',
      user.nivel_acesso || 'cliente'
    ]);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `
      SELECT id, nome, email, cpf, senha, nivel_acesso
      FROM usuarios
      WHERE email = ?
      `,
      [email]
    );

    return rows.length > 0 ? (rows[0] as IUser) : null;
  }

  async findById(id: number): Promise<IUser | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `
      SELECT id, nome, email, cpf, nivel_acesso
      FROM usuarios
      WHERE id = ?
      `,
      [id]
    );

    return rows.length > 0 ? (rows[0] as IUser) : null;
  }

  async findByIdWithPassword(id: number): Promise<IUser | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `
      SELECT id, nome, email, cpf, senha, nivel_acesso
      FROM usuarios
      WHERE id = ?
      `,
      [id]
    );

    return rows.length > 0 ? (rows[0] as IUser) : null;
  }

  async listAll(): Promise<IUser[]> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `
      SELECT id, nome, email, cpf, nivel_acesso, created_at
      FROM usuarios
      ORDER BY id ASC
      `
    );

    return rows as IUser[];
  }

  async adminUpdate(
    id: number,
    nome: string,
    nivelAcesso: 'admin' | 'cliente'
  ): Promise<boolean> {
    const [result] = await this.db.execute<ResultSetHeader>(
      `
      UPDATE usuarios
      SET nome = ?, nivel_acesso = ?
      WHERE id = ?
      `,
      [nome, nivelAcesso, id]
    );

    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await this.db.execute<ResultSetHeader>(
      `
      DELETE FROM usuarios
      WHERE id = ?
      `,
      [id]
    );

    return result.affectedRows > 0;
  }

  async updateProfile(userId: number, nome: string, senhaHash?: string): Promise<void> {
    if (senhaHash) {
      await this.db.execute(
        `
        UPDATE usuarios
        SET nome = ?, senha = ?
        WHERE id = ?
        `,
        [nome, senhaHash, userId]
      );
      return;
    }

    await this.db.execute(
      `
      UPDATE usuarios
      SET nome = ?
      WHERE id = ?
      `,
      [nome, userId]
    );
  }
}
