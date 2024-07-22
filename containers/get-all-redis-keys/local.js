const app = require('./app');

(async () => {
  await app.lambdaHandler();
  return;
})();
