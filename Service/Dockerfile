FROM node:14.17.0-alpine as alpine

WORKDIR /app

COPY package.json .
RUN npm install
RUN npm install pm2 -g
COPY . .

EXPOSE 3001

CMD ["pm2-runtime", "app.js"]
