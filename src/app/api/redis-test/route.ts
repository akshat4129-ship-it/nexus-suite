import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6381';
const redis = new Redis(redisUrl);

export async function GET() {
  try {
    await redis.set('nexus_health', 'optimal', 'EX', 60);
    const status = await redis.get('nexus_health');
    return new Response(JSON.stringify({ redis: status, status: 'connected' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message, status: 'failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
