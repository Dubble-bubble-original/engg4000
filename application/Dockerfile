FROM node:14.17.0-alpine as build

# Build args
ARG SERVICE_URL
ARG API_KEY

# Environment vars
ENV REACT_APP_SERVICE_URL=$SERVICE_URL
ENV REACT_APP_MAPS_API_KEY=$API_KEY

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

