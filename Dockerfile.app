FROM node:11.12.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy source code
COPY . .

# Clone the skeleton App project and install dependencies
RUN apk update && \
 apk add git && apk add bash

EXPOSE 8080
