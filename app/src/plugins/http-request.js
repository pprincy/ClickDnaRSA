import Axios from "axios";
import router from "@/router/index";
import store from "@/store";

const axios = Axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

axios.interceptors.request.use(
  (config) => {
    const headers = {
      "Ocp-apim-subscription-key": process.env.VUE_APP_SUBSCRIPTION_KEY,
      CLICKDNAENV: process.env.VUE_APP_CLICKDNAENV,
    };

    if (
      store.getters.token &&
      !router.currentRoute.path.startsWith("/clickdna-admin")
    ) {
      headers["Authorization"] = "Bearer " + store.getters.token;
    }
    if (
      store.getters.adminToken &&
      router.currentRoute.path.startsWith("/clickdna-admin")
    ) {
      headers["Authorization"] = "Bearer " + store.getters.adminToken;
    }
    config.headers = headers;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      router.currentRoute.name !== "Login" &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      store.commit("setUserToken", null);
      store.commit("setUserTokenDate", null);
      return router
        .replace({
          name: "Login",
        })
        .catch(() => {});
    }
    let errorData = error.response.data;
    if (
      error.request.responseType === "blob" &&
      error.response.data instanceof Blob &&
      error.response.data.type &&
      error.response.data.type.toLowerCase().indexOf("json") != -1
    ) {
      errorData = JSON.parse(await error.response.data.text());
    }

    console.log({ errorData });
    let message;
    if (
      errorData.errors &&
      errorData.errors[0] &&
      errorData.errors[0].message
    ) {
      message = errorData.errors[0].message;
    } else if (errorData.data && errorData.data.message) {
      message = errorData.data.message;
    } else {
      message = errorData.message;
    }
    store.dispatch("snackBar", {
      color: "error",
      message: message,
    });
    return Promise.reject(errorData);
  }
);

export { axios };
