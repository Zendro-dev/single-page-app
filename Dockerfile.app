FROM node:11.12.0-alpine

# Create app directory
WORKDIR /usr/ScienceDbStarterPack/single-page-app

# Copy source code
COPY . .

# Clone the skeleton App project and install dependencies
RUN apk update && \
 apk add git && apk add bash && \
 rm .git* && \
 npm install

EXPOSE 8080
