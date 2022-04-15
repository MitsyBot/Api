FROM node:16-alpine as builder

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

RUN apk add --no-cache tzdata && cp -r -f /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

RUN apk update && apk upgrade
RUN apk add git

COPY . /usr/src/api/
RUN npm install

FROM node:16-alpine as runner
WORKDIR /usr/src/api
COPY --from=builder /usr/src/api /usr/src/api
EXPOSE 1234

CMD ["npm", "run", "start"]
