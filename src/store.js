import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import decode from 'jwt-decode';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    expirationDate: localStorage.getItem('expirationDate') || null
    //user : {}
  },
  mutations: {
    auth_request(state){
      state.status = 'loading';
    },
    auth_success(state,{ token,date}){
      state.status = 'success';
      state.token = token;
      state.expirationDate = date;
    },
    auth_error(state){
      state.status = 'error';
    },
    auth_logout(state){
      state.status = '';
      state.token = '';
      state.expirationDate = null;
    }
  },
  actions: {

    auth_request({commit}, user_data ){
      return new Promise((resolve, reject)=>{
        commit('auth_request')
        axios({url: "http://localhost:3000/login", data: user_data, method: 'POST'})
        .then( response => {
          console.log("FROM ACTION",response.data)
          const token = response.data.token;
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = 'Bearer '+token;

          //set expiration Date

          let date = null;
          const  decoded_token = decode(token);
          if (decoded_token.exp) {
            date = new Date(0);
            date.setUTCSeconds(decoded_token.exp);
          }
          localStorage.setItem('expirationDate', date);
          commit('auth_success', {token, date})
          resolve(response)
        }).catch( err =>{
          commit('auth_error', err)
          localStorage.removeItem('token')
          localStorage.removeItem('expirationDate')
          reject(err)
        })
      })
    },

    auth_logout({commit}){
      return new Promise((resolve, reject)=>{
        commit('auth_logout')
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        delete axios.defaults.headers.common['Authorization']
        resolve();
      })
    }

  },
  getters : {

    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    authToken: state => state.token,
    isExpired: state => {
      return (new Date(state.expirationDate) < new Date())
    },
    expirationD: state =>  state.expirationDate
  }
})
