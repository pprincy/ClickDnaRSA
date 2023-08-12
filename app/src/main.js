import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./plugins/moment";
import "./plugins/vue-lodash";
import "./plugins/vue-directives";
import "./plugins/vue-filters";
import "./plugins/vue-google-map";

import mixin from "./mixins/general";

Vue.mixin(mixin);

import store from "./store";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
