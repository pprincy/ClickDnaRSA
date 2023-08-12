import { axios } from "@/plugins/http-request.js";

const state = {
  countries: [],
};

const getters = {
  countries: (state) => state.countries,
};

const actions = {
  getCountries(context, payload) {
    return axios
      .get("/api/countries", {
        params: payload,
      })
      .then((res) => res.data);
  },
};

const mutations = {
  setCountries: (state, countries) => {
    state.countries = countries;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
