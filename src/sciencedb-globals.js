module.exports.install = function(Vue, options) {
  Vue.prototype.$baseUrl = function() {
    return "http://213.136.88.239:3000"
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
