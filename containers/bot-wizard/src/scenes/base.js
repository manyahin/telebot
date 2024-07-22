const Scene = require('telegraf/scenes/base');
const I18n = require('telegraf-i18n');

const { startFn, selectSection } = require('../utils');

const baseScene = new Scene('baseScene');

baseScene.enter(startFn);

baseScene.hears(
  I18n.match('keyboard.createShop'),
  ctx => ctx.scene.enter('newBot')
);

baseScene.hears(
  I18n.match('keyboard.help'), 
  async ctx => {
    await ctx.replyWithHTML(ctx.i18n.t('helpSection'));
    return ctx.reply('/start');
  }
);

baseScene.hears(
  '🇷🇺 Русский',
  async ({i18n, reply}) => {
    i18n.locale('ru');
    await reply(i18n.t('languageTranslated'));
    await reply('/start');
    return selectSection({i18n, reply});
  }
);

baseScene.hears(
  '🇬🇧 English',
  async ({i18n, reply}) => {
    i18n.locale('en');
    await reply(i18n.t('languageTranslated'));
    await reply('/start');
    return selectSection({i18n, reply});
  }
);

module.exports = baseScene;
