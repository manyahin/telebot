const express = require('express')
const bodyParser = require('body-parser')

const botConstructor = require('./src/bot');
const config = require('./config');
const pkg = require('./package.json');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const PORT = 3100;

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  return res.send('Use POST method');
});

app.post('/', async (req, res) => {
  console.log(`REQUEST: \n${JSON.stringify(req.body, null, 2)}`);

  const bot = botConstructor(config.botToken, 'webhook');

  await bot.handleUpdate(req.body);

  return res.send({ status: 'success' });
});

app.listen(PORT, () => {
  console.log(`Start Telebot ${pkg.name.toUpperCase()} in WebHook mode in ${process.env.NODE_ENV} env`);
  console.log(`Web Server listening on 0.0.0.0:${PORT}`)
});
