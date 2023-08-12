import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getTrackingSubscriptions(context, payload) {
    return axios
      .get("/api/subscription/tracking", {
        params: payload,
      })
      .then((res) => res.data);
  },
  updateTrackingSubscriptions(context, payload) {
    return axios
      .patch("/api/subscription/tracking", payload)
      .then((res) => res.data);
  },
  getLabelSubscriptions(context, payload) {
    return axios
      .get("/api/subscription/label", {
        params: payload,
      })
      .then((res) => res.data);
  },
  updateLabelSubscriptions(context, payload) {
    return axios
      .patch("/api/subscription/label", payload)
      .then((res) => res.data);
  },
  getPODSubscriptions(context, payload) {
    return axios
      .get("/api/subscription/pod", {
        params: payload,
      })
      .then((res) => res.data);
  },
  updatePODSubscriptions(context, payload) {
    return axios
      .patch("/api/subscription/pod", payload)
      .then((res) => res.data);
  },
  getAuthSubscriptions(context, payload) {
    return axios
      .get("/api/subscription/auth", {
        params: payload,
      })
      .then((res) => res.data);
  },
  updateAuthSubscriptions(context, payload) {
    return axios
      .patch("/api/subscription/auth", payload)
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
