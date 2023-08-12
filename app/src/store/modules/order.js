import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getFulfillmentOrderList(_, payload) {
    return axios
      .get("/api/fulfillment-order-list", {
        params: payload,
      })
      .then((res) => res.data);
  },
  downloadAWBDetails(context, tracking_no) {
    return axios
      .get(`/api/package-label/download/${tracking_no}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  downloadEcomDetails(context, id) {
    return axios
      .get(
        `/api/fulfillment-consignment-customs-docs/ecom/pdf/fulfillment/${id}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => res);
  },
  downloadDaDetails(context, id) {
    return axios
      .get(
        `/api/fulfillment-consignment-customs-docs/da/pdf/fulfillment/${id}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => res);
  },
  downloadCustomerInvoiceDetails(context, id) {
    return axios
      .get(
        `/api/fulfillment-consignment-customs-docs/customer_invoice/pdf/fulfillment/${id}`,
        {
          responseType: "blob",
        }
      )
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
