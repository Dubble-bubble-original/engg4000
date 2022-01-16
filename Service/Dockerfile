FROM node:14.18.3-alpine AS alpine

WORKDIR /app

COPY package.json .
RUN npm install --no-optional -f
COPY . .

EXPOSE 3001

CMD ["npm","run","start"]
