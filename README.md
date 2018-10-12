# science_db_gui

> A Vue.js project

### Expected environmental variables 
```
AUTH0_DOMAIN
AUTH0_CLIENT_ID
YOUR_CALLBACK_URL
MY_SERVER_URL 
```
First three variables will be the ones provided by your auth0 configuration. For more details on how to cofigure your app with auth0 see [HERE](https://auth0.com/docs/quickstart/spa/vuejs#configure-auth0)

`MY_SERVER_URL` is the url where your backend server will be running. For more details on how to generate the code for the server see [HERE](https://github.com/ScienceDb/server-graphql-sequelize).


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

