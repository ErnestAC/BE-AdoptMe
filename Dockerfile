FROM node:20.11.0
WORKDIR /
COPY package*.json ./
RUN npm install
COPY ./src ./src
EXPOSE 9989
CMD ["npm","start"]