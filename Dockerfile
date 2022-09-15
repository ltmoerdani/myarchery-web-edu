FROM node:lts-alpine3.10

RUN apk update
RUN apk add git
RUN git config --global url."https://".insteadOf git://
RUN apk add --no-cache su-exec
RUN set -ex && apk --no-cache add sudo
RUN npm cache clean --force

CMD mkdir myarchery-web
WORKDIR myarchery-web
COPY . /myarchery-web
CMD mkdir log

#RUN addgroup -g 2000 -S docker
#RUN adduser -S -G docker -u 2001 -s /bin/sh -h myarchery-web docker

RUN npm rebuild node-sass

#RUN npm uninstall node-sass --force
#RUN npm i sass --legacy-peer-deps

RUN npm i react-scripts --force #--legacy-peer-deps
RUN npm install -g npm@8.5.5

RUN npm install --legacy-peer-deps #--force
#RUN yarn add node-sass
#RUN npm audit fix --force
RUN npm i caniuse-lite --legacy-peer-deps
RUN npm run build #--threshold 10
RUN npm install -g serve

RUN rm -f .env

#CMD serve -s build
#CMD npm start >> /root/log/stdout.log 2>> /root/log/stderr.log

#USER docker
#RUN whoami
