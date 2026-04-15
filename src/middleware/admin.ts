import { Request, Response, NextFunction } from 'express';

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.nivel_acesso !== 'admin') {
    return res.status(403).json({
      message: 'Acesso negado'
    });
  }

  next();
}