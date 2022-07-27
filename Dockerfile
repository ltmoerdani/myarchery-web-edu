FROM node:lts-alpine3.10

CMD mkdir myarchery-web
WORKDIR myarchery-web
COPY . /myarchery-web
CMD mkdir log
RUN apk update
RUN apk add git
RUN git config --global url."https://".insteadOf git://
#RUN npm cache clean --force

RUN npm uninstall node-sass --force
RUN npm i sass --force #--legacy-peer-deps

RUN npm i react-scripts --force #--legacy-peer-deps
RUN npm install -g npm@8.5.5

RUN npm install --force #--legacy-peer-deps
RUN yarn add node-sass
#RUN npm audit fix --force
RUN npm run build #--threshold 10

RUN rm -f config/.env

CMD npm start >> /root/log/stdout.log 2>> /root/log/stderr.log

