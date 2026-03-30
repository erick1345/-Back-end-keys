export class Validators {
  // Requisito: Validação de e-mail (regex) 
  public static isEmailValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Requisito: Validação de nível de senha (mínimo 8 caracteres e 1 número) 
  public static isPasswordStrong(password: string): boolean {
    return password.length >= 8 && /\d/.test(password);
  }
}