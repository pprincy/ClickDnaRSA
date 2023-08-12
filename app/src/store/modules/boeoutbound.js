import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getboeOuboundList(_, payload) {
    return axios
      .get(`api/fulfillment-order-list/boe-outbound/list`, {
        params: payload,
      })
      .then((res) => res.data);
  },
  downloadBoeOutbund(context, payload) {
    return axios
      .post(`api/fulfillment-order-list/boe-outbound/list/download`, payload, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  uploadBoeOutboundList(_, payload) {
    return axios
      .post(`api/fulfillment-order-list/boe-outbound/upload`, payload)
      .then((res) => res.data);
  },
};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations,
};
