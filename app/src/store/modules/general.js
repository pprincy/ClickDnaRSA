import { axios } from "@/plugins/http-request.js";

const state = {
  snackbar: { active: false, color: "", message: "" },
  currencyList: [],
  handlingCodeList: [],
  hsCodeList: [],
  clientAddressList: [],
  systemTypes: [],
  bagTypes: [],
  packageTypes: [],
  bagMixes: [],
  serviceCodes: [],
  airportCodes: [],
  trackCategories: [],
  trackEvents: [],
  sellerStatuses: [],
};

const getters = {
  currencyList: (state) => state.currencyList,
  handlingCodeList: (state) => state.handlingCodeList,
  hsCodeList: (state) => state.hsCodeList,
  clientAddressList: (state) => state.clientAddressList,
  systemTypes: (state) => state.systemTypes,
  bagTypes: (state) => state.bagTypes,
  packageTypes: (state) => state.packageTypes,
  bagMixes: (state) => state.bagMixes,
  serviceCodes: (state) => state.serviceCodes,
  airportCodes: (state) => state.airportCodes,
  trackCategories: (state) => state.trackCategories,
  trackEvents: (state) => state.trackEvents,
  sellerStatuses: (state) => state.sellerStatuses,
};

const actions = {
  snackBar({ commit }, data) {
    commit("setSnackbar", {
      active: true,
      color: data.color ? data.color : "success",
      message: data.message,
    });
  },
  getCurrencyList(context, payload) {
    if (context.state.currencyList.length === 0) {
      return axios.get("/api/currencies", payload).then((res) => {
        context.commit("setCurrencyList", res.data.data);
      });
    }
  },
  getHandlingCodeList(context, payload) {
    if (context.state.handlingCodeList.length === 0) {
      return axios.get("/api/special-handling", payload).then((res) => {
        context.commit("setHandlingCodeList", res.data.data);
      });
    }
  },
  getHSCodeList(context, payload) {
    if (context.state.hsCodeList.length === 0) {
      return axios.get("/api/hs-code", payload).then((res) => {
        context.commit("setHSCodeList", res.data.data);
      });
    }
  },
  getClientAddressList(context, payload) {
    if (context.state.clientAddressList.length === 0) {
      return axios
        .get("/api/client-address/name-get", {
          params: payload,
        })
        .then((res) => {
          context.commit("setClientAddressList", res.data.data);
        });
    }
  },
  getTrackingRangeSystemType(context) {
    if (context.state.systemTypes.length) return;
    return axios
      .get("/api/tracking-range-system-type/name-get")
      .then((res) => context.commit("setSystemTypes", res.data.data));
  },
  getTrackingRangeBagType(context) {
    if (context.state.bagTypes.length) return;
    return axios
      .get("/api/system/lists/bag/types")
      .then((res) => context.commit("setBagTypes", res.data.data));
  },
  getBagMixes(context) {
    if (context.state.bagMixes.length) return;
    return axios
      .get("/api/system/lists/bag/mixture")
      .then((res) => context.commit("setBagMixes", res.data.data));
  },
  getPackageTypes(context) {
    if (context.state.packageTypes.length) return;
    return axios
      .get("/api/package-type")
      .then((res) => context.commit("setPackageTypes", res.data.data));
  },
  getServiceCodes(context) {
    if (context.state.serviceCodes.length) return;
    return axios
      .get("/api/service-code/name-get")
      .then((res) => context.commit("setServiceCodes", res.data.data));
  },
  getAirportCodes(context) {
    if (context.state.airportCodes.length) return;
    return axios
      .get("/api/airport-codes/list")
      .then((res) => context.commit("setAirportCodes", res.data.data));
  },
  getCountryAirPorts(context, country_code) {
    return axios
      .get(`/api/${country_code}/country-airports`, {
        params: { country_code },
      })
      .then((res) => res.data);
  },
  getCountryPorts(context, countryCode) {
    return axios
      .get(`/api/${countryCode}/country-ports`)
      .then((res) => res.data);
  },
  getTrackCategories(context) {
    if (context.state.trackCategories.length) return;
    return axios
      .get("/api/tracking-events/category")
      .then((res) => context.commit("setTrackCategories", res.data.data));
  },
  getTrackEvents(context) {
    if (context.state.trackEvents.length) return;
    return axios
      .get("/api/tracking-events")
      .then((res) => context.commit("setTrackEvents", res.data.data));
  },
  reportBug(context, payload) {
    return axios
      .post("api/azure-devops/bug-report", payload)
      .then((res) => res.data);
  },
  getSellerStatuses(context) {
    if (context.state.sellerStatuses.length) return;
    return axios
      .get("/api/sellers/statuses")
      .then((res) => context.commit("setSellerStatuses", res.data.data));
  },
};

const mutations = {
  setSnackbar(state, snackbar) {
    state.snackbar = snackbar;
  },
  setCurrencyList(state, currencyList) {
    state.currencyList = currencyList;
  },
  setHandlingCodeList(state, handlingCodeList) {
    state.handlingCodeList = handlingCodeList;
  },
  setHSCodeList(state, hsCodeList) {
    state.hsCodeList = hsCodeList;
  },
  setClientAddressList(state, clientAddressList) {
    state.clientAddressList = clientAddressList;
  },
  setSystemTypes: (state, systemTypes) => {
    state.systemTypes = systemTypes;
  },
  setBagTypes: (state, bagTypes) => {
    state.bagTypes = bagTypes;
  },
  setBagMixes: (state, bagMixes) => {
    state.bagMixes = bagMixes;
  },
  setServiceCodes: (state, serviceCodes) => {
    state.serviceCodes = serviceCodes;
  },
  setPackageTypes: (state, packageTypes) => {
    state.packageTypes = packageTypes;
  },
  setAirportCodes: (state, airportCodes) => {
    state.airportCodes = airportCodes;
  },
  setTrackCategories: (state, trackCategories) => {
    state.trackCategories = trackCategories;
  },
  setTrackEvents: (state, trackEvents) => {
    state.trackEvents = trackEvents;
  },
  setSellerStatuses: (state, sellerStatuses) => {
    state.sellerStatuses = sellerStatuses;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
