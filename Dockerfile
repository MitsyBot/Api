FROM node:16-alpine as builder
LABEL org.opencontainers.image.source="https://github.com/MitsyBot/Api"

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

RUN apk update && apk upgrade
RUN apk add git

COPY . /usr/src/api/
RUN npm install

FROM node:16-alpine as runner
WORKDIR /usr/src/api
COPY --from=builder /usr/src/api /usr/src/api

CMD ["npm", "run", "start"]