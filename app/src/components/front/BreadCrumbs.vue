<template>
  <div class="d-flex align-center justify-space-between" v-if="canDisplay">
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :to="{
            name: item.to,
          }"
          :disabled="!item.to"
          exact
        >
          <span>{{ item.text }}</span>
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <strong class="mr-4">{{ ref }}</strong>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userRole"]),
    canDisplay() {
      return this.$route.name !== "Home";
    },
    breadcrumbs() {
      const breadcrumbs = [
        {
          text: "Home",
          to: "Home",
        },
      ];
      this.$route.meta?.breadcrums?.forEach((route) => {
        breadcrumbs.push(route);
      });
      return breadcrumbs;
    },
    ref() {
      return this.$route.meta?.ref;
    },
  },
};
</script>
