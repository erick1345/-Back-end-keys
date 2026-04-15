import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Database } from '../database/Database';

export interface PurchaseRow extends RowDataPacket {
  id: number;
  user_id: number;
  game_id: number;
  created_at: string;
}

export interface LibraryGameRow extends RowDataPacket {
  purchase_id: number;
  purchased_at: string;
  id: number;
  titulo: string;
  descricao: string | null;
  preco: number;
  plataforma: string;
  imagem_url: string | null;
  estoque: number;
  requisitos_minimos: string | null;
  requisitos_recomendados: string | null;
}

export interface SalesStatItem {
  gameId: number;
  titulo: string;
  totalSales: number;
  totalRevenue: number;
}

export class PurchaseRepository {
  private db = Database.getConnection();

  async create(userId: number, gameId: number) {
    const connection = await this.db.getConnection();

    try {
      await connection.beginTransaction();

      const [gameRows] = await connection.execute<RowDataPacket[]>(
        `
        SELECT id, estoque, preco
        FROM jogos
        WHERE id = ?
        FOR UPDATE
        `,
        [gameId]
      );

      if (!gameRows.length) {
        await connection.rollback();
        return { error: 'Jogo não encontrado', status: 404 as const };
      }

      const game = gameRows[0];

      if (Number(game.estoque) <= 0) {
        await connection.rollback();
        return { error: 'Jogo sem estoque disponível', status: 400 as const };
      }

      const [existingPurchase] = await connection.execute<RowDataPacket[]>(
        `
        SELECT id
        FROM purchases
        WHERE user_id = ? AND game_id = ?
        LIMIT 1
        `,
        [userId, gameId]
      );

      if (existingPurchase.length > 0) {
        await connection.rollback();
        return {
          error: 'Usuário já possui este jogo na biblioteca',
          status: 409 as const
        };
      }

      const [result] = await connection.execute<ResultSetHeader>(
        `
        INSERT INTO purchases (user_id, game_id)
        VALUES (?, ?)
        `,
        [userId, gameId]
      );

      await connection.execute(
        `
        UPDATE jogos
        SET estoque = estoque - 1
        WHERE id = ?
        `,
        [gameId]
      );

      await connection.commit();

      return {
        id: result.insertId,
        user_id: userId,
        game_id: gameId
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findUserGamePurchase(userId: number, gameId: number) {
    const [rows] = await this.db.execute<PurchaseRow[]>(
      `
      SELECT id, user_id, game_id, created_at
      FROM purchases
      WHERE user_id = ? AND game_id = ?
      LIMIT 1
      `,
      [userId, gameId]
    );

    return rows[0] || null;
  }

  async getUserLibrary(userId: number) {
    const [rows] = await this.db.execute<LibraryGameRow[]>(
      `
      SELECT
        p.id AS purchase_id,
        p.created_at AS purchased_at,
        j.id,
        j.titulo,
        j.descricao,
        j.preco,
        j.plataforma,
        j.imagem_url,
        j.estoque,
        j.requisitos_minimos,
        j.requisitos_recomendados
      FROM purchases p
      INNER JOIN jogos j ON j.id = p.game_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC, p.id DESC
      `,
      [userId]
    );

    return rows.map((row) => ({
      purchase_id: Number(row.purchase_id),
      purchased_at: row.purchased_at,
      id: Number(row.id),
      titulo: row.titulo,
      descricao: row.descricao,
      preco: Number(row.preco),
      plataforma: row.plataforma,
      imagem_url: row.imagem_url,
      estoque: Number(row.estoque),
      requisitos_minimos: row.requisitos_minimos,
      requisitos_recomendados: row.requisitos_recomendados
    }));
  }

  async getLibraryByUserId(userId: number) {
    return this.getUserLibrary(userId);
  }

  async getSalesStats() {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `
      SELECT
        j.id AS gameId,
        j.titulo,
        COUNT(p.id) AS totalSales,
        COALESCE(SUM(j.preco), 0) AS totalRevenue
      FROM purchases p
      INNER JOIN jogos j ON j.id = p.game_id
      GROUP BY j.id, j.titulo
      ORDER BY totalSales DESC, totalRevenue DESC, j.titulo ASC
      `
    );

    const items: SalesStatItem[] = rows.map((row) => ({
      gameId: Number(row.gameId),
      titulo: String(row.titulo),
      totalSales: Number(row.totalSales),
      totalRevenue: Number(row.totalRevenue)
    }));

    const totalSales = items.reduce((sum, item) => sum + item.totalSales, 0);
    const totalRevenue = items.reduce((sum, item) => sum + item.totalRevenue, 0);

    return {
      topGames: items,
      totalSales,
      totalRevenue
    };
  }
}