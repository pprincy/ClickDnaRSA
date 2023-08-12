import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getPendingPaymentList(_, payload) {
    return axios
      .get("/api/payment/invoice-pending-listing", {
        params: payload,
      })
      .then((res) => res.data);
  },
  updatePendingPaymentDetails(_, payload) {
    return axios
      .post(`/api/payment/invoice-update`, payload)
      .then((res) => res.data);
  },
  getBankTransferList(_, payload) {
    return axios
      .get("/api/payment/bank-list", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getPaymentGatewayList(_, payload) {
    return axios
      .get("/api/payment/payment-gateway-list", {
        params: payload,
      })
      .then((res) => res.data);
  },
  downloadPendingPayment(context, payload) {
    return axios
      .post(`/api/payment-pending/download`, payload, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  getPaymentList(_, payload) {
    return axios
      .get(`/api/payment/payment-list`, {
        params: payload,
      })
      .then((res) => res.data);
  },
  downloadPaymentList(context, payload) {
    return axios
      .post(`/api/payment-transaction/download`, payload, {
        responseType: "blob",
      })
      .then((res) => res);
  },
};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations,
};
