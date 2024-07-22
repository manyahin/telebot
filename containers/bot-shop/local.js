const botConstructor = require('./src/bot');
const config = require('./config');
const pkg = require('./package.json');

(async () => {
  console.log(`Start Development Telebot ${pkg.name.toUpperCase()} in Pooling mode`);

  const bot = await botConstructor(config.devBotToken, 'pooling');

  bot.launch();
})();
