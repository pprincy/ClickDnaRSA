import { axios } from "@/plugins/http-request.js";

const state = {
  linehaulConfig: {},
  paperFormats: [],
  labelTypes: [],
  barcodeTypes: [],
};

const getters = {
  linehaulConfig: (state) => state.linehaulConfig,
  paperFormats: (state) => state.paperFormats,
  labelTypes: (state) => state.labelTypes,
  barcodeTypes: (state) => state.barcodeTypes,
};

const actions = {
  getLinehaulList(context, payload) {
    return axios
      .get("/api/linehaul/list", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getLinehaulUIData(context, payload) {
    return axios
      .get("/api/linehaul/ui-data/" + payload.id, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  updateLinehaulUIData(context, payload) {
    return axios.post("/api/linehaul/post", payload).then((res) => res.data);
  },
  deleteLinehaulUIData(context, id) {
    return axios.delete("/api/linehaul/delete/" + id).then((res) => res.data);
  },
  getLinehaulConfig(context, id) {
    if (Object.keys(context.getters.linehaulConfig).length) return;
    return axios
      .get(`/api/linehaul/configuration?client_id=${id}`)
      .then((res) => {
        context.commit("setLineHaulConfig", res.data.data);
        return res.data;
      });
  },
  getLinehaulConfigAddId(context, id) {
    return axios
      .get(`/api/linehaul/configuration?client_id=${id}`)
      .then((res) => {
        context.commit("setLineHaulConfig", res.data.data);
        return res.data;
      });
  },
  getCarrierRestrictions(context, payload) {
    return axios
      .get(
        `/api/linehaul/${payload.linehaul_id}/restriction/${payload.carrier_id}`,
        {
          params: payload.params,
        }
      )
      .then((res) => res.data);
  },
  saveCarrierRestrictions(context, payload) {
    return axios
      .post(
        `/api/linehaul/${payload.linehaul_id}/restriction/${payload.carrier_id}`,
        payload.body
      )
      .then((res) => res.data);
  },
  getCities(context, payload) {
    return axios
      .get(`/api/${payload.countryCode}/cities`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  getPaperFormats(context) {
    if (context.getters.paperFormats.length) return;
    return axios.get(`/api/paper-format/list`).then((res) => {
      context.commit("setPaperFormats", res.data.data);
      return res.data;
    });
  },
  getLabelTypes(context) {
    if (context.getters.labelTypes.length) return;
    return axios.get(`/api/label-type/list`).then((res) => {
      context.commit("setLabelTypes", res.data.data);
      return res.data;
    });
  },
  getBarcodeTypes(context) {
    if (context.getters.barcodeTypes.length) return;
    return axios.get(`/api/barcode/types`).then((res) => {
      context.commit("setBarcodeTypes", res.data.data);
      return res.data;
    });
  },
};

const mutations = {
  setPaperFormats: (state, paperFormats) => {
    state.paperFormats = paperFormats;
  },
  setLabelTypes: (state, labelTypes) => {
    state.labelTypes = labelTypes;
  },
  setBarcodeTypes: (state, barcodeTypes) => {
    state.barcodeTypes = barcodeTypes;
  },
  setLineHaulConfig: (state, linehaulConfig) => {
    state.linehaulConfig = linehaulConfig;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
