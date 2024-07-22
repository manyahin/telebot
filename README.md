# Telebot

Telebot is a system that allows you to create and manage automated Telegram shops effortlessly.

This project is a demonstration of creating a Telegram bot ecosystem for e-commerce. While it's no longer in active development, it showcases interesting concepts in bot-driven commerce and serverless architectures.

## 🚀 Features

- **Wizard Bot**: A Telegram bot with a user-friendly UI that enables customers to create their own shops.
- **Shop Management**: Shop owners can easily add, edit, and delete items from their shops.
- **Serverless Architecture**: Part of the project is serverless and includes an example of AWS deployment.
- **Docker-based**: The entire project is containerized for easy deployment and scaling.

## 🏗 Project Structure

The project consists of several key components:

- `containers/`: Contains the core logic for different parts of the system:
  - `bot-wizard/`: The Telegram bot that creates other shops
  - `bot-shop/`: The managed service for shops
  - `web`: The website that serves internet pages
  - `support/`: The support system for managing tickets
  - `nginx/`: The Nginx configuration for routing requests
- `aws/`: Contains configurations for serverless deployment on AWS: VPC, Lambdas, API Gateway, DynamoDB, ElastiCache and etc.

## 💻 Technology Stack

- JavaScript (NodeJS)
- Docker
- Telegram Bot API
- AWS (Lambda, API Gateway, DynamoDB, ElastiCache)

## ⚠️ Project Status

This project was started as an exploration into automated Telegram shops but is currently not under active development. It serves as a proof of concept and may be a useful starting point for similar projects.

## 🚧 Getting Started

### Develop

    botShopWebHookUrl="https://ngrock.io" npm run dev:wizard

```bash
# npm i nodemon -g
$ nodemon containers/bot-wizard/local.js
# 
$ nodemon containers/bot-shop/local.js
```

### Deploy

#### Production

```bash
git pull origin master
docker-compose build
docker-compose stop
# docker-compose -f docker-compose.yml -f production.yml up
npm run prod:start
```

#### Staging

```bash
git pull origin stage
docker-compose build
docker-compose stop
# docker-compose -f docker-compose.yml -f production.yml -f stage.yml up
npm run stage:start
```

### WebHook URLs

    curl -d '{"url":"https://webhook.url"}' -H "Content-Type: application/json" -X POST https://api.telegram.org/bot<token>/setWebhook

    curl -X GET https://api.telegram.org/bot<token>/getWebhookInfo

    curl -X GET https://api.telegram.org/bot<token>/deleteWebhook

## 📝 License

MIT

## 👤 Author

Bot made by *Ilya Manyahin* 💜
