FROM node:10

ARG db_var
ENV db=$db_var

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
RUN ls
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ] 
