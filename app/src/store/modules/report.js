import { axios } from "@/plugins/http-request.js";

const state = {
  accessToken: null,
  expireOn: null,
  clientTypes: [],
  userTypes: [],
  activeCarriersListTypes: [],
};

const getters = {
  accessToken: (state) => state.accessToken,
  clientTypes: (state) => state.clientTypes,
  userTypes: (state) => state.userTypes,
  activeCarriersListTypes: (state) => state.activeCarriersListTypes,
};

const actions = {
  getDReports(context, payload) {
    return axios
      .get("/api/dashboard-report", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getDReportDetails(context, id) {
    return axios.get(`/api/dashboard-report/${id}`).then((res) => res.data);
  },
  createDReport(context, payload) {
    return axios.post("/api/dashboard-report", payload).then((res) => res.data);
  },
  updateDReport(context, payload) {
    return axios
      .patch("/api/dashboard-report/" + payload.id, payload.data)
      .then((res) => res.data);
  },
  async generatePBIAtoken(context) {
    const currentTime = Date.now();
    if (
      context.state.accessToken &&
      +context.state.expireOn * 1000 - currentTime > 60000
    )
      return context.state.accessToken;
    const res = await axios.get(`api/powerbi/generate-access-token`);
    context.commit("setAccessToken", res.data.data.access_token);
    context.commit("setExpireOn", res.data.data.expires_on);
    return context.getters.accessToken;
  },
  async getClientTypes(context) {
    if (context.state.clientTypes.length) return;
    const res = await axios.get(`api/dashboard-report/clients`);
    context.commit("setClientTypes", res.data.data);
  },
  async getUserTypes(context) {
    if (context.state.userTypes.length) return;
    const res = await axios.get(`/api/dashboard/user-category`);
    context.commit("setUserTypes", res.data.data);
  },
  async getActiveCarriersListTypes(context) {
    if (context.state.activeCarriersListTypes.length) return;
    const res = await axios.get(`/api/carriers_list`);
    context.commit("setActiveCarriersListTypes", res.data.data);
  },
  getTypeClients(context, id) {
    return axios
      .get(`/api/dashboard-report/clients/${id}`)
      .then((res) => res.data);
  },
  getRSAUserGroup(context, payload) {
    return axios
      .get(`/api/dashboard/user-group`, {
        params: payload,
      })
      .then((res) => res.data);
  },
};

const mutations = {
  setAccessToken(state, token) {
    state.accessToken = token;
  },
  setExpireOn(state, expireOn) {
    state.expireOn = expireOn;
  },
  setClientTypes(state, clientTypes) {
    state.clientTypes = clientTypes;
  },
  setUserTypes(state, userTypes) {
    state.userTypes = userTypes;
  },
  setActiveCarriersListTypes(state, activeCarriersListTypes) {
    state.activeCarriersListTypes = activeCarriersListTypes;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
