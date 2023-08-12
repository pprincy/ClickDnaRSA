import { axios } from "@/plugins/http-request.js";

const state = {
  trackNos: [],
  selectedTrackNo: [],
  refNoData: null,
  consNo: null,
};

const getters = {
  trackNos: (state) => state.trackNos,
  selectedTrackNo: (state) => state.selectedTrackNo,
  refNoData: (state) => state.refNoData,
  consNo: (state) => state.consNo,
};

const actions = {
  getTrackingRanges(context, payload) {
    return axios
      .get("/api/tracking-range", {
        params: payload,
      })
      .then((res) => res.data);
  },
  createTrackingRange(context, payload) {
    return axios.post("/api/tracking-range", payload).then((res) => res.data);
  },
  updateTrackingRange(context, payload) {
    return axios
      .patch("/api/tracking-ranges/update/" + payload.id, payload.formData)
      .then((res) => res.data);
  },
  stopTransactionsTrackingRange(context, id) {
    return axios
      .patch("/api/tracking-range/stop/" + id)
      .then((res) => res.data);
  },
  getTrackingEvents(context, payload) {
    return axios
      .get("/api/tracking-events", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getEntityScans(context, payload) {
    return axios
      .get("/api/entity-scans", {
        params: payload,
      })
      .then((res) => res.data);
  },
  createTrackingEvent(context, payload) {
    return axios.post("/api/tracking-events", payload).then((res) => res.data);
  },
  updateTrackingEvent(context, payload) {
    return axios
      .patch("/api/tracking-events/" + payload.id, payload.formData)
      .then((res) => res.data);
  },
  deleteTrackingEvent(context, id) {
    return axios.delete("/api/tracking-events/" + id).then((res) => res.data);
  },
  createEntityScan(context, payload) {
    return axios.post("/api/entity-scans", payload).then((res) => res.data);
  },
  updateEntityScan(context, payload) {
    return axios
      .patch("/api/entity-scans/" + payload.id, payload.formData)
      .then((res) => res.data);
  },
  deleteEntityScan(context, id) {
    return axios.delete("/api/entity-scans/" + id).then((res) => res.data);
  },
  downloadActiveRange(context, id) {
    return axios
      .get("/api/tracking-range/download-active/" + id, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  downloadRange(context, id) {
    return axios
      .get("/api/tracking-range/download/" + id, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  getTrackNoSummary(context, payload) {
    return axios.post("/api/tracking/status", payload).then((res) => res.data);
  },
  getConsNoSummary(context, payload) {
    return axios
      .post("/api/consolidation/tracking", payload)
      .then((res) => res.data);
  },
  downloadPOD(context, payload) {
    return axios
      .post("/api/consignment-pod/download", payload, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  sendTrackingEmail(context, payload) {
    return axios.post("/api/tracking/mail", payload).then((res) => res.data);
  },
  downloadTrackingInfo(context, payload) {
    return axios
      .post("/api/tracking/download", payload, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  sendTrackingRangesToClient(context, id) {
    return axios.get(`/api/tracking-range/email/${id}`).then((res) => res.data);
  },
  saveApplyScan(context, payload) {
    return axios.post("/api/apply-scan", payload).then((res) => res.data);
  },
};

const mutations = {
  setTrackNos(state, trackNos) {
    state.trackNos = trackNos;
  },
  setSelectedTrackNo(state, selectedTrackNo) {
    state.selectedTrackNo = selectedTrackNo;
  },
  setRfNoData(state, refNoData) {
    state.refNoData = refNoData;
  },
  setConsNo(state, consNo) {
    state.consNo = consNo;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
