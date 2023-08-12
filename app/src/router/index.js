import Vue from "vue";
import VueRouter from "vue-router";
import { AdminRoutes } from "./admin";
import { FrontRoutes } from "./front";
import store from "@/store";
import moment from "moment";

Vue.use(VueRouter);

const routes = [...AdminRoutes, ...FrontRoutes];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

function isSignedIn() {
  return store.getters.token;
}

function isAdminSignedIn() {
  return store.getters.adminToken;
}

function refreshAccessToken() {
  if (
    isSignedIn() &&
    moment.utc(store.getters.tokenDate).diff(moment.utc(), "hours") <= 3
  ) {
    store.dispatch("refreshAccessToken");
  }
}

function getPermissions() {
  if (isSignedIn() && store.getters.permissions?.length === 0) {
    store.dispatch("getPermissions");
  }
}

router.beforeEach((to, from, next) => {
  refreshAccessToken();
  getPermissions();
  if (to.meta?.ref && store.getters.screens.length > 0) {
    const isAllowed = store.getters.screens.includes(to.meta.ref);
    if (!isAllowed) {
      store.dispatch("snackBar", {
        color: "error",
        message: "You don't have access to this page",
      });
      return next("/");
    }
  }
  if ((to.name === "Login" || to.name === "SignUp") && isSignedIn()) {
    next({ name: "Home" });
  } else if (to.name === "AdminLogin" && isAdminSignedIn()) {
    next({ name: "Admin" });
  } else if (to.meta.auth) {
    isSignedIn() ? next() : next({ name: "Login" });
  } else if (to.meta.authAdmin) {
    isAdminSignedIn() ? next() : next({ name: "AdminLogin" });
  } else {
    next();
  }
});

export default router;
