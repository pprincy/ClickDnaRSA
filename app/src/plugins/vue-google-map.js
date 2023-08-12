import Vue from "vue";
import * as GmapVue from "gmap-vue";

Vue.use(GmapVue, {
  load: {
    key: "AIzaSyDCFIDeo2RgPRn3yUAilC8rIXbo-c8mOF8",
    libraries: "places",
  },
  installComponents: true,
});
