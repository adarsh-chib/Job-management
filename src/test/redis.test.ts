import "dotenv/config";
import { redis } from "../configs/redis";

async function testRedis() {
  const random = await redis.set("test", "hello");
  console.log(random);
  const value = await redis.get("test");
  console.log(value);
}

testRedis();
