<template>
  <v-main>
    <Sidebar :is-open.sync="isOpen"></Sidebar>
    <v-app-bar app>
      <v-app-bar-nav-icon
        v-show="$vuetify.breakpoint.smAndDown"
        @click="isOpen = !isOpen"
      ></v-app-bar-nav-icon>
      <router-link class="ml-n6" :to="{ name: 'Home' }">
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
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="success"
            v-on="on"
            v-bind="attrs"
            @click="
              $router.push({
                name: 'Help',
              })
            "
            >mdi-help</v-icon
          >
        </template>
        <span>Help</span>
      </v-tooltip>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="primary"
            v-on="on"
            v-bind="attrs"
            @click="
              $router.push({
                name: 'Home',
              })
            "
            >mdi-home</v-icon
          >
        </template>
        <span>Home</span>
      </v-tooltip>
      <ReportBug />
      <v-btn color="primary" @click="logout()" plain>
        <v-icon>mdi-logout</v-icon>Logout
      </v-btn>
    </v-app-bar>
    <BreadCrumbs></BreadCrumbs>
    <v-row>
      <router-view></router-view>
    </v-row>
  </v-main>
</template>
<script>
import Sidebar from "@/components/front/Sidebar";
import BreadCrumbs from "@/components/front/BreadCrumbs";
import ReportBug from "@/components/front/ReportBug";
import { mapMutations } from "vuex";
export default {
  components: {
    Sidebar,
    BreadCrumbs,
    ReportBug,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    ...mapMutations(["resetAuthData"]),
    logout() {
      this.resetAuthData();
      this.$router.replace({ name: "Login" });
    },
  },
};
</script>
<style>
.v-app-bar {
  z-index: 201 !important;
}
</style>
