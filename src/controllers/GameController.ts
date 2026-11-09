import { Request, Response } from 'express';
import { GameService } from '../services/GameService';
import { asyncHandler } from '../middleware/errorHandler';

const service = new GameService();

/**
 * Controller de jogos: so cuida de HTTP (ler request / responder).
 * A regra de negocio fica no GameService.
 */
export const GameController = {
  listar: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { data, fromCache } = await service.listar(page, limit);
    res.setHeader('X-Cache', fromCache ? 'HIT' : 'MISS');
    return res.json(data);
  }),

  detalhar: asyncHandler(async (req: Request, res: Response) => {
    const jogo = await service.buscarPorId(Number(req.params.id));
    return res.json(jogo);
  }),

  criar: asyncHandler(async (req: Request, res: Response) => {
    const novo = await service.criar(req.body);
    return res.status(201).json(novo);
  }),

  atualizar: asyncHandler(async (req: Request, res: Response) => {
    const jogo = await service.atualizar(Number(req.params.id), req.body);
    return res.json(jogo);
  }),

  remover: asyncHandler(async (req: Request, res: Response) => {
    await service.remover(Number(req.params.id));
    return res.json({ message: 'Jogo removido com sucesso' });
  }),
};
