FROM node:13-alpine

# Create app directory
WORKDIR /usr/ScienceDbStarterPack/single-page-app

# Copy source code
COPY . .

# Clone the skeleton App project and install dependencies
RUN apk update && \
 apk add git && apk add bash && \
 rm -rf .git && \
 echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p \
 npm install

EXPOSE 8080