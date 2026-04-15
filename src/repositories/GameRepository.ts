import { Database } from '../database/Database';

export class GameRepository {
  async create(data: any) {
    const connection = Database.getConnection();

    const [result]: any = await connection.execute(
      `INSERT INTO jogos 
      (titulo, descricao, preco, plataforma, estoque, imagem_url, requisitos_minimos, requisitos_recomendados)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.titulo,
        data.descricao,
        Number(data.preco),
        data.plataforma,
        Number(data.estoque),
        data.imagem_url,
        data.requisitos_minimos || null,
        data.requisitos_recomendados || null
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
       SET titulo = ?, descricao = ?, preco = ?, plataforma = ?, estoque = ?, imagem_url = ?, requisitos_minimos = ?, requisitos_recomendados = ?
       WHERE id = ?`,
      [
        data.titulo,
        data.descricao,
        Number(data.preco),
        data.plataforma,
        Number(data.estoque),
        data.imagem_url,
        data.requisitos_minimos || null,
        data.requisitos_recomendados || null,
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

  async getDashboardStats() {
    const connection = Database.getConnection();

    const [statsRows]: any = await connection.execute(`
      SELECT 
        COUNT(*) AS totalJogos,
        COALESCE(SUM(preco * estoque), 0) AS valorEstoque,
        COUNT(CASE WHEN estoque <= 5 THEN 1 END) AS estoqueBaixo
      FROM jogos
    `);

    const [ultimosJogos]: any = await connection.execute(`
      SELECT id, titulo, preco, estoque
      FROM jogos
      ORDER BY id DESC
      LIMIT 6
    `);

    const [ranking]: any = await connection.execute(`
      SELECT titulo, estoque
      FROM jogos
      ORDER BY estoque ASC, titulo ASC
      LIMIT 5
    `);

    const [estoqueGrafico]: any = await connection.execute(`
      SELECT id, titulo, estoque
      FROM jogos
      ORDER BY estoque ASC, titulo ASC
      LIMIT 10
    `);

    return {
      totalJogos: Number(statsRows[0].totalJogos || 0),
      valorEstoque: Number(statsRows[0].valorEstoque || 0),
      estoqueBaixo: Number(statsRows[0].estoqueBaixo || 0),
      ultimosJogos,
      ranking,
      estoqueGrafico
    };
  }
}