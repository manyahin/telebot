var AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports = {
  addBot: async data => {
    var params = {
      ConditionExpression: 'attribute_not_exists(BOT_TOKEN)',
      TableName: 'BOT_LIST',
      Item: {
        'BOT_TOKEN': data.botToken,
        'CREATED_AT': new Date().toISOString(),
        'SHOP_NAME': data.shopName,
        'BOT_OWNER_USERNAME': data.botOwnerUsername,
        'BOT_OWNER_ID': data.botOwnerId,
        'BOT_ID': data.botId,
        'BOT_NAME': data.botName,
        'BOT_USERNAME': data.botUsername,
      }
    };
    
    try {
      await docClient.put(params).promise();
      return true;
    }
    catch (err) {
      console.error(err);
      return err.code;
    }
  },
  getBotByToken: async botToken => {
    var params = {
      TableName : 'BOT_LIST',
      Key: {
        BOT_TOKEN: botToken
      }
    };
    
    try {
      const res = await docClient.get(params).promise();

      if (res && res.Item)
        return res.Item;

      return false;
    }
    catch (err) {
      console.error(err);
      return err.code;
    }
  },
  getBotByUniqueID: async uniqueId => {
    var params = {
      TableName : 'BOT_LIST',
      IndexName: 'UNIQUE_ID_INDEX',
      KeyConditionExpression: "UNIQUE_ID = :v_uniqueId",
      ExpressionAttributeValues: {
        ":v_uniqueId": uniqueId
      },
      ProjectionExpression: "BOT_TOKEN, SHOP, BOT_OWNER_ID",
      ScanIndexForward: false
    };
    
    try {
      const res = await docClient.query(params).promise();
      
      if (res && res.Items.length > 0)
        return res.Items[0];

      return false;
    }
    catch (err) {
      console.error(err);
      return err.code;
    }
  }
}
