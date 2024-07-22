const redis = require("redis");

const client = redis.createClient({
  host: process.env.RedisClusterHost || '127.0.0.1',
  port: process.env.RedisClusterPort || 6379
});

const { promisify } = require("util");
const keysAsync = promisify(client.keys).bind(client);

exports.handler = async function (event, context) {

  client.on("error", function(error) {
    console.error(error);
  });
  
  await keysAsync('*').then(console.log).catch(console.error);

  return {
      statusCode: 200,
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify('done'),
      isBase64Encoded: false
    };
};