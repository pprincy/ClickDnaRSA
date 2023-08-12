import { axios } from "@/plugins/http-request.js";

const state = {
  carriers: [],
  carrierDetails: {},
  transitPartners: [],
};

const getters = {
  carriers: (state) => state.carriers,
  carrierDetails: (state) => state.carrierDetails,
  transitPartners: (state) => state.transitPartners,
};

const actions = {
  getCarriers(context, payload) {
    return axios
      .get("/api/carriers", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getCarrierData(context, payload) {
    return axios
      .get("/api/carrier-data", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getCarrierDetails({ commit }, id) {
    return axios.get(`/api/carriers/${id}`).then((res) => {
      commit("setCarrierDetails", res.data.data);
      return res.data;
    });
  },
  updateCarrierDetails(context, payload) {
    return axios
      .patch(`/api/carriers/${payload.id}`, payload.data)
      .then((res) => res.data);
  },
  changeCarrierStatus(context, payload) {
    return axios
      .patch(`/api/carriers/${payload.id}/toggle/${payload.state}`)
      .then((res) => res.data);
  },
  getCarrierCoverage(context, payload) {
    return axios
      .get(`/api/carriers/${payload.carrierId}/coverage`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  getCarrierCoverageCapacities(context, payload) {
    return axios
      .get(
        `/api/carriers/${payload.carrierId}/coverage/${payload.coverageId}/capacities`
      )
      .then((res) => res.data);
  },
  updateCarrierCoverageCapacities(context, payload) {
    return axios
      .patch(
        `/api/carriers/${payload.carrierId}/coverage/${payload.coverageId}/capacities`,
        payload.data
      )
      .then((res) => res.data);
  },
  updateCityCoverage(context, payload) {
    return axios
      .patch(
        `/api/carriers/${payload.carrierId}/coverage/${payload.coverageId}`,
        payload.data
      )
      .then((res) => res.data);
  },
  saveCarrierLabelDefinition(context, payload) {
    return axios
      .patch(`/api/carriers/${payload.carrierId}/label-setup`, payload.data)
      .then((res) => res.data);
  },
  getCarrierTrackings(context, payload) {
    return axios
      .get(`/api/carriers/${payload.carrierId}/trackings`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  updateCarrierTrackingEvent(context, payload) {
    return axios
      .patch(
        `/api/carriers/${payload.carrierId}/trackings/${payload.trackingId}`,
        payload.data
      )
      .then((res) => res.data);
  },
  getTransitPartners(context, payload) {
    if (context.state.transitPartners.length === 0) {
      return axios.get("/api/carriers", payload).then((res) => {
        context.commit("setTransitPartners", res.data.data);
      });
    }
  },
  getCarriersCoverages(context, payload) {
    return axios
      .get(`/api/country_services_coverage`, {
        params: payload,
      })
      .then((res) => res.data);
  },
  getCountrywiseCoverage(context, payload) {
    return axios
      .post(`/api/country_carrier_partners`, payload)
      .then((res) => res.data);
  },
  getEvents(context, payload) {
    return axios
      .get(`/api/tracking_events/${payload.carrier_id}`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  uploadEvents(context, payload) {
    return axios
      .post(`/api/tracking_events/upload`, payload)
      .then((res) => res.data);
  },
  downloadEvents(context, payload) {
    return axios
      .post(`/api/tracking_events/download`, payload, {
        responseType: "blob",
      })
      .then((res) => res);
  },
};

const mutations = {
  setCarriers: (state, carriers) => {
    state.carriers = carriers;
  },
  setCarrierDetails: (state, carrierDetails) => {
    state.carrierDetails = carrierDetails;
  },
  setTransitPartners: (state, transitPartners) => {
    state.transitPartners = transitPartners;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
