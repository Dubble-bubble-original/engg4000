FROM node:14.17.0-alpine as alpine

RUN apt-get install -y python build-essential
RUN . $HOME/.nvm/nvm.sh && cd / && npm install @tensorflow/tfjs @tensorflow/tfjs-node

WORKDIR /app

COPY package.json .
RUN npm install --no-optional -f
RUN npm install pm2 -g
COPY . .

EXPOSE 3001

CMD ["pm2-runtime", "app.js"]
