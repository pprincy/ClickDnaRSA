import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";
import users from "./modules/users";
import general from "./modules/general";
import countries from "./modules/countries";
import carriers from "./modules/carriers";
import linehaul from "./modules/linehaul";
import labeling from "./modules/labeling";
import tracking from "./modules/tracking";
import bags from "./modules/bags";
import packages from "./modules/packages";
import consolidations from "./modules/consolidations";
import subscription from "./modules/subscription";
import sellers from "./modules/sellers";
import report from "./modules/report";
import quotes from "./modules/quotes";
import payments from "./modules/payments";
import uploadoutbound from "./modules/uploadoutbound";
import order from "./modules/order";
import hscode from "./modules/hscode";
import outboundxml from "./modules/outboundxml";
import paymentgateway from "./modules/paymentgateway";
import documents from "./modules/documents";
import boeoutbound from "./modules/boeoutbound";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    users,
    general,
    countries,
    carriers,
    linehaul,
    labeling,
    tracking,
    bags,
    consolidations,
    packages,
    subscription,
    sellers,
    report,
    quotes,
    payments,
    uploadoutbound,
    order,
    hscode,
    outboundxml,
    paymentgateway,
    documents,
    boeoutbound,
  },
  plugins: [
    createPersistedState({
      paths: [
        "auth.tkn",
        "auth.tkndt",
        "auth.user",
        "auth.atkn",
        "auth.atkndt",
      ],
    }),
    createPersistedState({
      paths: [
        "tracking.trackNos",
        "tracking.selectedTrackNo",
        "tracking.refNoData",
        "tracking.consNo",
        "report.accessToken",
        "report.expireOn",
      ],
      storage: window.sessionStorage,
    }),
  ],
});
