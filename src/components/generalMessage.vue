<template>
  <div class="col-sm-7 col-sm-offset-7 position">
    <div id="customMessage" :class="class_type" v-if="errors.length">
        <ul>
            <li v-for="error in errors">{{ error.message }}</li>
        </ul>
    </div>
  </div>
</template>

<script>

export default  {
    data(){
      return {
        class_type : this.type !== null ? "alert alert-"+ this.type : "alert alert-info"
      }

    },
    props: ['errors', 'type']
};
</script>
<style>


.position{
  position: absolute;
  top: 20px;
  right : 20px;
}

</style>
