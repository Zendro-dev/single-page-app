const ScienceDbGlobals = {
  install(Vue, options) {
    Vue.prototype.$baseUrl = function() {
      return "http://localhost:3000"
    }
  }
};

export default ScienceDbGlobals;
