FROM node:14-alpine

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

LABEL org.opencontainers.image.source="https://github.com/MitsyBot/Api"
