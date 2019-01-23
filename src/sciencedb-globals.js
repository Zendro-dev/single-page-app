module.exports.install = function(Vue, options) {
  Vue.prototype.$baseUrl = function() {
    return process.env.MY_SERVER_URL || "http://localhost:3000/graphql";
  }
  Vue.prototype.$MAX_UPLOAD_SIZE = function(){
    return process.env.MAX_UPLOAD_SIZE || 500 // size in MB
  }

  Vue.prototype.$defaultDateFormat = function() {
    return "yy-mm-dd"
  }

}
