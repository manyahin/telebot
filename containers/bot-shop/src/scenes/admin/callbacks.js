const Markup = require('telegraf/markup');

const { selectShop, manageItems, managePages } = require('./functions');
const config = require('../../../config');

module.exports = {
  adminCallbacks: async (ctx, next) => {

    // todo: rename value to botId? use uniqueId? use shop_Id ?
    const action = ctx.callbackQuery.data;

    switch (action) {
      case 'selectShop':
        await selectShop(ctx);
        break;
      case 'changeName':
        await ctx.answerCbQuery(ctx.i18n.t('admin.changeName.newShopName'));
        await ctx.reply(
          ctx.i18n.t('admin.changeName.newShopName'), 
          Markup.keyboard([ctx.i18n.t('backString')]).resize(true).extra()
        )

        ctx.scene.state.action = 'changeName';

        break;
      case 'manageItems':
        await manageItems(ctx);
        break;
      case 'listItems':

        if (!ctx.state.bot.SHOP.ITEMS.length) {
          await ctx.reply(ctx.i18n.t('admin.listItems.noItems'));
        }

        // todo: pagination by 10 items
        for (const [index, item] of ctx.state.bot.SHOP.ITEMS.entries()) {
          // todo: remove PICTURE, rename to PICTURE_URL ?
          await ctx.replyWithPhoto(item.PICTURE_ID || item.PICTURE, { caption: `${index + 1}: ${item.NAME}` });
          await ctx.reply(ctx.i18n.t('base.itemDescription', {
            description: item.DESCRIPTION,
            price: item.PRICE
          }));
        }

        await ctx.reply(ctx.i18n.t('admin.whatToDo'), Markup.inlineKeyboard([
          Markup.callbackButton(ctx.i18n.t('keyboard.backToAdminPanel'), `selectShop`),
          Markup.callbackButton(ctx.i18n.t('keyboard.backToItemsPanel'), `manageItems`),
        ]).extra());

        break;
      case 'addItem':

        if (ctx.state.bot.SHOP.ITEMS.length >= config.freeItems) {
          await ctx.reply(ctx.i18n.t('admin.addItem.limit', {
            freeItems: config.freeItems
          }));
          break;
        }

        await ctx.answerCbQuery(ctx.i18n.t('admin.addItem.itemName'));
        await ctx.reply(
          ctx.i18n.t('admin.addItem.itemName'),
          Markup.keyboard([ctx.i18n.t('backString')]).resize(true).extra()
        );

        ctx.scene.state.newItem = {};
        ctx.scene.state.action = 'addItem:1';

        break;
      case 'deleteItem':
        let msg = ctx.i18n.t('admin.deleteItem.idToDelete');

        for (const [index, item] of ctx.state.bot.SHOP.ITEMS.entries()) {
          msg += `${index + 1}: ${item.NAME}\n`;
        }

        ctx.scene.state.action = 'deleteItem:1';

        await ctx.reply(msg);

        break;
      case 'managePages':
        await managePages(ctx);
        break;
      case 'editAbout':
        await ctx.answerCbQuery(ctx.i18n.t('admin.editAbout.newText'));
        await ctx.reply(
          ctx.i18n.t('admin.editAbout.newText'),
          Markup.keyboard([ctx.i18n.t('backString')]).resize(true).extra()
        );

        ctx.scene.state.action = 'editAbout:1';

        break;
      case 'editDescription':
        await ctx.answerCbQuery(ctx.i18n.t('admin.editDescription.newText'));
        await ctx.reply(
          ctx.i18n.t('admin.editDescription.newText'),
          Markup.keyboard([ctx.i18n.t('backString')]).resize(true).extra()
        );

        ctx.scene.state.action = 'editDescription:1';

        break;
    }

    return;
  }
}