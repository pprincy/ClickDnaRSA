import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getPaymentRequest(_, enc_invoice_number) {
    return axios
      .post(`/api/payment_request/${enc_invoice_number}`)
      .then((res) => res.data);
  },
  getPaymentResponse(_, hash_value) {
    return axios
      .post(`/api/payment_response/${hash_value}`)
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
