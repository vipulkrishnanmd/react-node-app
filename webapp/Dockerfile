FROM node:12.16.0 AS base
WORKDIR /client
COPY package.json /client
COPY package-lock.json /client
RUN npm install
COPY . /client
RUN npm run-script build

FROM node:12.16.0
WORKDIR /client
COPY --from=base /client /client
RUN yarn global add serve
CMD serve -s build
EXPOSE 5000