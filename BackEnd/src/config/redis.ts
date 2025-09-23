import { RedisClientType, createClient } from "redis";

const redisClient: RedisClientType = createClient({
  url: "redis://localhost:6379",
  socket: {
    connectTimeout: 10000,
  },
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error", err);
});

redisClient.connect();

export default redisClient;
