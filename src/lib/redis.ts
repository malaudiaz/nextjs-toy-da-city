// lib/redis.ts
import { createClient, type RedisClientType } from 'redis';

// Definimos un tipo más genérico
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RedisClient = RedisClientType<any, any>;

let client: RedisClient | null = null;
let connecting: Promise<RedisClient> | null = null;

export async function getRedisClient(): Promise<RedisClient> {
  if (client) return client;
  if (connecting) return connecting;

  if (process.env.NEXT_PHASE === 'phase-production-build') {
    throw new Error('Redis is not available during build time.');
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error('REDIS_URL is not defined');
  }

  const newClient = createClient({ url: redisUrl }) as RedisClient;

  newClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  connecting = newClient.connect();

  connecting
    .then(() => {
      client = newClient;
      connecting = null;
    })
    .catch((err) => {
      connecting = null;
      console.error('Failed to connect to Redis', err);
      throw err;
    });

  return connecting;
}