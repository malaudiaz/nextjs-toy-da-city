// lib/redis.ts
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL, // Ej: redis://127.0.0.1:6379
});

client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect();

export default client;