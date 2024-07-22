const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports = {
  addBot: async data => {
    const params = {
      ConditionExpression: 'attribute_not_exists(BOT_TOKEN)',
      TableName: 'BOT_LIST',
      Item: {
        'BOT_TOKEN': data.botToken,
        'UNIQUE_ID': data.botUniqueId,
        'CREATED_AT': new Date().toISOString(),
        'BOT_OWNER_USERNAME': data.botOwnerUsername,
        'BOT_OWNER_ID': data.botOwnerId,
        'BOT_ID': data.botId,
        'BOT_NAME': data.botName,
        'BOT_USERNAME': data.botUsername,
        'SHOP': {
          'SETTINGS': {
            'NAME': data.shopName,
            'DELIVERY': 'pickup',
            'DESCRIPTION': 'We sell everyhting that you need!',
            'LANGUAGE': 'EN',
            'CURRENCY': 'ILS'
          },
          'ITEMS': [
            {
              'NAME': 'Pizza',
              'DESCRIPTION': 'Very teasty',
              'PICTURE': 'https://us.123rf.com/450wm/gdolgikh/gdolgikh1812/gdolgikh181200131/113111188-pizza-with-salami-and-chorizo.jpg?ver=6',
              'PRICE': '20 ILS'
            },
            {
              'NAME': 'Second Pizza',
              'DESCRIPTION': 'Much more teasty',
              'PICTURE': 'https://img03.rl0.ru/eda/1200x-i/s1.eda.ru/StaticContent/Photos/150307165038/150313185550/p_O.jpg', 
              'PRICE': '20 ILS'
            }
          ],
          'PAGES': {
            'ABOUT': 'We estableshed the shop in 2020 and do the best for our customers!'
          }
        }
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
  }
}
