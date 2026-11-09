/**
 * Erro de aplicacao com status HTTP. Lancado pelos services/controllers e
 * tratado de forma centralizada pelo errorHandler.
 */
export class AppError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}
