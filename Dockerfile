FROM node:12.16.0
WORKDIR /server

COPY package.json /server
COPY package-lock.json /server

RUN npm install

COPY . /server
CMD npm start
EXPOSE 3000