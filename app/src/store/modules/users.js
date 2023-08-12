import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getScreens(context, payload) {
    return axios
      .get("/api/member-admin/screens", {
        params: payload,
      })
      .then((res) => res.data);
  },
  // getScreens() {
  //   return axios
  //     .get(`/api/member-admin/group/name-get`)
  //     .then((res) => res.data);
  // },
  getMemberGroups(context, payload) {
    return axios
      .get("/api/member-admin/group", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getMemberGroupDetails(context, id) {
    return axios.get(`/api/member-admin/group/${id}`).then((res) => res.data);
  },
  createMemberGroup(context, payload) {
    return axios
      .post("/api/member-admin/group", payload)
      .then((res) => res.data);
  },
  updateMemberGroup(context, payload) {
    return axios
      .patch("/api/member-admin/group/" + payload.id, payload.data)
      .then((res) => res.data);
  },
  deleteMemberGroup(context, id) {
    return axios
      .delete("/api/member-admin/group/" + id)
      .then((res) => res.data);
  },
  changeMemberGroupStatus(context, payload) {
    return axios
      .patch(
        "/api/member-admin/group/action/action_mark_" + payload.action,
        payload.data
      )
      .then((res) => res.data);
  },
  getGroups(context, payload) {
    return axios
      .get("/api/member-admin/group/name-get", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getMembers(context, payload) {
    return axios
      .get("/api/member-admin/user", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getMemberDetails(context, id) {
    return axios.get(`/api/member-admin/user/${id}`).then((res) => res.data);
  },
  createMember(context, payload) {
    return axios
      .post("/api/member-admin/user", payload)
      .then((res) => res.data);
  },
  updateMember(context, payload) {
    return axios
      .patch("/api/member-admin/user/" + payload.id, payload.data)
      .then((res) => res.data);
  },
  deleteMember(context, id) {
    return axios.delete("/api/member-admin/user/" + id).then((res) => res.data);
  },
  changeMemberStatus(context, payload) {
    return axios
      .patch(
        "/api/member-admin/user/action/action_mark_" + payload.action,
        payload.data
      )
      .then((res) => res.data);
  },
  getClientAddresses(context, payload) {
    return axios
      .get("/api/client-address", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getClientAddress(context, id) {
    return axios.get("/api/client-address/" + id).then((res) => res.data);
  },
  deleteClientAddress(context, id) {
    return axios.delete("/api/client-address/" + id).then((res) => res.data);
  },
  createClientAddress(context, payload) {
    return axios.post("/api/client-address", payload).then((res) => res.data);
  },
  updateClientAddress(context, payload) {
    return axios
      .patch("/api/client-address/" + payload.id, payload.data)
      .then((res) => res.data);
  },
  getAlertSettings() {
    return axios.get("/api/carrier-alert-settings").then((res) => res.data);
  },
  updateAlertSettings(context, payload) {
    return axios
      .patch("/api/carrier-alert-settings", payload)
      .then((res) => res.data);
  },
  getClients(context, payload) {
    return axios
      .get("/api/clients", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getClient(context, id) {
    return axios.get("/api/clients/" + id).then((res) => res.data);
  },
  deleteClient(context, id) {
    return axios.delete("/api/clients/" + id).then((res) => res.data);
  },
  createClient(context, payload) {
    return axios.post("/api/clients", payload).then((res) => res.data);
  },
  updateClient(context, payload) {
    return axios
      .patch("/api/clients/" + payload.id, payload.data)
      .then((res) => res.data);
  },
  sendClientInvite(context, payload) {
    return axios
      .patch("/api/clients/action/action_send_invite", payload)
      .then((res) => res.data);
  },
  sendUserInvite(context, payload) {
    return axios
      .patch("/api/member-admin/user/action/action_send_invite", payload)
      .then((res) => res.data);
  },
  getUserCategoryScreen() {
    return axios.get(`/api/user-category-screen`).then((res) => res.data);
  },
  saveUserCategoryScreen(_, payload) {
    return axios
      .post(`/api/user-category-screen`, payload)
      .then((res) => res.data);
  },

  // getSellers(_, payload) {
  //   return axios
  //     .get(`/api/seller/seller-active-list/${payload.client_id}`, {
  //       params: payload.params,
  //     })
  //     .then((res) => res.data);
  // },

  getSellersActiveList(context, payload) {
    return axios
      .get(`/api/seller/seller-active-list`, {
        params: payload,
      })
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
