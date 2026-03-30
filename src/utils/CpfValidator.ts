export class CpfValidator {
  public static isValid(cpf: string): boolean {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) return false;
    
    let sum = 0;
    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf[i-1]) * (11 - i);
    let rev = (sum * 10) % 11;
    rev = (rev === 10 || rev === 11) ? 0 : rev;
    if (rev !== parseInt(cleanCpf[9])) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCpf[i-1]) * (12 - i);
    rev = (sum * 10) % 11;
    rev = (rev === 10 || rev === 11) ? 0 : rev;
    return rev === parseInt(cleanCpf[10]);
  }
}