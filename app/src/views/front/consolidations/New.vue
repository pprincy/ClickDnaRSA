<!-- #35 -->
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
            <v-toolbar-title class="pl-4 text-h6"
              >New Consolidation</v-toolbar-title
            >
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
              color="primary"
              dark
              class="mr-4 float-right"
              @click="receiveAll(selected, true)"
              :loading="receiveLoader"
            >
              Receive
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
              type="consolidation"
              @refresh="refresh()"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.destination_country`]="{ item }">
        {{ item.destination_country.map((i) => i.code).join() }}
        <v-btn @click="openCountry(item)" icon>
          <v-icon rounded small>mdi-information</v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.ready_date`]="{ item }">
        <template v-if="item.ready_date">
          {{ item.ready_date | localMoment | moment("ddd DD MMM, YYYY") }}
        </template>
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
        <v-tooltip v-if="!item.receiving_flag" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              color="success"
              v-bind="attrs"
              v-on="on"
              @click="receiveAll([item], false)"
            >
              mdi-check
            </v-icon>
          </template>
          <span>Receive</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <CountryPopup
      :dialog="dialog"
      :countries="editedItem.destination_country"
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
    Decons,
    CountryPopup,
    Search,
  },
  data: () => ({
    search: "",
    searchType: "destination_country",
    searchOptions: [
      {
        text: "D.Country",
        value: "destination_country",
      },
      {
        text: "Client",
        value: "client_name",
      },
      {
        text: "Collection Date",
        value: "ready_date",
      },
    ],
    headers: [
      {
        text: "Client Name",
        value: "client_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Cons Number",
        value: "consolidation_number",
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
        value: "total_bag",
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
        value: "destination_country",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Collection Date",
        value: "ready_date",
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
    total: 2,
    consolidationsLoader: false,
    editedIndex: -1,
    editedItem: {},
    dialog: false,
    receiveLoader: false,
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
      "getAgentNewConsolidations",
      "mergeConsolidations",
      "downloadAgentNewConsolidation",
      "receiveOAConsolidation",
      "snackBar",
    ]),
    fetchConsolidations() {
      this.consolidations = [];
      this.consolidationsLoader = true;
      this.getAgentNewConsolidations({
        ...this.options,
        search: this.search,
        type: this.searchType,
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
      this.downloadAgentNewConsolidation(item.id)
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
    receiveAll(items, all) {
      if (!items || items.length === 0) {
        return this.snackBar({
          color: "error",
          message: "Please select at least one record.",
        });
      }
      this.consolidationsLoader = true;
      if (all) this.receiveLoader = true;
      this.receiveOAConsolidation({
        consolidation_number: items.map((i) => i.consolidation_number),
      })
        .then((res) => {
          this.consolidationsLoader = false;
          this.receiveLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.fetchConsolidations();
        })
        .catch(() => {
          this.consolidationsLoader = false;
          this.receiveLoader = false;
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
        consolidation_number: this.selected.map((i) => i.consolidation_number),
        type: "consolidation",
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
