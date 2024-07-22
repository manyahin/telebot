const Markup = require('telegraf/markup');

const db = require('../../db');

module.exports = async (ctx, next) => {
  if (ctx.scene.state.action === 'changeName') {

    const shopName = (ctx.message && ctx.message.text) || '';

    if (shopName.length < 1 || shopName.length > 128) {
      return ctx.reply(ctx.i18n.t('admin.changeName.maxLength'));
    }

    try {
      await db.updateShopName(ctx.state.bot.BOT_ID, shopName);
    }
    catch (err) {
      console.error(err);
      return ctx.reply(ctx.i18n.t('unknownError'));
    }

    // todo: pagination
    await ctx.reply(
      ctx.i18n.t('admin.changeName.success'),
      Markup.inlineKeyboard([
        Markup.callbackButton(ctx.i18n.t('keyboard.backToAdminPanel'), `selectShop`)
      ]).extra()
    );

    delete(ctx.scene.state.action);

    return;
  }

  return next();
}
