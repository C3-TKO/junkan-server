FROM node:alpine

RUN npm install nodemon -g

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# junkan renderer source
COPY . . 

EXPOSE 3000

