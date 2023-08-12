import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getSpHandlingCodes(context, payload) {
    return axios
      .get("/api/special-handling", {
        params: payload,
      })
      .then((res) => res.data);
  },
  createSpHandlingCode(context, payload) {
    return axios.post("/api/special-handling", payload).then((res) => res.data);
  },
  updateSpHandlingCode(context, payload) {
    return axios
      .patch("/api/special-handling/" + payload.id, payload.formData)
      .then((res) => res.data);
  },
  deleteSpHandlingCode(context, id) {
    return axios.delete("/api/special-handling/" + id).then((res) => res.data);
  },
  getSplitCodes(context, payload) {
    return axios
      .get("/api/split-codes/list", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getSplitCodeFields() {
    return axios.get(`/api/split-code-fields/list`).then((res) => res.data);
  },
  getSplitCodeDetails(context, id) {
    return axios.get(`/api/split-codes/${id}`).then((res) => res.data);
  },
  createSplitCode(context, payload) {
    return axios.post("/api/split-codes/post", payload).then((res) => res.data);
  },
  updateSplitCode(context, payload) {
    return axios
      .patch("/api/split-codes/" + payload.id, payload.data)
      .then((res) => res.data);
  },
  deleteSplitCode(context, id) {
    return axios
      .delete("/api/split-codes/delete/" + id)
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
