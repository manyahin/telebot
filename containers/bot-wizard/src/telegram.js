const { Telegraf } = require('telegraf');

module.exports = {
  getTelegramBotInfo: async token => {
    try {
      const testBot = new Telegraf(token);
      const res = await testBot.telegram.getMe();
      return res;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  setTelegramBotWebHook: async (token, botId, webhookUrl) => {
    try {
      const bot = new Telegraf(token);
      await bot.telegram.setWebhook(webhookUrl + '?id=' + botId);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
