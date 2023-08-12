import Vue from "vue";
import VueLodash from "vue-lodash";
import groupBy from "lodash/groupBy";
import flatten from "lodash/flatten";
import cloneDeep from "lodash/cloneDeep";

Vue.use(VueLodash, { lodash: { groupBy, flatten, cloneDeep } });
