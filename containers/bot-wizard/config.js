module.exports = {
  botToken: process.env.botToken,
  
  devBotToken: '',

  // i didn't success to set BotShopWebHookURL from lambda envirnoments
  // filled after from event in lambda.handler
  botShopWebHookUrl: process.env.botShopWebHookUrl 
    ? process.env.botShopWebHookUrl 
    : 'https://telebot.ql2cz2e.manyahin.com/shop', 
  // stage webhook by default, but I guess its wrong, I dont want local dev make webhook to stage
  // it have be ngrok server started and wizard started with env of this ngrok url but it's complex

  redisHost: process.env.RedisClusterHost ? process.env.RedisClusterHost : '127.0.0.1',
  redisPort: process.env.RedisClusterPort ? process.env.RedisClusterPort : 6379
};
