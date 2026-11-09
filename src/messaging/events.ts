import Redis from 'ioredis';
import { redis } from '../cache/cache';

const IS_TEST = !!process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'test';

/** Canais (topicos) de eventos do dominio. */
export const CANAIS = {
  JOGO_CRIADO: 'eventos:jogo-criado',
  JOGO_ATUALIZADO: 'eventos:jogo-atualizado',
  JOGO_REMOVIDO: 'eventos:jogo-removido',
  COMPRA_REALIZADA: 'eventos:compra-realizada',
};

/**
 * Publica um evento num canal (Redis Pub/Sub). Usa a conexao do cache como publisher.
 * Mensageria e best-effort: se o Redis estiver fora, nao derruba a requisicao.
 */
export async function publicarEvento(canal: string, dados: Record<string, unknown>): Promise<void> {
  if (IS_TEST) return;
  try {
    const mensagem = JSON.stringify({ ...dados, publicadoEm: new Date().toISOString() });
    await redis.publish(canal, mensagem);
    console.log(`[eventos] PUBLICADO ${canal} -> ${mensagem}`);
  } catch (e: any) {
    console.warn('[eventos] falha ao publicar:', e?.message);
  }
}

/**
 * Inicia o consumidor (subscriber) que escuta os canais e loga cada mensagem recebida.
 * O subscriber precisa de uma conexao dedicada (ioredis entra em modo "subscribe").
 */
export function iniciarConsumidorDeEventos(): void {
  if (IS_TEST) return;

  const subscriber = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    retryStrategy: (times) => Math.min(times * 500, 3000),
  });

  const canais = Object.values(CANAIS);

  // ioredis reassina os canais sozinho apos uma reconexao
  subscriber.subscribe(...canais, (err, count) => {
    if (err) {
      console.warn('[eventos] falha ao assinar canais:', err.message);
      return;
    }
    console.log(`[eventos] consumidor ativo, assinando ${count} canais`);
  });

  subscriber.on('message', (canal, mensagem) => {
    console.log(`[eventos] RECEBIDO  ${canal} <- ${mensagem}`);
    // Aqui daria para reagir ao evento (enviar email, atualizar um relatorio, etc.)
  });

  subscriber.on('error', () => {
    // silencioso: o retryStrategy reconecta sozinho
  });
}
