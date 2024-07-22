const Scene = require('telegraf/scenes/base');
const I18n = require('telegraf-i18n');

const { adminCallbacks } = require('./callbacks');
const { selectShop } = require('./functions');

const adminScene = new Scene('admin');

adminScene.enter(selectShop);

adminScene.hears(I18n.match('backString'), ctx => ctx.scene.enter('base'));

adminScene.on('callback_query', adminCallbacks);

adminScene.use(require('./newItem'));
adminScene.use(require('./changeName'));
adminScene.use(require('./deleteItem'));
adminScene.use(require('./editAbout'));
adminScene.use(require('./editDescription'));

module.exports = adminScene;
