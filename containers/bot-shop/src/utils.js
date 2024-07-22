const Markup = require('telegraf/markup');

const startFn = async (ctx, next) => {
  let menu = [
    ctx.i18n.t('menu.catalog'), 
    ctx.i18n.t('menu.order'),
    ctx.i18n.t('menu.about'),
  ];

  if (ctx.state.isAdmin) menu.push(ctx.i18n.t('menu.admin'));

  const mainMenuKeyboard = Markup.keyboard(menu).resize(true).extra();

  await ctx.reply(
    ctx.i18n.t('welcome', {shopName: ctx.state.bot.SHOP.SETTINGS.NAME}), 
    mainMenuKeyboard);

  if (ctx.state.bot.SHOP.SETTINGS.DESCRIPTION) {
    await ctx.reply(ctx.state.bot.SHOP.SETTINGS.DESCRIPTION);
  }

  // todo: hide if paid account
  if (true) {
    await ctx.replyWithMarkdownV2(ctx.i18n.t('botMadeBy'));
  }

  return;
}

module.exports = {
  startFn
}
