FROM node:14.3.0-buster

# Create app directory
WORKDIR /usr/ScienceDbStarterPack/single-page-app

# Copy source code
COPY . .

# Clone the skeleton App project and install dependencies
RUN apk update && \
 apk add git && apk add bash && \
 npm install

EXPOSE 8080