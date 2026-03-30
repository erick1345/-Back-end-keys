import { IUser } from '@shared/globalTypes';

export class User implements IUser {
  constructor(
    public nome: string,
    public email: string,
    public cpf: string,
    public senha?: string,
    public id?: string
  ) {}
}