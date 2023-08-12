import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getQuoteList(_, payload) {
    return axios
      .get("/api/sellers/freight-quote", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getQuoteDetails(_, invoiceId) {
    return axios
      .get(`/api/sellers/freight-quote/${invoiceId}`)
      .then((res) => res.data);
  },
  offerQuote(_, payload) {
    return axios
      .post(`/api/sellers/offer-quote`, payload)
      .then((res) => res.data);
  },
  updateFreightStatus(_, payload) {
    return axios
      .patch(`/api/sellers/update-freight-status/${payload.id}`, payload.data)
      .then((res) => res.data);
  },
  createQuote(_, payload) {
    return axios
      .post("/api/sellers/freight-quote", payload)
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
