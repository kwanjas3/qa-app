<template>
  <div class="renderer">
    <div class="proxy-Check" v-if="proxyServer">
      <div class="w-100 position-fixed bg-light p-1" id="pf-bg">
        <label for="furl">URL:</label>
        <input type="text" name="furl" id="furl" v-model="url" class="w-50 mr-2 ml-3" />
        <button @click="convertCJ" class="mr-2 btn btn-sm btn-outline-primary">1. Convert</button>
        <button
          class="mr-2 btn btn-sm btn-outline-secondary"
          @click="assignParsedJSON"
        >2. Set Parameters</button>
        <button
          class="mr-2 btn btn-sm btn-outline-success mr-2"
          id="fetch-button"
          @click="fetchContent"
        >3. Check</button>
        <!-- <input type="text" name="furl" id="furl" v-model="domain" class="w-25 mr-2 ml-3"> -->
        <!-- <button class="btn btn-outline-primary">Clear</button> -->
      </div>
      <GenParam :csvvalue="csv" />
      <div class="row justify-content-center m-3"></div>
      <div class="row">
        <div class="col-md-3 pr-container">
          <div class="pageRender p-5" v-html="fetchResponse" id="pageRendered"></div>
        </div>
        <div class="col-md-9 pr-container">
          <b-pagination
            v-model="currentPage"
            :total-rows="rowsCount"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>

          <p id="currentPageNum" class="mt-3">Page: {{ currentPage }}</p>

          <b-table
            id="link-table"
            striped
            hover
            :items="table"
            responsive
            small
            :per-page="perPage"
            :current-page="currentPage"
          >
            <span slot="url" slot-scope="data" v-html="data.value"></span>
          </b-table>
        </div>
      </div>
    </div>
    <div class="proxy-message text-center" v-else>
      The Local Proxy server has not been deployed yet
      <br />
      <button
        class="btn btn-large btn-primary"
        @click="checkProxyServer"
      >Press here to Register App to Proxy</button>
      <br />
      {{errorMessage}}
    </div>
  </div>
</template>

<script>
import GenParam from "../components/GenParam.vue";
import {
  onMounted,
  value,
  onUpdated,
  onUnmounted,
  watch
} from "vue-function-api";
import {
  checkProxyServer,
  assignParsedJSON,
  convertCJ,
  fetchContent,
  errorMessage,
  proxyServer,
  currentPage,
  perPage,
  rowsCount,
  csv,
  jdata,
  fetchResponse,
  __EVENTVALIDATION,
  __LASTFOCUS,
  __EVENTTARGET,
  __EVENTARGUMENT,
  __VSTATE,
  __VIEWSTATE,
  domain,
  url,
  csvjson,
  table,
  hreflinks
} from "../functions/Home";

// function onlyUnique(value, index, self) {
//   return self.indexOf(value) === index;
// }

export default {
  name: "Home",
  components: { GenParam },

  setup() {
    onUpdated(() => {
      document.querySelector("#ButtonSearch") != null
        ? document.querySelector("#ButtonSearch").classList.add("disabled")
        : null;
      document.querySelectorAll("a.lightLink") != null
        ? document.querySelectorAll("a.lightLink").forEach(i => {
            i.className = "lightLink btn btn-sm disabled";
          })
        : null;

      document.querySelector("#tblMediaTypes>ul") != null
        ? document
            .querySelector("#tblMediaTypes>ul")
            .querySelectorAll("li>input")
            .forEach(i => {
              i.setAttribute("disabled", true);
            })
        : null;
    });
    onMounted(() => {
      checkProxyServer();
    });

    watch(
      () => proxyServer.value,
      (n, o) => {
        if (n) {
          // document.querySelector("#cd-ta").value = csv.value;
        }
      }
    );

    return {
      checkProxyServer,
      assignParsedJSON,
      convertCJ,
      fetchContent,
      errorMessage,
      proxyServer,
      checkProxyServer,
      currentPage,
      perPage,
      rowsCount,
      csv,
      jdata,
      fetchResponse,
      __EVENTVALIDATION,
      __LASTFOCUS,
      __EVENTTARGET,
      __EVENTARGUMENT,
      __VSTATE,
      __VIEWSTATE,
      domain,
      url,
      csvjson,
      table,
      hreflinks
    };
  },

  methods: {}
};
</script>

<style scoped>
.pr-container {
  top: 50px;
  max-height: 93vh;
  overflow: scroll;
}
#pf-bg {
  z-index: 2;
  height: 50px;
}
</style>
