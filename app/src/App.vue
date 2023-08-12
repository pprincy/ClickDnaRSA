<template>
  <v-app>
    <v-snackbar
      top
      right
      v-model="snackbar.active"
      :timeout="5000"
      :color="snackbar.color"
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.active = false"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
    <router-view />
  </v-app>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      snackbar: (state) => state.general.snackbar,
    }),
  },
};
</script>
<style lang="scss">
@media print {
  @page {
    margin: 1.6cm 0 1.6cm 0;
  }
  body * {
    visibility: hidden;
  }
}
@import "./scss/main.scss";
</style>
