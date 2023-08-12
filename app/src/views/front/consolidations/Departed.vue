<!-- #48 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="consolidations"
      :options.sync="options"
      :server-items-length="total"
      :loading="consolidationsLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col cols="2" class="d-flex flex-column justify-center pt-0">
            <v-toolbar-title class="pl-4 text-h6">Departed</v-toolbar-title>
          </v-col>
          <v-col class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
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
      <template v-slot:[`item.departure_date`]="{ item }">
        <template v-if="item.departure_date">
          {{ item.departure_date | localMoment | moment("ddd DD MMM, YYYY") }}
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
      @keydown.esc="servicesDialog = false"
      max-width="320"
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
import CountryPopup from "@/components/front/common/CountryPopup";
import Search from "@/components/front/common/Search";

export default {
  components: {
    CountryPopup,
    Search,
  },
  data: () => ({
    search: "",
    searchType: "d_country",
    searchOptions: [
      {
        text: "D.Country",
        value: "d_country",
      },
      {
        text: "Departure Date",
        value: "departure_date",
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
      },
      {
        text: "Service",
        value: "service_codes",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Flight Number",
        value: "flight_number",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Departure Date",
        value: "departure_date",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Age (days)",
        value: "age_days",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Status",
        value: "status",
        class: "body-1 font-weight-bold",
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
    options: {},
    total: 0,
    consolidationsLoader: false,
    editedItem: {},
    countryDialog: false,
    splitsDialog: false,
    servicesDialog: false,
    dialog: false,
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
      "snackBar",
    ]),
    fetchConsolidations() {
      this.consolidations = [];
      this.consolidationsLoader = true;
      this.getAgentConsolidations({
        status: "departed",
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
  },
};
</script>
