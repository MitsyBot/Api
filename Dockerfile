FROM node:16-alpine as builder

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apk update && apk upgrade
RUN apk add git

COPY . /usr/src/api/
RUN npm install

FROM node:16-alpine as runner
WORKDIR /usr/src/api
COPY --from=builder /usr/src/api /usr/src/api
EXPOSE 1234

CMD ["npm", "run", "start"]
