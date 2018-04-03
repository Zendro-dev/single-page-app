<template>
  <div class="input-group date" v-el:inputgroup>
    <input
      type="text"
      class="form-control"
      v-model="value" />
    <span class="input-group-addon">
      <i class="glyphicon glyphicon-calendar"></i>
    </span>
  </div>
</template>
  
<script>
  export default {
    props: [value],
    data: function() {
      return {};
    },
    ready: function() {
      $(this.$els.inputgroup).datepicker({
        format: 'yyyy/mm/dd',
        autoclose: true
      });
    }
  }
</script>
