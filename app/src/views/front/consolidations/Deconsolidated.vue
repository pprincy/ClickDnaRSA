<!-- #36 -->
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
            cols="3"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6"
              >Deconsolidated</v-toolbar-title
            >
          </v-col>
          <v-col cols="4" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
          <v-col class="d-flex align-center justify-end pt-0" cols="5">
            <v-btn
              color="primary"
              dark
              class="mr-4 float-right"
              :loading="stagedLoader"
              @click="markStaged(selected, true)"
            >
              Mark as Staged
            </v-btn>
            <v-btn
              color="success"
              dark
              class="mr-4 float-right"
              @click="merged()"
              :loading="mergeLoader"
            >
              Merge
            </v-btn>
            <Decons
              :operation-numbers="selected"
              type="deconsolidation"
              @refresh="refresh()"
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
      <template v-slot:[`item.total_value`]="{ item }">
        {{ item.total_value | numFormat }}
      </template>
      <template v-slot:[`item.arrival_date`]="{ item }">
        <template v-if="item.arrival_date">
          {{ item.arrival_date | localMoment | moment("ddd DD MMM, YYYY") }}
        </template>
      </template>
      <template v-slot:[`item.destination_countries`]="{ item }">
        {{ item.destination_countries.map((i) => i.code).join() }}
        <v-btn @click="openCountry(item)" icon>
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
              v-bind="attrs"
              v-on="on"
              @click="markStaged([item], false)"
            >
              mdi-skip-next
            </v-icon>
          </template>
          <span>Mark as Staged</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <CountryPopup
      :dialog="dialog"
      :countries="editedItem.destination_countries"
      @close="dialog = false"
    />
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import Decons from "./Decons";
import CountryPopup from "@/components/front/common/CountryPopup";
import Search from "@/components/front/common/Search";
export default {
  components: {
    CountryPopup,
    Decons,
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
        text: "Client",
        value: "clients",
      },
      {
        text: "Arrival Date",
        value: "arrival_date",
      },
    ],
    headers: [
      {
        text: "Client Name",
        value: "clients",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Cons Number",
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
        text: "Value (USD)",
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
        text: "Arrival Date",
        value: "arrival_date",
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
    selected: [],
    options: {},
    total: 0,
    consolidationsLoader: false,
    editedIndex: -1,
    editedItem: {},
    dialog: false,
    stagedLoader: false,
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
      "markAsStagedCargo",
      "downloadAgentConsolidation",
      "mergeConsolidations",
      "snackBar",
    ]),
    fetchConsolidations() {
      this.consolidations = [];
      this.consolidationsLoader = true;
      this.getAgentConsolidations({
        status: "deconsolidated",
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
    refresh() {
      this.selected = [];
      this.fetchConsolidations();
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
      this.dialog = true;
    },
    markStaged(items, all) {
      if (items.length === 0) {
        return this.snackBar({
          color: "error",
          message: "Please select atleast one record",
        });
      }
      this.consolidationsLoader = true;
      if (all) this.stagedLoader = true;
      this.markAsStagedCargo({
        operation_number: items.map((i) => i.operation_number),
      })
        .then((res) => {
          this.stagedLoader = false;
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
