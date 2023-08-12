import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  uploadXML(_, payload) {
    return axios.post("/api/xml_file_parsing", payload).then((res) => res.data);
  },
  uploadRSAXML(_, payload) {
    return axios
      .post("/api/rsa_xml_file_parsing", payload)
      .then((res) => res.data);
  },
  getRsaXmlCommercialListing(_, payload) {
    return axios
      .get("/api/rsa_xml_commercial_listing", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getRsaXmlDataListing(_, payload) {
    return axios
      .post("/api/rsa_xml_data_listing/", payload)
      .then((res) => res.data);
  },
  getOutboundAMZCommercialListing(_, payload) {
    return axios
      .get("/api/xml_commercial_listing", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getOutboundAMZDataListing(_, payload) {
    return axios
      .post("/api/xml_parsing_listing", payload)
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
