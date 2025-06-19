import { RedisClientType, createClient } from 'redis';

const client: RedisClientType = createClient({
  url: 'redis://localhost:6379'
});

client.on('connect', () => {
  console.log("✅ Redis connected");
});

client.on('error', (err) => {
  console.error("❌ Redis connection error", err);
});

client.connect(); 

export default client;
