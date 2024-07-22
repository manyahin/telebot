global.dedent = require('dedent-js');

const path = require('path');
const { Telegraf } = require('telegraf');
const I18n = require('telegraf-i18n');
const { Stage } = Telegraf;
const RedisSession = require('telegraf-session-redis')

const config = require('../config');
const newBotWizardScene = require('./scenes/newBot');
const baseScene = require('./scenes/base');
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
    // bug: ${ctx.me} is undefined here, dunno why
    // not relevant because of single bot wizard
    // i guess because of webhook, and bot never ask .me() method
    return `BotWizard:${ctx.from.id}:${ctx.chat.id}`
  }
});

const stage = new Stage([baseScene, newBotWizardScene]);

const botConstructor = (botToken, botMode) => {
  let bot;

  if (botMode === 'webhook') {
    bot = new Telegraf(botToken, {
      telegram: { webhookReply: false },
    });

  } else if (botMode === 'pooling') {
    bot = new Telegraf(botToken);
  }

  bot.use(async (ctx, next) => {
    try {
      // todo: perfomance issue? make request to Telgfram on each request
      const bot = await ctx.telegram.getMe();
      await db.trackUser(bot.id, ctx.from.id, ctx.from, true);
    }
    catch (err) {
      console.log('Error while tracking user');
      console.error(err);
    }

    return next();
  })

  bot.use(session);
  bot.use(i18n.middleware());
  bot.use(stage.middleware());

  bot.start((ctx) => ctx.scene.enter('baseScene'));

  // it happens if I flusdh redis db
  bot.on('text', (ctx) => {
    if (!ctx.scene.current) {
      ctx.scene.enter('baseScene')
    }
  });

  bot.catch(console.error);

  return bot;
};

module.exports = botConstructor;
