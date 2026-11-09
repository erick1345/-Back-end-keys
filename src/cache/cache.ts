import Redis from 'ioredis';

const HOST = process.env.REDIS_HOST || '127.0.0.1';
const PORT = Number(process.env.REDIS_PORT) || 6379;
const DEFAULT_TTL = Number(process.env.CACHE_TTL) || 60; // segundos

// Em testes (Jest) nao abrimos conexao: evita segurar o processo aberto.
const IS_TEST = !!process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'test';

export const redis = new Redis({
  host: HOST,
  port: PORT,
  maxRetriesPerRequest: 2,
  lazyConnect: IS_TEST,
  enableOfflineQueue: !IS_TEST,
  // reconecta sozinho sem travar a aplicacao se o Redis cair (resiliencia)
  retryStrategy: (times) => Math.min(times * 500, 3000),
});

let online = false;
redis.on('ready', () => {
  online = true;
  console.log(`[cache] Redis conectado em ${HOST}:${PORT}`);
});
redis.on('end', () => {
  online = false;
});
redis.on('error', (err) => {
  if (online) console.warn('[cache] Redis indisponivel:', err.message);
  online = false;
});

export function cacheOnline() {
  return online;
}

/** Cache-aside (leitura): retorna o valor do cache, ou null se nao houver (ou Redis fora). */
export async function cacheGet<T = any>(key: string): Promise<T | null> {
  if (!online) return null;
  try {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Grava no cache com expiracao (TTL em segundos). */
export async function cacheSet(key: string, value: unknown, ttl = DEFAULT_TTL): Promise<void> {
  if (!online) return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } catch {
    /* cache e opcional: nunca derruba a requisicao */
  }
}

/** Invalidacao: remove todas as chaves que batem com o padrao (ex.: "jogos:*"). */
export async function cacheInvalidate(pattern: string): Promise<number> {
  if (!online) return 0;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
    return keys.length;
  } catch {
    return 0;
  }
}
