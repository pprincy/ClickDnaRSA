import { axios } from "@/plugins/http-request.js";

const state = {
  screens: [],
  permissions: [],
  user: {},
  userRole: {},
  tkn: null,
  tkndt: null,
  atkn: null,
  atkndt: null,
  loader: false,
  userCategory: {},
};

const getters = {
  screens: (state) => state.screens,
  permissions: (state) => state.permissions,
  user: (state) => state.user,
  userRole: (state) => state.userRole,
  token: (state) => state.tkn,
  tokenDate: (state) => state.tkndt,
  adminToken: (state) => state.atkn,
  adminTokenDate: (state) => state.atkndt,
  userCategory: (state) => state.userCategory,
};

const actions = {
  doLogin(context, payload) {
    return axios.post("/api/authenticate", payload).then((res) => res.data);
  },
  refreshAccessToken({ commit }, payload) {
    axios.post("/api/refresh-token", payload).then((res) => {
      commit("setUserToken", res.data.data.token);
      commit("setUserTokenDate", res.data.data.expire_at);
    });
  },
  doSignUp(context, payload) {
    return axios.post("/api/customer/signup", payload).then((res) => res.data);
  },
  doAdminLogin(context, payload) {
    return axios.post("/api/admin/login", payload).then((res) => res.data);
  },
  getPermissions(context, payload) {
    return axios.get("/api/user/permissions", payload).then((res) => {
      context.commit("setPermissions", res.data.data.access_rights.permissions);
      context.commit("setScreens", res.data.data.access_rights.screens);
      context.commit("setUserRole", res.data.data.access_rights.role);
      context.commit("setUserCategory", res.data.data);
    });
  },
  changePassword(context, payload) {
    return axios
      .post("/api/user/change-password", payload)
      .then((res) => res.data);
  },
  resetPassword(context, payload) {
    return axios
      .post("/api/user/reset-new-password", payload)
      .then((res) => res.data);
  },
  forgotPassword(context, payload) {
    return axios
      .post("/api/user/password-reset", payload)
      .then((res) => res.data);
  },
};

const mutations = {
  setUser: (state, user) => {
    state.user = user;
  },
  setUserToken: (state, token) => {
    state.tkn = token;
  },
  setUserTokenDate: (state, tokenDate) => {
    state.tkndt = tokenDate;
  },
  setAdminToken: (state, adminToken) => {
    state.atkn = adminToken;
  },
  setAdminTokenDate: (state, adminTokenDate) => {
    state.atkndt = adminTokenDate;
  },
  setLoader: (state, loader) => {
    state.loader = loader;
  },
  setPermissions: (state, permissions) => {
    state.permissions = permissions;
  },
  setScreens: (state, screens) => {
    state.screens = screens;
  },
  setUserRole: (state, userRole) => {
    state.userRole = userRole;
  },
  setUserCategory: (state, userCategory) => {
    state.userCategory = userCategory;
  },
  resetAuthData: (state) => {
    state.screens = [];
    state.permissions = [];
    state.user = {};
    state.userRole = {};
    state.tkn = null;
    state.tkndt = null;
    state.atkn = null;
    state.atkndt = null;
    state.loader = false;
    state.userCategory = {};
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
