export interface IUser {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  senha?: string;
  nivel_acesso?: 'admin' | 'cliente';
}
