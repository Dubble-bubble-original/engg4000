FROM alpine:3.7

RUN apk add python2.7
RUN apk add py3-pip
RUN pip3 install https://github.com/better/alpine-tensorflow/releases/download/alpine3.7-tensorflow1.7.0/tensorflow-1.7.0-cp36-cp36m-linux_x86_64.whl

WORKDIR /app

COPY package.json .
RUN npm install --no-optional -f
RUN npm install pm2 -g
COPY . .

EXPOSE 3001

CMD ["pm2-runtime", "app.js"]
