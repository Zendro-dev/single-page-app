FROM node:9.2.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./package.json .

# Need to install git for some npm packages:
RUN apk update && apk add git && \ 
  npm install

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3333
# If you want to run this App outside docker-compose, use:
# CMD [ "npm", "run", "dev" ]
