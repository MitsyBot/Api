FROM node:16-alpine as builder

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

RUN apt-get update && \
    apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

ENV TZ="America/Sao_Paulo"

RUN apk update && apk upgrade
RUN apk add git

COPY . /usr/src/api/
RUN npm install

FROM node:16-alpine as runner
WORKDIR /usr/src/api
COPY --from=builder /usr/src/api /usr/src/api
EXPOSE 1234

CMD ["npm", "run", "start"]
