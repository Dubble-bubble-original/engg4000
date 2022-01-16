FROM node:14.18.3-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-optional -f
COPY . .
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

