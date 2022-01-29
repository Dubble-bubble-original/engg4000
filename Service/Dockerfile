FROM node:14.17.0-alpine as alpine

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .

EXPOSE 3001

CMD ["pm2","start","app.js"]
