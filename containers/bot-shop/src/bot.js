global.dedent = require('dedent-js');

const { Telegraf, Stage } = require('telegraf');
const RedisSession = require('telegraf-session-redis')
const I18n = require('telegraf-i18n');
const path = require('path');

const adminScene = require('./scenes/admin');
const newOrderScene = require('./scenes/newOrder');
const baseScene = require('./scenes/base');

const config = require('../config');
const db = require('./db');

const i18n = new I18n({
  defaultLanguage: 'en',
  defaultLanguageOnMissing: true,
  directory: path.resolve(__dirname, 'locales'),
  useSession: true,
});

const session = new RedisSession({
  store: {
    host: config.redisHost,
    port: config.redisPort,
    connect_timeout: 5000
  },
  getSessionKey: ctx => {
    if (!ctx.from || !ctx.chat) {
      return;
    }
    return `BotShop:${ctx.state.bot.BOT_USERNAME}:${ctx.from.id}:${ctx.chat.id}`
  }
});

const stage = new Stage([newOrderScene, adminScene, baseScene]);

const botBehavior = (bot) => {

  bot.use(async (ctx, next) => {
    try {
      ctx.state.bot = await db.getBotByToken(ctx.tg.token);
    }
    catch (err) {
      console.error("Cannot get shop settings by bot token");
    }

    ctx.state.isAdmin = false;
    if (ctx.from.id === ctx.state.bot.BOT_OWNER_ID) {
      ctx.state.isAdmin = true;
    }

    return next();
  });

  bot.use(async (ctx, next) => {
    try {
      // todo: perfomance issue? make request to Telgfram on each request
      const bot = await ctx.telegram.getMe();
      await db.trackUser(bot.id, ctx.from.id, ctx.from, false);
    }
    catch (err) {
      console.log('Error while tracking user');
      console.error(err);
    }

    return next();
  })

  bot.use(session);
  bot.use(i18n.middleware(), (ctx, next) => {
    // set bot language
    ctx.i18n.locale(ctx.state.bot.SHOP.SETTINGS.LANGUAGE.toLowerCase());
    return next();
  });
  bot.use(stage.middleware());

  bot.start((ctx) => ctx.scene.enter('base'));

  // it happens if I flusdh redis db
  bot.on('text', (ctx) => {
    if (!ctx.scene.current) {
      ctx.scene.enter('base')
    }
  });

  bot.catch((err) => {
    console.error(err);
  });

  return bot;
}

const botConstructor = async (botId, botMode) => {
  let bot;

  if (botMode === 'webhook') {

    try {
      const botSettings = await db.getBotByUniqueID(botId);

      if (!botSettings || !botSettings.BOT_TOKEN) {
        throw Error('Bot is not registered in the system, UNIQUE_ID - ' + botId);
      }
  
      bot = new Telegraf(botSettings.BOT_TOKEN, {
        telegram: { webhookReply: false },
      });
    }
    catch (err) {
      console.error(err);
    }
    
    // make an API Gateway before, this is async promise
    // bot.telegram.setWebhook(config.webHookUrl);

  } else if (botMode === 'pooling') {
    // here is bot unique id using like bot token for local debug
    const botToken = botId;

    // wait for the connection to MongoDB :)
    setTimeout(async () => {
      try {
        botSettings = await db.getBotByToken(botToken);
      }
      catch (err) {
        console.error('getBotByToken is failed');
      }
    }, 1000);
    
    bot = new Telegraf(botToken);
  }

  return botBehavior(bot);
};

module.exports = botConstructor;
