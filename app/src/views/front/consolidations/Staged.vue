<!-- #38 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="consolidations"
      :options.sync="options"
      :server-items-length="total"
      :loading="consolidationsLoader"
      item-key="id"
      show-select
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="4"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">Staged Cargo</v-toolbar-title>
            <p class="pl-4">
              Search for your consolidations from various clients and either
              merge or reconsolidate the content.
            </p>
          </v-col>
          <v-col cols="4" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
          <v-col class="d-flex align-center justify-center pt-0" cols="4">
            <v-btn
              color="success"
              dark
              class="mr-4 float-right"
              @click="merged()"
              :loading="mergeLoader"
            >
              Merge
            </v-btn>
            <v-btn
              color="primary"
              dark
              class="mr-4 float-right"
              @click="openFlightDetails()"
            >
              Confirm On Flight
            </v-btn>
            <FlightDetails
              :dialog="dialog"
              :operation-numbers="selected"
              @close="dialog = false"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.total_packages`]="{ item }">
        {{ item.total_packages | numFormat }}
      </template>
      <template v-slot:[`item.total_bags`]="{ item }">
        {{ item.total_bags | numFormat }}
      </template>
      <template v-slot:[`item.total_weight`]="{ item }">
        {{ item.total_weight | numFormat }}
      </template>
      <template v-slot:[`item.total_value`]="{ item }">
        {{ item.total_value | numFormat }}
      </template>
      <template v-slot:[`item.destination_countries`]="{ item }">
        {{ item.destination_countries.map((i) => i.code).join() }}
        <v-btn @click="openCountry(item)" icon>
          <v-icon rounded small>mdi-information</v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.splits`]="{ item }">
        {{ item.splits.map((i) => i.code).join() }}
        <v-btn @click="openSplits(item)" icon>
          <v-icon rounded small>mdi-information</v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.service_codes`]="{ item }">
        {{ item.service_codes.map((i) => i.code).join() }}
        <v-btn @click="openServices(item)" icon>
          <v-icon rounded small>mdi-information</v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.arrival_date`]="{ item }">
        <template v-if="item.arrival_date">
          {{ item.arrival_date | localMoment | moment("ddd DD MMM, YYYY") }}
        </template>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="download(item)"
            >
              mdi-download
            </v-icon>
          </template>
          <span>Download</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="markUnstaged(item.operation_number)"
            >
              mdi-skip-previous
            </v-icon>
          </template>
          <span>Unstage</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <CountryPopup
      :dialog="countryDialog"
      :countries="editedItem.destination_countries"
      @close="countryDialog = false"
    />
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
                <tr v-for="(item, i) in editedItem.service_codes" :key="i">
                  <td>{{ item.code }}</td>
                  <td>{{ item.description }}</td>
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
import FlightDetails from "./FlightDetails";
import CountryPopup from "@/components/front/common/CountryPopup";
import Search from "@/components/front/common/Search";

export default {
  components: {
    FlightDetails,
    CountryPopup,
    Search,
  },
  data: () => ({
    search: "",
    searchType: "destination_countries",
    searchOptions: [
      {
        text: "D.Country",
        value: "destination_countries",
      },
      {
        text: "Arrival Date",
        value: "arrival_date",
      },
      {
        text: "Type (Decon or Merged)",
        value: "type",
      },
      {
        text: "Age",
        value: "age_days",
      },
      {
        text: "Weight",
        value: "total_weight",
      },
    ],
    headers: [
      {
        text: "Clients",
        value: "clients",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Temp Cons Number",
        value: "operation_number",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Total Pcs",
        value: "total_packages",
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
        value: "total_weight",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Total Value (USD)",
        value: "total_value",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Destinations",
        value: "destination_countries",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Splits",
        value: "splits",
        class: "body-1 font-weight-bold",
        sortable: false,
        width: "120px",
      },
      {
        text: "Service",
        value: "service_codes",
        class: "body-1 font-weight-bold",
        sortable: false,
        width: "100px",
      },
      {
        text: "Arrival Date",
        value: "arrival_date",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Age (days)",
        value: "age_days",
        class: "body-1 font-weight-bold",
        align: "center",
        width: "135px",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
        width: "150px",
      },
    ],
    consolidations: [],
    selected: [],
    options: {},
    total: 0,
    consolidationsLoader: false,
    editedIndex: -1,
    editedItem: {},
    countryDialog: false,
    splitsDialog: false,
    servicesDialog: false,
    dialog: false,
    mergeLoader: false,
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
      "downloadAgentConsolidation",
      "markAsUnStagedCargo",
      "mergeConsolidations",
      "snackBar",
    ]),
    fetchConsolidations() {
      this.consolidations = [];
      this.consolidationsLoader = true;
      this.getAgentConsolidations({
        status: "staged",
        params: {
          ...this.options,
          search: this.search,
          type: this.searchType,
        },
      })
        .then((res) => {
          this.consolidationsLoader = false;
          this.consolidations = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.consolidationsLoader = false;
        });
    },
    download(item) {
      this.consolidationsLoader = true;
      this.downloadAgentConsolidation(item.operation_number)
        .then((res) => {
          this.fileDownload(res);
          this.consolidationsLoader = false;
        })
        .catch(() => {
          this.consolidationsLoader = false;
        });
    },
    openCountry(item) {
      this.editedItem = item;
      this.countryDialog = true;
    },
    openSplits(item) {
      this.editedItem = item;
      this.splitsDialog = true;
    },
    openServices(item) {
      this.editedItem = item;
      this.servicesDialog = true;
    },
    openFlightDetails() {
      if (this.selected.length === 0) {
        return this.snackBar({
          color: "error",
          message: "Please select at least one record.",
        });
      }
      this.dialog = true;
    },
    markUnstaged(operationNumber) {
      this.consolidationsLoader = true;
      this.markAsUnStagedCargo({
        operation_number: [operationNumber],
      })
        .then((res) => {
          this.consolidationsLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.fetchConsolidations();
        })
        .catch(() => {
          this.stagedLoader = false;
          this.consolidationsLoader = false;
        });
    },
    merged() {
      if (this.selected.length < 2) {
        return this.snackBar({
          color: "error",
          message: "Please select at least two records.",
        });
      }
      this.mergeLoader = true;
      this.mergeConsolidations({
        consolidation_number: this.selected.map((i) => i.operation_number),
        type: "deconsolidation",
      })
        .then((res) => {
          this.mergeLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.fetchConsolidations();
        })
        .catch(() => {
          this.mergeLoader = false;
        });
    },
  },
};
</script>
