require('colors'); // "string".bgRed

const botConstructor = require('./src/bot');
const config = require('./config');
const pkg = require('./package.json');

console.log(`Start Development Telebot ${pkg.name.toUpperCase()} in Pooling mode`);

const bot = botConstructor(config.devBotToken, 'pooling');

bot.launch();
