<template>
  <v-app id="inspire">
    <Sidebar :is-open.sync="isOpen"></Sidebar>
    <v-app-bar app>
      <v-app-bar-nav-icon
        v-show="$vuetify.breakpoint.smAndDown"
        @click="isOpen = !isOpen"
      ></v-app-bar-nav-icon>
      <router-link
        style="height: 40px; width: 175px"
        :to="{ name: 'Dashboard' }"
      >
        <v-img
          src="@/assets/logo.svg"
          alt="RSA Logo"
          aspect-ratio="1"
          title="RSA Logo"
          max-height="40"
          max-width="175"
          class="mx-auto"
          contain
        ></v-img>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="logout()" plain>
        <v-icon>mdi-logout</v-icon> Logout</v-btn
      >
    </v-app-bar>
    <v-main>
      <BreadCrumbs></BreadCrumbs>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from "@/components/admin/Sidebar";
import BreadCrumbs from "@/components/admin/BreadCrumbs";
import { mapMutations } from "vuex";
export default {
  components: {
    Sidebar,
    BreadCrumbs,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    ...mapMutations(["setAdminToken"]),
    logout() {
      this.setAdminToken(null);
      this.$router.replace({ name: "AdminLogin" });
    },
  },
};
</script>
