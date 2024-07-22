FROM node:12-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json /app/

RUN npm ci

ENV NODE_ENV production

COPY . /app

EXPOSE 3101

CMD [ "npm", "start" ]
