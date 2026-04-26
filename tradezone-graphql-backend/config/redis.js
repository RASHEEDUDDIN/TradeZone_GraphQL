const { createClient } = require('redis');

let client;

if (process.env.REDIS_URL) {
  client = createClient({ url: process.env.REDIS_URL });

  client.on('error', (err) => {
    console.error('Redis Client Error (fails silently):', err.message);
  });

  client.connect()
    .then(() => console.log('Redis connected'))
    .catch((err) => console.error('Failed to connect to Redis:', err.message));
} else {
  console.log('Redis URL not configured, skipping connection');
}

const redisWrapper = {
  get: async (key) => {
    if (client && client.isReady) {
      return await client.get(key).catch(() => null);
    }
    return null;
  },
  setEx: async (key, seconds, value) => {
    if (client && client.isReady) {
      return await client.setEx(key, seconds, value).catch(() => null);
    }
    return null;
  },
  del: async (key) => {
    if (client && client.isReady) {
      return await client.del(key).catch(() => null);
    }
    return null;
  }
};

module.exports = redisWrapper;
