import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../../../shared/globalTypes';

export class AuthService {
  private static SECRET = 'seu_segredo_aqui';

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
      { id: user.id! },
      AuthService.SECRET,
      { expiresIn: '1d' }
    );
  }
}