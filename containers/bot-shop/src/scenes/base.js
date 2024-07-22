const Scene = require('telegraf/scenes/base');
const I18n = require('telegraf-i18n');

const { startFn } = require('../utils');

const baseScene = new Scene('base');

baseScene.enter(startFn);

baseScene.hears(
  I18n.match('menu.admin'),
  ctx => ctx.state.isAdmin && ctx.scene.enter('admin')
);

baseScene.hears(
  I18n.match('menu.catalog'), 
  async (ctx) => {

    if (!ctx.state.bot.SHOP.ITEMS.length) {
      await ctx.reply(ctx.i18n.t('base.catalogIsEmpty'));
      return ctx.reply('/start')
    }

    for (const item of ctx.state.bot.SHOP.ITEMS) {
      await ctx.replyWithPhoto(item.PICTURE_ID || item.PICTURE, {
        caption: item.NAME,
      });

      await ctx.reply(ctx.i18n.t('base.itemDescription', {
        description: item.DESCRIPTION,
        price: item.PRICE
      }));
  
      // todo: add inline ability to add to busket and buy now
    }

    return ctx.reply('/start');
  }
);

baseScene.hears(
  I18n.match('menu.order'),
  async (ctx) => {
    if (!ctx.state.bot.SHOP.ITEMS.length) {
      await ctx.reply(ctx.i18n.t('base.nothingToOrder'));
      return ctx.reply('/start');
    }

    return ctx.scene.enter('newOrder');
  }
);

baseScene.hears(
  I18n.match('menu.about'),
  async ctx => {
    await ctx.reply(ctx.state.bot.SHOP.PAGES.ABOUT);
    return ctx.reply('/start');
  }
);

module.exports = baseScene;
