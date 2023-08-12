import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getAllBags(context, payload) {
    return axios
      .get("/api/bag-data", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getBagDetails(context, id) {
    return axios.get("/api/bag-data/" + id).then((res) => res.data);
  },
  updateBagDetails(context, payload) {
    return axios
      .patch("/api/bag-data/" + payload.id, payload.data)
      .then((res) => res.data);
  },
  getBagDataTemplate(context, payload) {
    return axios
      .get("/api/bag-data/template", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getBagDataSummary(context, payload) {
    return axios
      .get("/api/bag-data/summary", {
        params: payload,
      })
      .then((res) => res.data);
  },
  uploadBagExcel(context, payload) {
    return axios.post("/api/bag-data/upload", payload).then((res) => res.data);
  },
  downloadBagLabels(context, payload) {
    return axios
      .post(
        `/api/bag-label/download/${payload.format}/${payload.size}`,
        payload.data,
        {
          responseType: "blob",
        }
      )
      .then((res) => res);
  },
  downloadBagDetails(context, id) {
    return axios
      .get(`/api/bag-data/download/${id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  downloadBagDataTemplate() {
    return axios
      .get(`/assets/app_bags/template/bag_data_upload_excel_template.xlsx`, {
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
