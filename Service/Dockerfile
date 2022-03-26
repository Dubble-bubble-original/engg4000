FROM node:14.17.0-alpine as alpine

RUN apk update
RUN apk install libc6-compat

WORKDIR /app

COPY package.json .
RUN npm install pm2 -g
RUN npm install @tensorflow/tfjs-node -g
RUN npm i python2 -g
RUN npm install --no-optional -f
COPY . .

EXPOSE 3001

CMD ["pm2-runtime", "app.js"]
