<template>
  <v-card elevation="0" class="mb-4">
    <v-card-title>
      Tracking Events
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search Events"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="events"
      :search="search"
      class="elevation-0"
      :loading="loader"
      height="500px"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.is_final_event="{ item }">
        <v-switch v-model="item.is_final_event" disabled></v-switch>
      </template>
      <template v-slot:item.rsa_event_id="{ item }">
        <v-autocomplete
          v-model="item.rsa_event_id"
          :items="trackEvents"
          :loading="loader"
          hide-no-data
          placeholder="Select RSA Event"
          item-key="id"
          item-value="id"
          item-text="event_name"
          @change="updateEvent(item)"
        ></v-autocomplete>
      </template>
    </v-data-table>
    <v-btn class="float-right" color="primary" @click="finish()">
      Finish <v-icon dark right> mdi-checkbox-marked-circle </v-icon>
    </v-btn>
    <v-btn class="float-right" text @click="$emit('update:e1', 3)">
      <v-icon dark left> mdi-arrow-left </v-icon> Back
    </v-btn>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["trackEvents"]),
  },
  data() {
    return {
      search: null,
      headers: [
        {
          text: "Event Title",
          value: "event_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Short Code",
          value: "event_code",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Description",
          value: "summary",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Status",
          value: "event_status",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Is Final Event?",
          value: "is_final_event",
          class: "body-1 font-weight-bold",
        },
        {
          text: "RSA Event",
          value: "rsa_event_id",
          class: "body-1 font-weight-bold",
        },
      ],
      events: [],
      loader: false,
    };
  },
  created() {
    this.getTrackEvents();
    this.fetchCarrierTrackings();
  },
  methods: {
    ...mapActions([
      "getTrackEvents",
      "getCarrierTrackings",
      "updateCarrierTrackingEvent",
      "snackBar",
    ]),
    fetchCarrierTrackings() {
      this.loader = true;
      this.getCarrierTrackings({
        carrierId: this.$route.params.id,
        params: {
          pagination: 0,
        },
      })
        .then((res) => {
          this.loader = false;
          this.events = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    updateEvent(item) {
      this.loader = true;
      this.updateCarrierTrackingEvent({
        carrierId: this.$route.params.id,
        trackingId: item.id,
        data: {
          rsa_tracking_id: item.rsa_event_id,
        },
      })
        .then((res) => {
          this.loader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.loader = false;
        });
    },
    finish() {
      this.$router.replace({
        name: "Carriers",
      });
    },
  },
};
</script>
