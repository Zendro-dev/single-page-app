<template>
	<div class="col-sm-4 col-sm-offset-4">
		<h2>Sign in</h2>
		<form id="login-form" v-on:submit.prevent="onSubmit">
			<div class="form-group">
				<input
				type="text"
				class="form-control"
				placeholder="Enter your email"
				ref="email"
			>
			</div>
			<div class="form-group">
				<input
				type="password"
				class="form-control"
				placeholder="Enter your password"
				ref="password"
			>
			</div>
			<button class="btn btn-primary">Submit</button>
		</form>
	</div>
</template>
  
<script>
import axios from 'axios'

export default {
  props: ['loggedIn'],
  data: function() {
    return {
      error: null
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      t.error = null;
      if (t.$refs.email.value !== undefined && t.$refs.email.value !== '' &&
        t.$refs.password.value !== undefined && t.$refs.password.value !== ''
      ) {
        var url = this.$baseUrl() + '/login'
        axios.post(url, {
          email: t.$refs.email.value,
          password: t.$refs.password.value
        }).then(function(res) {
          t.$login(res.data.token)
          t.$emit('update:loggedIn', true)
          t.$emit('update:error', null)
          t.$router.push('/home')
        }).catch(res => {
          t.$emit('update:loggedIn', false)
          t.error = res.response.data.message
          this.$root.$emit('globalError', t.error)
          this.$router.push('/')
        })
      } else {
        t.error = 'Please provide email and password.'
      }
    }
  }
}
</script>
