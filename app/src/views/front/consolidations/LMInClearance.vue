<!-- #45 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="consolidations"
      :options.sync="options"
      :server-items-length="total"
      :search="search"
      :loading="consolidationsLoader"
      item-key="id"
      show-select
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="3"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6"
              >Package In Clearance</v-toolbar-title
            >
            <p class="pl-4">Search for your package with scans</p>
          </v-col>
          <v-col cols="7" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
          <v-col class="d-flex align-center justify-end pt-0" cols="2">
            <v-btn
              color="primary"
              dark
              class="mr-4 float-right"
              @click="download(selected, true)"
              :loading="downloader"
            >
              Download
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.arrival_date`]="{ item }">
        <template v-if="item.arrival_date">
          {{ item.arrival_date | localMoment | moment("ddd DD MMM, YYYY") }}
        </template>
      </template>
      <template v-slot:[`item.total_pcs`]="{ item }">
        {{ item.total_pcs | numFormat }}
      </template>
      <template v-slot:[`item.total_bags`]="{ item }">
        {{ item.total_bags | numFormat }}
      </template>
      <template v-slot:[`item.total_wgt`]="{ item }">
        {{ item.total_wgt | numFormat }}
      </template>
      <template v-slot:[`item.total_value`]="{ item }">
        {{ item.total_value | numFormat }}
      </template>
      <template v-slot:[`item.splits`]="{ item }">
        {{ item.splits.map((i) => i.code).join() }}
        <v-btn @click="openSplits(item)" icon>
          <v-icon rounded small>mdi-information</v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.service`]="{ item }">
        {{ item.service.map((i) => i.code).join() }}
        <v-btn @click="openServices(item)" icon>
          <v-icon rounded small>mdi-information</v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="download([item], false)"
            >
              mdi-download
            </v-icon>
          </template>
          <span>Download</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog
      v-model="splitsDialog"
      max-width="320"
      @keydown.esc="splitsDialog = false"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5"> Split Codes </v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="(item, i) in editedItem.splits" :key="i">
                  <td>{{ item.code }}</td>
                  <td>{{ item.name }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="splitsDialog = false">
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="servicesDialog"
      max-width="320"
      @keydown.esc="servicesDialog = false"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5"> Services </v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="(item, i) in editedItem.service" :key="i">
                  <td>{{ item.code }}</td>
                  <td>{{ item.name }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="servicesDialog = false">
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import Search from "@/components/front/common/Search";
export default {
  components: {
    Search,
  },
  data: () => ({
    search: "",
    searchType: "origin_country",
    searchOptions: [
      {
        text: "Age",
        value: "age",
      },
      {
        text: "D.City",
        value: "cities",
      },
      {
        text: "Arrival Date",
        value: "arrival_date",
      },
      {
        text: "Value",
        value: "value",
      },
      {
        text: "Splits",
        value: "splits",
      },
      {
        text: "Service",
        value: "service",
      },
    ],
    headers: [
      {
        text: "Origin Country",
        value: "origin_country",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Arrival Date",
        value: "arrival_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Age (days)",
        value: "age",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Pcs",
        value: "total_pcs",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Total Bags",
        value: "total_bags",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Total Wgt",
        value: "total_wgt",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Value (USD)",
        value: "total_value",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Dest. City",
        value: "cities",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Splits",
        value: "splits",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Service",
        value: "service",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
        width: "150px",
      },
    ],
    consolidations: [
      {
        id: 1,
        total_pcs: 3592,
        total_bags: 8,
        total_wgt: 1500,
        total_value: 100000,
        origin_country: "Afghanistan",
        splits: [
          {
            code: "HV",
            name: "High Volume",
          },
          {
            code: "LV",
            name: "Low Volume",
          },
        ],
        service: [
          {
            code: "AF1",
            name: "Airport to Airport",
          },
        ],
        age: "5",
        arrival_date: "2021-10-27",
        cities: ["Dubai"],
      },
      {
        id: 2,
        total_pcs: 50,
        total_bags: 1,
        total_wgt: 2500,
        total_value: 57250,
        origin_country: "Saudi Arabia",
        splits: [
          {
            code: "LV",
            name: "Low Volume",
          },
        ],
        service: [
          {
            code: "AF1",
            name: "Airport to Airport",
          },
        ],
        age: "10",
        arrival_date: "2021-10-27",
        cities: ["Dubai", "Abu Dhabi"],
      },
      {
        id: 3,
        total_pcs: 50,
        total_bags: 1,
        total_wgt: 2500,
        total_value: 57250,
        origin_country: "Saudi Arabia",
        splits: [
          {
            code: "LV",
            name: "Low Volume",
          },
        ],
        service: [
          {
            code: "AF1",
            name: "Airport to Airport",
          },
        ],
        age: "20",
        arrival_date: "2021-10-27",
        cities: ["Dubai", "Delhi"],
      },
    ],
    selected: [],
    options: {},
    total: 2,
    consolidationsLoader: false,
    editedIndex: -1,
    editedItem: {},
    dialog: false,
    downloader: false,
    splitsDialog: false,
    servicesDialog: false,
  }),

  watch: {
    options: {
      handler() {
        this.fetchConsolidations();
      },
      deep: true,
    },
    search() {
      this.fetchConsolidations();
    },
    searchType() {
      if (this.search) this.fetchConsolidations();
    },
  },

  methods: {
    ...mapActions([
      "getAgentConsolidations",
      "downloadAgentNewConsolidation",
      "receiveOAConsolidation",
      "snackBar",
    ]),
    fetchConsolidations() {
      // this.consolidations = [];
      // this.consolidationsLoader = true;
      // this.getAgentConsolidations({
      //   ...this.options,
      //   search: this.search,
      //   type: this.searchType,
      // })
      //   .then((res) => {
      //     this.consolidationsLoader = false;
      //     this.consolidations = res.data.records;
      //     this.total = res.data.total;
      //   })
      //   .catch(() => {
      //     this.consolidationsLoader = false;
      //   });
    },
    openSplits(item) {
      this.editedItem = item;
      this.splitsDialog = true;
    },
    openServices(item) {
      this.editedItem = item;
      this.servicesDialog = true;
    },
    download(items, all) {
      if (!items || items.length === 0) {
        return this.snackBar({
          color: "error",
          message: "Please select at least one record.",
        });
      }
      this.consolidationsLoader = true;
      if (all) this.downloader = true;
      this.receiveOAConsolidation({
        operation_number: items.map((i) => i.operation_number),
      })
        .then((res) => {
          this.consolidationsLoader = false;
          this.downloader = false;
          this.fileDownload(res);
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.consolidationsLoader = false;
          this.downloader = false;
        });
    },
  },
};
</script>
