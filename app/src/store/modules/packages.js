import { axios } from "@/plugins/http-request.js";

const state = {
  packageFields: [],
  manifestHeaders: [],
  manifestObj: {
    fields_ids: [],
    header_ids: [],
    fields_sorting: [],
  },
};

const getters = {
  packageFields: (state) => state.packageFields,
  manifestHeaders: (state) => state.manifestHeaders,
  manifestObj: (state) => state.manifestObj,
};

const actions = {
  getAllPackages(context, payload) {
    return axios
      .get("/api/packages", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getPackageDataTemplate(context, payload) {
    return axios
      .get("/api/package-data/template", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getPackageDataSummary(context, payload) {
    return axios
      .get("/api/packages/stats", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getPackageDetails(context, id) {
    return axios.get("/api/packages/" + id).then((res) => res.data);
  },
  updatePackageDetails(context, payload) {
    return axios
      .patch("/api/package/" + payload.id, payload.data)
      .then((res) => res.data);
  },
  findAllPackages(context, payload) {
    return axios.post("/api/packages/find", payload).then((res) => res.data);
  },
  downloadPackageLabels(context, payload) {
    return axios
      .post(
        `/api/package-label/download/${payload.format}/${payload.size}`,
        payload.data,
        {
          responseType: "blob",
        }
      )
      .then((res) => res);
  },
  getPackageFields(context) {
    if (context.state.packageFields.length) return;
    return axios
      .get("/api/package-column-fields")
      .then((res) => context.commit("setPackageFields", res.data.data));
  },
  getManifestHeaders(context) {
    if (context.state.manifestHeaders.length) return;
    return axios
      .get("/api/manifest-headers")
      .then((res) => context.commit("setManifestHeaders", res.data.data));
  },
  getPackageTemplates() {
    return axios.get("/api/package-column-template").then((res) => res.data);
  },
  createPackageTemplates(context, payload) {
    return axios
      .post("/api/package-column-template", payload)
      .then((res) => res.data);
  },
  updatePackageTemplates(context, payload) {
    return axios
      .patch(`/api/package-column-template/${payload.id}`, payload.data)
      .then((res) => res.data);
  },
  deletePackageTemplates(context, id) {
    return axios
      .delete(`/api/package-column-template/${id}`)
      .then((res) => res.data);
  },
  downloadPackageDataTemplate() {
    return axios
      .get(
        `/assets/app_packages/template/package_data_upload_excel_template.xlsx`,
        {
          responseType: "blob",
        }
      )
      .then((res) => res);
  },
  getManifestSettings(context, payload) {
    return axios
      .get(
        `/api/manifest-template` +
          (payload.user_id ? "/" + payload.user_id : "")
      )
      .then((res) => {
        const data = res.data.data;
        if (!data.fields_ids) {
          data.fields_ids = [];
        }
        if (!data.header_ids) {
          data.header_ids = [];
        }
        if (!data.fields_sorting || data.fields_sorting.length === 0) {
          data.fields_sorting = [{ priority: 1 }];
        }
        if (!data.hours) {
          data.hours = 1;
        }
        context.commit("setManifestObj", data);
        return res.data;
      });
  },
  updateManifestSettings(context, payload) {
    return axios
      .patch("/api/manifest-template", payload)
      .then((res) => res.data);
  },
  downloadSampleManifest(context, id) {
    return axios
      .get(`/api/manifest-template/download${id ? `/${id}` : ""}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  downloadPackageDetails(context, id) {
    return axios
      .get(`/api/package-details/download/${id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  uploadPackageExcel(context, payload) {
    return axios
      .post("/api/package-details/upload", payload)
      .then((res) => res.data);
  },
  downloadManifest(context, payload) {
    return axios
      .post(
        `/api/consolidation-manifest/download/${payload.format}`,
        payload.data,
        {
          responseType: "blob",
        }
      )
      .then((res) => res);
  },
};

const mutations = {
  setPackageFields(state, packageFields) {
    state.packageFields = packageFields;
  },
  setManifestHeaders(state, manifestHeaders) {
    state.manifestHeaders = manifestHeaders;
  },
  setManifestObj(state, manifestObj) {
    state.manifestObj = manifestObj;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
