<template>
  <v-col>
    <v-row>
      <v-col cols="12" md="9" sm="7" xs="12">
        <v-data-table
          :headers="headers"
          :items="consolidationObj.bags"
          :search="search"
          :loading="bagsLoader"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:top>
            <v-row class="pb-6">
              <v-col
                cols="12"
                class="d-flex flex-column align-center justify-center py-0"
              >
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  class="w-90"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              :disabled="+$route.query.r === 1"
              @click="removeItem(item)"
              icon
              text
              small
            >
              <v-icon class="mr-2"> mdi-close </v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <v-divider class="mt-4"></v-divider>
        <v-card class="mt-8">
          <v-row class="my-8 mx-4">
            <v-col cols="12">
              <p class="body-1 font-weight-bold">
                If you are going to request RSA to collect the package, be sure
                to select the correct facility, date & time the consolidation is
                ready.
              </p>
            </v-col>
            <v-col>
              <p class="body-2 ma-0">Collection Method</p>
              <v-row>
                <v-col md="6" sm="12">
                  <v-radio-group
                    row
                    class="mt-2"
                    :disabled="+$route.query.r === 1"
                    v-model="consolidationObj.collection_method"
                  >
                    <v-radio
                      v-for="(n, i) in collectionOptions"
                      :key="i"
                      :label="n.text"
                      :value="n.value"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                  v-if="consolidationObj.collection_method === 'collection'"
                >
                  <v-autocomplete
                    label="Facility"
                    :items="clientAddressList"
                    item-key="id"
                    item-value="id"
                    item-text="company_name"
                    v-model="consolidationObj.address_id"
                    :disabled="+$route.query.r === 1"
                  ></v-autocomplete>
                </v-col>
                <v-col md="6" sm="12">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    :disabled="+$route.query.r === 1"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="getFormattedDate(consolidationObj.ready_date)"
                        :rules="[(v) => !!v || 'Date is required']"
                        placeholder="ddd DD MMM, YYYY"
                        append-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :disabled="+$route.query.r === 1"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="consolidationObj.ready_date"
                      @input="dateMenu = false"
                      :min="new Date().toISOString()"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col md="6" sm="12">
                  <v-text-field
                    v-model="consolidationObj.ready_time"
                    :rules="[
                      (v) =>
                        /^([01]\d|2[0-3]):([0-5]\d)$/.test(v) ||
                        'Time format must be valid',
                    ]"
                    placeholder="HH:MM"
                    label="Time"
                    append-icon="mdi-clock-time-four-outline"
                    @input="timeInput(consolidationObj, 'ready_time')"
                    :disabled="+$route.query.r === 1"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="5" xs="12">
        <v-card class="text-center">
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title class="mx-auto"
              >Summary of Consolidation</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Bags</v-list-item-title>
                <v-list-item-subtitle class="text-h6">{{
                  +consolidationObj.total_bags
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Consignments</v-list-item-title>
                <v-list-item-subtitle class="text-h6">{{
                  +consolidationObj.total_consignments
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Packages</v-list-item-title>
                <v-list-item-subtitle class="text-h6">{{
                  +consolidationObj.total_packages
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold"
                  >Total Consignments by Destination</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="(item, i) in consolidationObj.delivery_consignment_count"
              :key="i"
              two-line
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.country_name }}</v-list-item-title>
                <v-list-item-subtitle class="text-h6">{{
                  item.total_value
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["clientAddressList", "consolidationObj"]),
  },
  data() {
    return {
      headers: [
        {
          text: "Actions",
          value: "actions",
          class: "body-1 font-weight-bold",
          width: "100px",
          sortable: false,
        },
        {
          text: "Bag Number",
          value: "bag_number",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Bag Type",
          value: "bag_type",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Origin Airport",
          value: "origin_airport",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Dest. Airport",
          value: "destination_airport",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Service",
          value: "service_code",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Wgt",
          value: "weight",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Pcs",
          value: "pieces",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Value (USD)",
          value: "value",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Status",
          value: "status",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Created At",
          value: "created_at",
          class: "body-1 font-weight-bold",
        },
      ],
      total: 0,
      bagsLoader: false,
      search: null,
      options: {},
      timerId: null,
      searchType: null,
      collectionOptions: [
        {
          text: "Drop-off to Agent",
          value: "drop_off_to_agent",
        },
        {
          text: "Collection",
          value: "collection",
        },
      ],
      dateMenu: false,
    };
  },
  created() {
    this.getClientAddressList();
  },
  methods: {
    ...mapActions(["getClientAddressList"]),
    removeItem(item) {
      this.consolidationObj.bags.splice(
        this.consolidationObj.bags.findIndex((i) => i.id === item.id),
        1
      );
    },
  },
};
</script>
