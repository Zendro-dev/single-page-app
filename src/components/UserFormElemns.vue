<template>
  <div id="user-form-elemns-div">

  <input type="hidden" v-model="user.id"/>
  
  
    <div id="user-email-div" class="form-group">
      <label>email</label>
      <input type="text" v-model="user.email" class="form-control"/>
      <div id="user-email-err" v-if="typeof validationError('email') !== 'undefined'">
        {{validationError('email').message}}
      </div>
    </div>

  
    
  </div>
</template>

<script>

export default {
  props: [ 'user', 'errors' ],
    methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.find(function (el) {
        return el.path === modelField
      })
    }
  }
}
</script>
