import { axios } from "@/plugins/http-request.js";

const state = {
  consolidationObj: {},
};

const getters = {
  consolidationObj: (state) => state.consolidationObj,
};

const actions = {
  getConsolidations(context, payload) {
    return axios
      .get("/api/consolidations", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getConsolidation(context, id) {
    return axios.get(`/api/consolidations/${id}`).then((res) => {
      context.commit("setConsolidationObj", res.data.data);
      return res.data;
    });
  },
  createConsolidation(context, payload) {
    return axios.post("/api/consolidations", payload).then((res) => res.data);
  },
  updateConsolidation(context, payload) {
    return axios
      .patch("/api/consolidations/" + payload.id, payload.data)
      .then((res) => res.data);
  },
  deleteConsolidation(context, id) {
    return axios.delete("/api/consolidations/" + id).then((res) => res.data);
  },
  downloadConsolidation(context, id) {
    return axios
      .get(`/api/consolidations/download/${id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  getAgentConsolidations(context, payload) {
    return axios
      .get(`/api/agent-consolidation/list/${payload.status}`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  getAgentNewConsolidations(context, payload) {
    return axios
      .get("/api/agent-consolidation", {
        params: payload,
      })
      .then((res) => res.data);
  },
  downloadAgentNewConsolidation(context, id) {
    return axios
      .get(`/api/agent-new-consolidation/download/${id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  downloadAgentConsolidation(context, id) {
    return axios
      .get(`/api/agent-consolidation/download/${id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  receiveOAConsolidation(context, payload) {
    return axios
      .post("/api/agent-consolidation/receiving", payload)
      .then((res) => res.data);
  },
  markAsStagedCargo(context, payload) {
    return axios
      .post("/api/agent-consolidation/move-to/staged", payload)
      .then((res) => res.data);
  },
  markAsUnStagedCargo(context, payload) {
    return axios
      .post(`/api/agent-consolidation/move-to/unstaged`, payload)
      .then((res) => res.data);
  },
  updateFlightDetails(context, payload) {
    return axios
      .post("/api/agent-consolidation/flight-details", payload)
      .then((res) => res.data);
  },
  getFlightDetails(context, id) {
    return axios
      .get(`/api/agent-consolidation/flight-details/${id}`)
      .then((res) => res.data);
  },
  mergeConsolidations(context, payload) {
    return axios
      .post("/api/agent-consolidation/merge", payload)
      .then((res) => res.data);
  },
  moveToStaging(context, payload) {
    return axios
      .post("/api/agent-consolidation/action/staging", payload)
      .then((res) => res.data);
  },
  confirmDepartures(context, payload) {
    return axios
      .post("/api/agent-consolidation/departure", payload)
      .then((res) => res.data);
  },
  dispatchFromFacility(context, payload) {
    return axios
      .post("/api/agent-consolidation/dispatched-facility", payload)
      .then((res) => res.data);
  },
  getDeconsolidateFields(context, payload) {
    return axios
      .get("/api/agent-consolidation/field-list", {
        params: payload,
      })
      .then((res) => res.data);
  },
  deConsolidateIt(context, payload) {
    return axios
      .post(`/api/agent-consolidation/deconsolidate`, payload)
      .then((res) => res.data);
  },
  getTrackingDetails(context, payload) {
    return axios
      .get(`/api/client/tracking/details/${payload.tracking_no}`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  getConsolidationSummary(context, operationNumber) {
    return axios
      .get(`/api/agent-consolidation/view-summary/${operationNumber}`)
      .then((res) => res.data);
  },
};

const mutations = {
  setConsolidationObj(state, consolidationObj) {
    state.consolidationObj = consolidationObj;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
