const Markup = require('telegraf/markup');
const db = require('../../db');
const { maxTextLength } = require('../../../config');

module.exports = async (ctx, next) => {

  switch (ctx.scene.state.action) {
    case 'addItem:1':
      const itemName = (ctx.message && ctx.message.text) || '';

      if (itemName.length < 1 || itemName.length > maxTextLength) {
        return ctx.reply(ctx.i18n.t('admin.addItem.maxLengthName', {
          maxTextLength: maxTextLength
        }));
      }
  
      ctx.scene.state.newItem.NAME = itemName;
      ctx.scene.state.action = 'addItem:2'
  
      await ctx.reply(ctx.i18n.t('admin.addItem.enterDescription'));
  
      break;
    case 'addItem:2':
      const itemDescription = (ctx.message && ctx.message.text) || '';

      if (itemDescription.length < 1 || itemDescription.length > maxTextLength) {
        return ctx.reply(ctx.i18n.t('admin.addItem.maxLengthDescription', {
          maxTextLength: maxTextLength
        }));
      }
  
      ctx.scene.state.newItem.DESCRIPTION = itemDescription;
      ctx.scene.state.action = 'addItem:3'
  
      await ctx.reply(ctx.i18n.t('admin.addItem.enterPrice'));
  
      break;
    case 'addItem:3':
      const itemPrice = (ctx.message && ctx.message.text) || '';

      // todo: price validation
  
      ctx.scene.state.newItem.PRICE = itemPrice;
      ctx.scene.state.action = 'addItem:4';
  
      await ctx.reply(ctx.i18n.t('admin.addItem.deployPicture'));
  
      break;
    case 'addItem:4':
      if (ctx.updateSubTypes[0] !== 'photo') {
        await ctx.reply(ctx.i18n.t('admin.addItem.sendOnlyPhoto'));
        return;
      }

      // todo: here is a 3 picture object returned from telegram in different resolutions, take the best
      ctx.scene.state.newItem.PICTURE_ID = ctx.message.photo.pop().file_id;

      try {
        await db.addItem(ctx.state.bot.BOT_ID, ctx.scene.state.newItem);
      }
      catch (err) {
        console.error(err);
        return ctx.reply(ctx.i18n.t('unknownError'));
      }

      delete(ctx.scene.state.action);

      await ctx.reply(
        ctx.i18n.t('admin.addItem.itemAdded'),
        Markup.inlineKeyboard([
          Markup.callbackButton(ctx.i18n.t('keyboard.backToAdminPanel'), `selectShop`),
          Markup.callbackButton(ctx.i18n.t('keyboard.backToItemsPanel'), `manageItems`),
        ]).extra()
      );

      return;
  }

  return next();
};
