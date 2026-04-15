import { IUser } from '../types';

export class User implements IUser {
  constructor(
    public nome: string,
    public email: string,
    public cpf: string,
    public senha?: string,
    public id?: number,
    public nivel_acesso?: 'admin' | 'cliente'
  ) {}
}
