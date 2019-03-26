# Single Page App (skeleton)

> A Vue.js project

### Environment variables

* `MY_SERVER_URL` - url where your backend server will be running, default value is `http://localhost:3000/graphql`
* `MY_LOGIN_URL` - url where your backend will check authentication, default value is `http://localhost:3000/login`.
* `MAX_UPLOAD_SIZE`- maximum size(in MB) of a file intended to be uploaded, default value is `500`, which means that user can not upload a file larger than 500MB.
* `PORT` - for dev mode, this variable allows to modify the port where the app will be listening, default value is 8080.


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

