import { Database } from '../database/Database';

export class GameRepository {
  async create(data: any) {
    const connection = Database.getConnection();

    const [result]: any = await connection.execute(
      `INSERT INTO jogos 
      (titulo, descricao, preco, plataforma, estoque, imagem_url)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.titulo,
        data.descricao,
        data.preco,
        data.plataforma,
        data.estoque,
        data.imagem_url
      ]
    );

    return {
      id: result.insertId,
      ...data
    };
  }

  async listAll(page: number = 1, limit: number = 10) {
    const connection = Database.getConnection();
    const offset = (page - 1) * limit;

    const [games]: any = await connection.execute(
      `SELECT * FROM jogos ORDER BY id ASC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult]: any = await connection.execute(
      `SELECT COUNT(*) as total FROM jogos`
    );

    const total = countResult[0].total;

    return {
      jogos: games,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  async findById(id: number) {
    const connection = Database.getConnection();

    const [rows]: any = await connection.execute(
      `SELECT * FROM jogos WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  }

  async update(id: number, data: any) {
    const connection = Database.getConnection();

    await connection.execute(
      `UPDATE jogos
       SET titulo = ?, descricao = ?, preco = ?, plataforma = ?, estoque = ?, imagem_url = ?
       WHERE id = ?`,
      [
        data.titulo,
        data.descricao,
        data.preco,
        data.plataforma,
        data.estoque,
        data.imagem_url,
        id
      ]
    );

    return await this.findById(id);
  }

  async delete(id: number) {
    const connection = Database.getConnection();

    await connection.execute(
      `DELETE FROM jogos WHERE id = ?`,
      [id]
    );

    return true;
  }
}