/**
 * Logger simples e padronizado (nivel + timestamp + contexto),
 * para deixar os fluxos claros nos logs.
 */
type Nivel = 'info' | 'warn' | 'error';

function escrever(nivel: Nivel, contexto: string, mensagem: string, extra?: unknown) {
  const ts = new Date().toISOString();
  const linha = `${ts} [${nivel.toUpperCase()}] (${contexto}) ${mensagem}`;
  const args = extra === undefined ? [linha] : [linha, extra];

  if (nivel === 'error') console.error(...args);
  else if (nivel === 'warn') console.warn(...args);
  else console.log(...args);
}

export const logger = {
  info: (contexto: string, mensagem: string, extra?: unknown) => escrever('info', contexto, mensagem, extra),
  warn: (contexto: string, mensagem: string, extra?: unknown) => escrever('warn', contexto, mensagem, extra),
  error: (contexto: string, mensagem: string, extra?: unknown) => escrever('error', contexto, mensagem, extra),
};
