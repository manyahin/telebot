const Markup = require('telegraf/markup');

const startFn = async ({reply, replyWithHTML, i18n}) => {
  await reply(i18n.t('start.welcome'));
  await reply(i18n.t('start.header'));
  await replyWithHTML(i18n.t('start.description'), 
    Markup.inlineKeyboard([
      [Markup.urlButton(
        i18n.t('keyboard.checkDemo'),
        i18n.t('demoLink')
      )],
    ]).extra()
  );

  return selectSection({i18n, reply});
};

const selectSection = ({i18n, reply}) => reply(
  i18n.t('start.selectSection'),
  Markup.keyboard(
    [
      [i18n.t('keyboard.createShop')], 
      [i18n.t('keyboard.help')],
      ['🇷🇺 Русский', '🇬🇧 English']
    ]
  ).resize(true).extra()
);

module.exports = {
  startFn,
  selectSection
}
