const botConstructor = require('./src/bot');
const config = require('./config');
const pkg = require('./package.json');

exports.handler = async function (event, context) {
    try {
        console.log(`Start Production Telebot ${pkg.name.toUpperCase()} in WebHook mode`);

        console.log(`EVENT: \n${JSON.stringify(event, null, 2)}`);
        // console.log(`CONTEXT: \n${JSON.stringify(context, null, 2)}`);

        if (!event || !event.requestContext || event.requestContext.domainName) {
            return {
                statusCode: 502,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: 'error', message: 'This function must be runned via API Gateway' }),
                isBase64Encoded: false
            };
        }

        config.botShopWebHookUrl = 'https://' + event.requestContext.domainName + '/bot-shop';

        if (!event.body) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: 'error', message: 'Invalid request' }),
                isBase64Encoded: false
            };
        }

        const bot = botConstructor(config.botToken, 'webhook');

        await bot.handleUpdate(JSON.parse(event.body));

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: 'success' }),
            isBase64Encoded: false
        };

    } catch (err) {
        console.error(err);

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: 'error', message: 'System error' }),
            isBase64Encoded: false
        };
    }
};