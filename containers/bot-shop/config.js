module.exports = {
  devBotToken: '',

  redisHost: process.env.RedisClusterHost ? process.env.RedisClusterHost : '127.0.0.1',
  redisPort: process.env.RedisClusterPort ? process.env.RedisClusterPort : 6379,

  freeItems: 5,
  maxTextLength: 1024
};
