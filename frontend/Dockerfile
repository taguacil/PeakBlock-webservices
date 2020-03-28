# Will be used in production

FROM node:alpine

ARG api_url
ENV REACT_APP_API_URL=$api_url

WORKDIR '/usr/src/app'

COPY package.json .
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
