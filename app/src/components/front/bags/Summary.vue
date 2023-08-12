<template>
  <v-col cols="12" sm="12" xs="12" md="12">
    <v-row>
      <v-col cols="12" md="4" sm="4" xs="12">
        <v-card @click="changeStatus()" :loading="loader">
          <v-card-title class="headline">
            Total
            <v-spacer></v-spacer>
            <v-icon x-large>mdi-database</v-icon>
          </v-card-title>
          <v-card-text class="font-weight-black text-center">
            <p class="text-h4 info--text">{{ counts.total }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="4" xs="12">
        <v-card
          @click="changeStatus('draft,planned,finalized,in_transit,done')"
          :loading="loader"
        >
          <v-card-title class="headline">
            Success
            <v-spacer></v-spacer>
            <v-icon color="green" x-large>mdi-database-arrow-left</v-icon>
          </v-card-title>
          <v-card-text class="font-weight-black text-center green--text">
            <p class="text-h4">{{ counts.success }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="4" xs="12">
        <v-card @click="changeStatus('failed')" :loading="loader">
          <v-card-title class="headline">
            Failed
            <v-spacer></v-spacer>
            <v-icon color="red" x-large>mdi-database-remove-outline</v-icon>
          </v-card-title>
          <v-card-text class="font-weight-black text-center red--text">
            <p class="text-h4">{{ counts.failed }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import { EventBus } from "@/plugins/event-bus";
export default {
  data() {
    return {
      loader: false,
      counts: {},
    };
  },
  created() {
    this.fetchBagDataSummary();
    EventBus.$off("bagCountUpdate");
    EventBus.$on("bagCountUpdate", () => {
      this.fetchBagDataSummary();
    });
  },
  methods: {
    ...mapActions(["getBagDataSummary"]),
    changeStatus(status) {
      EventBus.$emit("bagStatus", status);
    },
    fetchBagDataSummary() {
      this.loader = true;
      this.getBagDataSummary()
        .then((res) => {
          this.loader = false;
          this.counts = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
