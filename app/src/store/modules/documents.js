import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getImportExportDocList(_, payload) {
    return axios
      .get(`/api/logistics_doc/list`, {
        params: payload,
      })
      .then((res) => res.data);
  },
  downloadImportExportDoc(context, payload) {
    return axios
      .post(`/api/logistics_doc/list/download`, payload, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  changeDocListStatus(_, payload) {
    return axios
      .patch(`/api/logistics_doc/toggle_status/${payload.id}/${payload.state}`)
      .then((res) => res.data);
  },
  uploadDocList(_, payload) {
    return axios
      .post(`/api/logistics_doc/upload`, payload)
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
