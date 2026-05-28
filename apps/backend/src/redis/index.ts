import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

function createRedisClient(name: string) {
  const client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 10) {
        console.error(`[Redis:${name}] giving up after 10 retries`);
        return null; 
      }
      return Math.min(times * 200, 3_000);
    },
    autoResubscribe: true,
    keepAlive: 60_000,
  });

  client.on('error', (err) => console.error(`[Redis:${name}]`, err.message));
  client.on('connect', () => console.log(`[Redis:${name}] connected`));

  return client;
}

export const redis    = createRedisClient('main');
export const redisPub = createRedisClient('pub');
export const redisSub = createRedisClient('sub');
