import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../types';

export class AuthService {
  private static SECRET = process.env.JWT_SECRET || 'default_secret';

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compareAndGenerateToken(
    password: string,
    user: IUser
  ): Promise<string | null> {
    if (!user || !user.senha) return null;

    const match = await bcrypt.compare(password, user.senha);

    if (!match) return null;

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        nivel_acesso: user.nivel_acesso
      },
      AuthService.SECRET,
      { expiresIn: '1d' }
    );
  }
}
