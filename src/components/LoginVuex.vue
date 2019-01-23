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
 </div>
</template>

<script>
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
     const { email, password } = this
     console.log(email, password);
     this.$store.dispatch('auth_request', { email, password }).then((res) => {
       console.log("FROM LOGIN COMPONENT", res)
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
