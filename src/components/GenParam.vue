<template>
  <div class="gen-param">
    <div class="wrapper d-flex justify-content-center">
      <div id="csv-data" class="m-1">
        <p>Paste CSV data</p>
        <textarea name="cd-ta" id="cd-ta" cols="45" rows="5" v-model="csvvalue"></textarea>
        <br>
      </div>
      <div id="j-data" class="m-1">
        <p>JSON Output</p>
        <textarea disabled name="jd-ta" id="jd-ta" cols="45" rows="5"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue-function-api";
export default {
  props: ["csvvalue"],
  setup(props, context) {
    onMounted(() => {
      // console.log(props, props.csvvalue);
    });
  }
};
</script>

<style scoped>
.wrapper {
  padding-top: 50px;
}
</style>
