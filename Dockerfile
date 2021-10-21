FROM node:16-alpine

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

LABEL org.opencontainers.image.source="https://github.com/MitsyBot/Api"
