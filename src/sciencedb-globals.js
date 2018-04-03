module.exports.install = function(Vue, options) {
  Vue.prototype.$baseUrl = function() {
    return "http://213.136.88.239:3000"
  }
  Vue.prototype.$defaultDateFormat = function() {
    return "yy-mm-dd"
  }
}
