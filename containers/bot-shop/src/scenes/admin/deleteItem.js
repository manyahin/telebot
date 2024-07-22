const Markup = require('telegraf/markup');

const db = require('../../db');
const { manageItems } = require('./functions');

module.exports = async (ctx, next) => {

  switch (ctx.scene.state.action) {
    case 'deleteItem:1':
      ctx.scene.state.itemId = parseInt((ctx.message && ctx.message.text) || '');

      if (!ctx.scene.state.itemId) {
        await ctx.reply(ctx.i18n.t('admin.deleteItem.idInvalid'));
        break;
      }

      ctx.scene.state.item = ctx.state.bot.SHOP.ITEMS[ctx.scene.state.itemId - 1];

      if (!ctx.scene.state.item) {
        await ctx.reply(ctx.i18n.t('admin.deleteItem.idNotExists', {
          itemId: ctx.scene.state.itemId
        }));
        break;
      }

      ctx.scene.state.action = 'deleteItem:2';

      await ctx.replyWithMarkdownV2(
        ctx.i18n.t('admin.deleteItem.areYouSure', {
          itemName: ctx.scene.state.item.NAME
        }),
        Markup.keyboard([
          Markup.button(ctx.i18n.t('keyboard.yes')),
          Markup.button(ctx.i18n.t('keyboard.no'))
        ]).resize(true).extra()
      );

      break;

    case 'deleteItem:2':

      const msg = (ctx.message && ctx.message.text) || '';

      if (msg === ctx.i18n.t('keyboard.no')) {
        await ctx.reply(
          ctx.i18n.t('admin.deleteItem.canceled'),
          Markup.keyboard([ctx.i18n.t('backString')]).resize(true).extra()
        );
        await manageItems(ctx);
        break;
      }
      else if (msg === ctx.i18n.t('keyboard.yes')) {
        ctx.state.bot.SHOP.ITEMS.splice(ctx.scene.state.itemId - 1, 1);

        try {
          await db.updateItems(ctx.state.bot.BOT_ID, ctx.state.bot.SHOP.ITEMS);
        }
        catch (err) {
          console.error(ctx.i18n.t('admin.deleteItem.cannotDeleteItem'));
          await ctx.reply(ctx.i18n.t('unknownError'));
          break;
        }

        await ctx.reply(
          ctx.i18n.t('admin.deleteItem.itemDeleted'),
          Markup.keyboard([ctx.i18n.t('backString')]).resize(true).extra()
        );
  
        await ctx.reply(
          ctx.i18n.t('admin.whatToDo'),
          Markup.inlineKeyboard([
            Markup.callbackButton(ctx.i18n.t('keyboard.backToAdminPanel'), `selectShop`),
            Markup.callbackButton(ctx.i18n.t('keyboard.backToItemsPanel'), `manageItems`),
          ]).extra()
        );
  
        delete (ctx.scene.state.action);
  
        break;
      }
  }

  return next();
}
