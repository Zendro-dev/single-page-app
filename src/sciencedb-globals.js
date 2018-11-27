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
  Vue.prototype.$login = function(token) {
    return localStorage.setItem('token', token)
  }
  Vue.prototype.$getAuthToken = function() {
    return localStorage.getItem('token')
  }
  Vue.prototype.$loggedIn = function() {
    return (localStorage.getItem('token') !== undefined &&
      localStorage.getItem('token') !== null)
  }
  Vue.prototype.$logout = function() {
    return localStorage.removeItem('token')
  }
}
