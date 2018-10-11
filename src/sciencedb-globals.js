module.exports.install = function(Vue, options) {
  Vue.prototype.$baseUrl = function() {
    console.log(process.env.AUTH0_CLIENT_ID);
    console.log(process.env.MY_SERVER_URL);
    return process.env.MY_SERVER_URL;
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
