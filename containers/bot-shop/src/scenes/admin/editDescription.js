const Markup = require('telegraf/markup');

const db = require('../../db');
const { maxTextLength } = require('../../../config');

module.exports = async (ctx, next) => {

  switch (ctx.scene.state.action) {
    case 'editDescription:1':

      const text = (ctx.message && ctx.message.text) || '';

      if (text.length < 1 || text.length > maxTextLength) {
        return ctx.reply(ctx.i18n.t('admin.editDescription.maxLength', {
          maxTextLength: maxTextLength
        }));
      }

      try {
        await db.updateDescription(ctx.state.bot.BOT_ID, text);
      }
      catch (err) {
        console.error(ctx.i18n.t('admin.editDescription.cannotUpdate'));
        await ctx.reply(ctx.i18n.t('unknownError'));
        break;
      }

      delete(ctx.scene.state.action);
  
      await ctx.reply(
        ctx.i18n.t('admin.editDescription.textUpdated'),
        Markup.keyboard([ctx.i18n.t('backString')]).resize(true).extra()
      );

      await ctx.reply(
        ctx.i18n.t('admin.whatToDo'),
        Markup.inlineKeyboard([
          Markup.callbackButton(ctx.i18n.t('keyboard.backToAdminPanel'), `selectShop`),
          Markup.callbackButton(ctx.i18n.t('keyboard.backToPagesPanel'), `managePages`),
        ]).extra()
      );

      break;
  }

  return next();
}
