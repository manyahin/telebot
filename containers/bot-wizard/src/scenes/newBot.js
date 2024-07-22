const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const uuid = require('uuid');
const I18n = require('telegraf-i18n');

const db = require('../db');
const config = require('../../config');
const { getTelegramBotInfo, setTelegramBotWebHook } = require('../telegram');

const newBotWizardScene = new WizardScene('newBot',
  async ctx => {
    // check if user already has another bot
    const existShop = await db.getUserShopsByBotOwner(ctx.from.id);
    if (existShop.length > 0) {
      await ctx.reply(ctx.i18n.t('newBotScene.botsLimit'));
      return ctx.scene.enter('baseScene', {}, true);
    }

    await ctx.reply(
      ctx.i18n.t('newBotScene.whatIsShopName'),
      Markup.keyboard([ctx.i18n.t('keyboard.back')]).resize(true).extra()
    );
    return ctx.wizard.next();
  },
  async ctx => {
    ctx.session.newBot = {};

    const shopName = (ctx.message && ctx.message.text) || '';
    const nameMaxLength = 128;

    if (shopName.length < 1 || shopName.length > nameMaxLength) {
      return ctx.reply(ctx.i18n.t('newBotScene.nameMaxLength', { maxLength: nameMaxLength }));
    }

    ctx.session.newBot.shopName = shopName;

    await ctx.reply(ctx.i18n.t('newBotScene.specifyToken'),
      Markup.inlineKeyboard([
        [
          Markup.urlButton(
            ctx.i18n.t('keyboard.detailedInstructions'),
            ctx.i18n.t('newBotScene.instructionUrl') 
          )
        ],
      ]).extra()
    );

    return ctx.wizard.next();
  },
  async ctx => {
    const token = (ctx.message && ctx.message.text) || '';

    const botInfo = await getTelegramBotInfo(token);

    if (!token || !botInfo) {
      return ctx.reply(ctx.i18n.t('newBotScene.tokenIncorrect'));
    }

    const botUniqueId = uuid.v4();

    ctx.session.newBot.botToken = token;
    ctx.session.newBot.botUniqueId = botUniqueId;

    ctx.session.newBot.botOwnerUsername = ctx.from.username;
    ctx.session.newBot.botOwnerId = ctx.from.id;

    ctx.session.newBot.botId = botInfo.id;
    ctx.session.newBot.botName = botInfo.first_name;
    ctx.session.newBot.botUsername = botInfo.username;

    ctx.session.newBot.lang = ctx.i18n.locale();

    try {
      if (await db.isBotTokenExists(token)) {
        return ctx.reply(ctx.i18n.t('newBotScene.tokenInUse'));
      }

      // this take time, i can make it async hm...
      await setTelegramBotWebHook(token, botUniqueId, config.botShopWebHookUrl);

      await db.addBot(ctx.session.newBot);
    }
    catch (err) {
      console.error(err);
      return ctx.reply(ctx.i18n.t('newBotScene.unknownError'));
    }

    await ctx.reply(ctx.i18n.t('newBotScene.shopCreated', { 
      shopName: ctx.session.newBot.shopName 
    }));
    
    await ctx.reply(ctx.i18n.t('newBotScene.openAndPlay', { 
      botUsername: ctx.session.newBot.botUsername
    }));

    await ctx.reply('/start', Markup.removeKeyboard().extra());

    return ctx.scene.enter('baseScene', {}, true);
  }
);

newBotWizardScene.hears(
  I18n.match('keyboard.back'),
  ctx => ctx.scene.enter('baseScene')
);

module.exports = newBotWizardScene;