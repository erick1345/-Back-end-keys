import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../lib/logger';

/**
 * Envolve um handler async: qualquer erro lancado é encaminhado (next)
 * para o errorHandler, evitando try/catch repetido em toda rota.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Tratamento de erros centralizado (ultimo middleware da aplicacao).
 * AppError vira a resposta com o status certo; o resto vira 500 generico.
 */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    logger.warn('http', `${req.method} ${req.originalUrl} -> ${err.statusCode}: ${err.message}`);
    return res.status(err.statusCode).json({ message: err.message });
  }

  const msg = err instanceof Error ? err.message : String(err);
  logger.error('http', `${req.method} ${req.originalUrl} -> 500`, msg);
  return res.status(500).json({ message: 'Erro interno no servidor' });
}
