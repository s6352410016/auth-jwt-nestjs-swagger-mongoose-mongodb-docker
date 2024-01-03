FROM node:20.9.0-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm i 

COPY . . 

EXPOSE 8080

CMD ["npm", "run" , "start:dev"]