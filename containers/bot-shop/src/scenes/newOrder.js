const { Markup } = require('telegraf');
const WizardScene = require('telegraf/scenes/wizard');

const newOrderWizardScene = new WizardScene('newOrder',
  async ctx => {

    const itemsToOrder = ctx.state.bot.SHOP.ITEMS.map(item => item.NAME);
    itemsToOrder.push(ctx.i18n.t('keyboard.cancelOrder'));

    await ctx.reply(ctx.i18n.t('newOrder.whichItem'),
      Markup.keyboard(itemsToOrder).resize(true).extra()
    );

    return ctx.wizard.next();
  },
  async ctx => {
    ctx.scene.state.newOrder = {};

    const msg = (ctx.message && ctx.message.text) || '';

    if (msg === ctx.i18n.t('keyboard.cancelOrder')) {
      await ctx.reply(ctx.i18n.t('newOrder.orderCanceled'));
      return ctx.scene.enter('base');
    }

    ctx.scene.state.newOrder.itemName = msg;

    dedent`⭐️ Your order: ${ctx.scene.state.newOrder.itemName}`,

    await ctx.reply(
      ctx.i18n.t('newOrder.yourOrder', {
        itemName: ctx.scene.state.newOrder.itemName
      }),
      Markup.keyboard([
        ctx.i18n.t('keyboard.approveOrder'),
        ctx.i18n.t('keyboard.cancelOrder')
      ]).resize(true).extra(),
    );

    return ctx.wizard.next();
  },
  async ctx => {

    const msg = (ctx.message && ctx.message.text) || '';
    
    if (msg === ctx.i18n.t('keyboard.cancelOrder')) {
      await ctx.reply(ctx.i18n.t('newOrder.orderCanceled'));
      return ctx.scene.enter('base');
    }

    await ctx.telegram.sendMessage(ctx.state.bot.BOT_OWNER_ID,
      ctx.i18n.t('newOrder.newOrder', {
        username: ctx.update.message.from.username,
        itemName: ctx.scene.state.newOrder.itemName
      })
    );

    await ctx.reply(ctx.i18n.t('newOrder.orderReceived'));

    await ctx.reply('/start')

    return ctx.scene.enter('base', {}, true);
  }
);

module.exports = newOrderWizardScene