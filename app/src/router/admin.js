export const AdminRoutes = [
  {
    path: "/clickdna-admin/login",
    name: "AdminLogin",
    component: () =>
      import(
        /* webpackChunkName: "admin-login" */ "@/views/admin/AdminLogin.vue"
      ),
  },
  {
    path: "/clickdna-admin",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/admin/AdminLayout.vue"),
    meta: {
      authAdmin: true,
    },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "@/views/admin/Dashboard.vue"
          ),
        meta: {
          authAdmin: true,
        },
      },
    ],
  },
];
