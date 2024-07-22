const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://mongo:27017';
const dbName = 'telebot';
const botListColl = 'bots';
const userListColl = 'users';

let telebotDb;
let botList;
let userList;

MongoClient.connect(url, {
  useUnifiedTopology: true
}, function (err, client) {
  if (err) throw err;

  console.log("Connected successfully to MongoDB");

  telebotDb = client.db(dbName);
  botList = telebotDb.collection(botListColl);
  userList = telebotDb.collection(userListColl);

  createIndexes();
  return;
});

const createIndexes = () => {
  botList.createIndex({ BOT_TOKEN: 1 }, (err, indexName) => {
    if (err) {
      console.log(`Error while createing an index "{BOT_TOKEN: 1}" for ${botListColl} collection`);
      console.error(err);
      return;
    }

    console.log(`Successfully created a new index "${indexName}" for "${botListColl}" collection`);
    return;
  });

  botList.createIndex({ UNIQUE_ID: 1 }, (err, indexName) => {
    if (err) {
      console.log(`Error while createing an index "{UNIQUE_ID: 1}" for ${botListColl} collection`);
      console.error(err);
      return;
    }

    console.log(`Successfully created a new index "${indexName}" for "${botListColl}" collection`);
    return;
  });

  botList.createIndex({ BOT_OWNER_ID: 1 }, (err, indexName) => {
    if (err) {
      console.log(`Error while createing an index "{BOT_OWNER_ID: 1}" for ${botListColl} collection`);
      console.error(err);
      return;
    }

    console.log(`Successfully created a new index "${indexName}" for "${botListColl}" collection`);
    return;
  });

  botList.createIndex({ BOT_ID: 1 }, (err, indexName) => {
    if (err) {
      console.log(`Error while createing an index "{BOT_ID: 1}" for ${botListColl} collection`);
      console.error(err);
      return;
    }

    console.log(`Successfully created a new index "${indexName}" for "${botListColl}" collection`);
    return;
  });

  userList.createIndex({ bot_id: 1, user_id: 1 }, (err, indexName) => {
    if (err) {
      console.log(`Error while createing an index "{bot_id: 1, user_id: 1}" for ${userListColl} collection`);
      console.error(err);
      return;
    }

    console.log(`Successfully created a new index "${indexName}" for "${userListColl}" collection`);
    return;
  });
}

module.exports = {
  getBotByToken: async botToken => {
    try {
      const params = { BOT_TOKEN: botToken };
      const obj = await botList.findOne(params);

      return obj;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  getBotByUniqueID: async uniqueId => {
    try {
      const params = { UNIQUE_ID: uniqueId };
      const obj = await botList.findOne(params);

      return obj;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  getUserShopsByBotOwner: async userId => {
    try {
      const params = { BOT_OWNER_ID: userId };
      const options = { projection: { BOT_ID: true, SHOP: true } };
      const res = await botList.find(params, options).toArray();

      return res;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  getShopSettingsByBotId: async botId => {
    try {
      const params = { BOT_ID: parseInt(botId) };
      const options = { projection: { BOT_ID: true, SHOP: true, BOT_USERNAME: true } };
      const res = await botList.findOne(params, options);

      return res;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  updateShopName: async (botId, shopName) => {
    try {
      const filter = { BOT_ID: parseInt(botId) };
      const params = { $set: { 'SHOP.SETTINGS.NAME': shopName } };
      const res = await botList.updateOne(filter, params);
      return res;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  addItem: async (botId, item) => {
    try {
      const filter = { BOT_ID: parseInt(botId) };
      const params = { $push: { 'SHOP.ITEMS': item } };
      const res = await botList.updateOne(filter, params);
      return res;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  updateItems: async (botId, items) => {
    try {
      const filter = { BOT_ID: parseInt(botId) };
      const params = { $set: { 'SHOP.ITEMS': items } };
      const res = await botList.updateOne(filter, params);
      return res;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  updateAbout: async (botId, text) => {
    try {
      const filter = { BOT_ID: parseInt(botId) };
      const params = { $set: { 'SHOP.PAGES.ABOUT': text } };
      const res = await botList.updateOne(filter, params);
      return res;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  updateDescription: async (botId, text) => {
    try {
      const filter = { BOT_ID: parseInt(botId) };
      const params = { $set: { 'SHOP.SETTINGS.DESCRIPTION': text } };
      const res = await botList.updateOne(filter, params);
      return res;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  },
  trackUser: async (botId, userId, data, isWizard = false) => {
    try {
      const filter = { bot_id: parseInt(botId), user_id: parseInt(userId) };

      const update = {
        $set: {
          first_name: data.first_name,
          last_name: data.last_name,
          username: '@' + data.username,
          language_code: data.language_code,
          last_massage: new Date(),
          is_wizard: isWizard
        },
        $setOnInsert: {
          first_message: new Date(),
        }
      };

      const options = {
        upsert: true
      };

      const res = await userList.updateOne(filter, update, options);
      return res;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  }
}
