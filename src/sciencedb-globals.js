module.exports.install = function(Vue, options) {
  Vue.prototype.$baseUrl = function() {
    return process.env.VUE_APP_SERVER_URL || "http://localhost:3000/graphql";
  }

  Vue.prototype.$loginUrl = function() {
    return process.env.VUE_APP_LOGIN_URL || "http://localhost:3000/login";
  }

  Vue.prototype.$MAX_UPLOAD_SIZE = function(){
    return process.env.VUE_APP_MAX_UPLOAD_SIZE || 500 // size in MB
  }
  Vue.prototype.$defaultDateFormat = function() {
    return "yy-mm-dd"
  }

}
