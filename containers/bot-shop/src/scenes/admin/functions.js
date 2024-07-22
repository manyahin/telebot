const Markup = require('telegraf/markup');

const config = require('../../../config');

module.exports = {
  selectShop: async (ctx) => {
    const text = ctx.i18n.t('admin.youSelectedShop', {
      shopName: ctx.state.bot.SHOP.SETTINGS.NAME,
      botUsername: ctx.state.bot.BOT_USERNAME
    });

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.callbackButton(ctx.i18n.t('keyboard.changeName'), `changeName`),
        Markup.callbackButton(ctx.i18n.t('keyboard.manageItems'), `manageItems`)
      ],
      [
        Markup.callbackButton(ctx.i18n.t('keyboard.managePages'), `managePages`)
      ]
    ]).extra();

    if (ctx.updateType === 'callback_query') {
      await ctx.editMessageText(text, keyboard);
    }
    else {
      await ctx.reply(
        ctx.i18n.t('admin.welcome'),
        Markup.keyboard([ctx.i18n.t('backString')]).resize(true).extra()
      );
      await ctx.reply(text, keyboard);
    }

    return;
  },
  manageItems: async (ctx) => {
    const text = ctx.i18n.t('admin.manageItems.welcome', {
      itemsCount: ctx.state.bot.SHOP.ITEMS.length,
      freeItemsCount: config.freeItems
    });

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.callbackButton(ctx.i18n.t('keyboard.listItems'), `listItems`),
        Markup.callbackButton(ctx.i18n.t('keyboard.addItem'), `addItem`)
      ],
      [
        Markup.callbackButton(ctx.i18n.t('keyboard.deleteItem'), `deleteItem`),
        // Markup.callbackButton(ctx.i18n.t('keyboard.editItem'), `editItem`)
      ],
      [
        Markup.callbackButton(ctx.i18n.t('keyboard.backToAdminPanel'), `selectShop`),
      ]
    ]).extra({ parse_mode: 'MarkdownV2' })

    if (ctx.updateType === 'callback_query') {
      await ctx.editMessageText(text, keyboard);
    }
    else {
      await ctx.reply(text, keyboard);
    }

    return;
  },
  managePages: async (ctx) => {
    const text = ctx.i18n.t('admin.managePages.welcome');

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.callbackButton(ctx.i18n.t('keyboard.editAbout'), `editAbout`),
        Markup.callbackButton(ctx.i18n.t('keyboard.editDescription'), `editDescription`)
      ],
      [
        Markup.callbackButton(ctx.i18n.t('keyboard.backToAdminPanel'), `selectShop`),
      ]
    ]).extra();

    if (ctx.updateType === 'callback_query') {
      await ctx.editMessageText(text, keyboard);
    }
    else {
      await ctx.reply(text, keyboard);
    }

    return;
  }
}
