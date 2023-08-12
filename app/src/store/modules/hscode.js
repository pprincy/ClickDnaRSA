import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  uploadCode(_, payload) {
    return axios.post("/api/hs_code_listing", payload).then((res) => res.data);
  },
  downloadTemplateHSCode() {
    return axios
      .get(`/assets/app_seller/template/hs_code_excel.xlsx`, {
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
