const botConstructor = require('./src/bot');
const pkg = require('./package.json');

exports.handler = async function (event, context) {
  try {
    console.log(`Start Production Telebot ${pkg.name.toUpperCase()} in WebHook mode`);

    console.log(`EVENT: \n${JSON.stringify(event, null, 2)}`);

    const botUniqueId = event.queryStringParameters && event.queryStringParameters.botUniqueId;
    if (!botUniqueId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify('UniqueID is missing'),
        isBase64Encoded: false
      };
    }

    const bot = await botConstructor(botUniqueId, 'webhook');

    const body = JSON.parse(event.body);

    await bot.handleUpdate(body);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify('done'),
      isBase64Encoded: false
    };

  } catch (err) {
    console.error(err);

    // todo: return doesn't work?
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(err.code),
      isBase64Encoded: false
    };
  }
};