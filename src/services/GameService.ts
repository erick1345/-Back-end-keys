import { GameRepository } from '../repositories/GameRepository';
import { cacheGet, cacheSet, cacheInvalidate } from '../cache/cache';
import { publicarEvento, CANAIS } from '../messaging/events';
import { removeUploadedImage } from '../middleware/upload';
import { AppError } from '../errors/AppError';
import { logger } from '../lib/logger';
import { CreateGameDTO, UpdateGameDTO } from '../dtos/game.dto';

/**
 * Regras de negocio dos jogos. Orquestra o repositorio (banco), o cache (Redis)
 * e a mensageria (Pub/Sub). O controller fica fino, so chamando este service.
 */
export class GameService {
  constructor(private readonly repo = new GameRepository()) {}

  /** Lista paginada com cache-aside. Retorna se veio do cache (para o header X-Cache). */
  async listar(page: number, limit: number) {
    const chave = `jogos:page:${page}:limit:${limit}`;

    const cacheado = await cacheGet(chave);
    if (cacheado) {
      logger.info('cache', `HIT ${chave}`);
      return { data: cacheado, fromCache: true };
    }

    logger.info('cache', `MISS ${chave} -> consultando MySQL`);
    const data = await this.repo.listAll(page, limit);
    await cacheSet(chave, data);
    return { data, fromCache: false };
  }

  async buscarPorId(id: number) {
    const jogo = await this.repo.findById(id);
    if (!jogo) throw new AppError(404, 'Jogo não encontrado');
    return jogo;
  }

  async criar(dto: CreateGameDTO) {
    if (!dto.titulo || !dto.plataforma) {
      throw new AppError(400, 'Título e plataforma são obrigatórios');
    }

    const novo = await this.repo.create(dto);
    await this.invalidarENotificar(CANAIS.JOGO_CRIADO, { id: novo?.id, titulo: dto.titulo });
    return novo;
  }

  async atualizar(id: number, dto: UpdateGameDTO) {
    const anterior = await this.repo.findById(id);
    if (!anterior) throw new AppError(404, 'Jogo não encontrado');

    const jogo = await this.repo.update(id, dto);

    // se a imagem foi trocada, apaga a antiga do disco (se for upload local)
    if (anterior.imagem_url !== dto.imagem_url) {
      removeUploadedImage(anterior.imagem_url);
    }

    await this.invalidarENotificar(CANAIS.JOGO_ATUALIZADO, { id, titulo: dto.titulo });
    return jogo;
  }

  async remover(id: number) {
    const jogo = await this.repo.findById(id);
    if (!jogo) throw new AppError(404, 'Jogo não encontrado');

    await this.repo.delete(id);
    removeUploadedImage(jogo.imagem_url);

    await this.invalidarENotificar(CANAIS.JOGO_REMOVIDO, { id });
  }

  /** Toda escrita invalida o cache de listagem e publica um evento de dominio. */
  private async invalidarENotificar(canal: string, payload: Record<string, unknown>) {
    const n = await cacheInvalidate('jogos:*');
    logger.info('cache', `invalidado (${n} chaves)`);
    await publicarEvento(canal, payload);
  }
}
