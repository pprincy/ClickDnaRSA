import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  uploadExcel(_, payload) {
    return axios.post("/api/inventory-upload", payload).then((res) => res.data);
  },
  uploadDataFileExcel(_, payload) {
    return axios
      .post("/api/sellers/amz_obgatepass/upload", payload)
      .then((res) => res.data);
  },
  downloadDataFileTemplate() {
    return axios
      .get(`/assets/app_seller/template/amz_obGatepass_upload_template.xlsx`, {
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
