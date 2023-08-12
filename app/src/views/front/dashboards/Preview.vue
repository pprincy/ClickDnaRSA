<template>
  <v-col class="mx-4">
    <p class="text-h6">{{ $route.query.name }}</p>
    <section id="containerx" style="height: 750px" />
  </v-col>
</template>
<script>
import * as pbi from "powerbi-client";
import { mapActions } from "vuex";

export default {
  mounted() {
    this.displayReport();
  },
  methods: {
    ...mapActions(["generatePBIAtoken"]),
    getAccessToken() {},
    async displayReport() {
      const accessToken = await this.generatePBIAtoken();
      const permissions = pbi.models.Permissions.All;
      const config = {
        type: "report",
        tokenType: pbi.models.TokenType.Aad,
        accessToken,
        embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${this.$route.params.id}`,
        id: this.$route.params.id,
        pageView: "fitToWidth",
        permissions: permissions,
      };
      let powerbi = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory
      );
      const dashboardContainer = document.getElementById("containerx");
      const dashboard = powerbi.embed(dashboardContainer, config);
      dashboard.off("loaded");
      dashboard.off("rendered");
      dashboard.on("error", function () {
        this.dashboard.off("error");
      });
    },
  },
};
</script>
