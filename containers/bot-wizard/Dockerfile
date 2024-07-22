FROM node:12-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json /app/

RUN npm ci

ENV NODE_ENV production

COPY . /app

EXPOSE 3100

CMD [ "npm", "start" ]
