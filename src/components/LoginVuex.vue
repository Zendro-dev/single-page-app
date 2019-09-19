<template>
 <div>
   <form class="login" @submit.prevent="login">
     <h1>Sign in</h1>
     <label>Email</label>
     <input required v-model="email" type="email" placeholder="email"/>
     <label>Password</label>
     <input required v-model="password" type="password" placeholder="password"/>
     <hr/>
     <button type="submit">Login</button>
   </form>

   <div id="react-root"></div>

 </div>
</template>

<script>

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('react-root')
);

export default {
  name: 'login-vuex',
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
   login: function () {
     let data_to_send = {
       email: this.email,
       password: this.password,
       login_url: this.$loginUrl()
     }
     
     this.$store.dispatch('auth_request', data_to_send).then((res) => {
       this.$router.push('/home')
     }).catch(err=>{
       this.email = "";
       this.password = "";
       this.$router.push('/')
     })
   }
  }
}
</script>
