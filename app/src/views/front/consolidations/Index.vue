<!-- #20 -->
<template>
  <v-col class="mx-4">
    <v-row>
      <v-col md="9" sm="9" xs="12">
        <v-data-table
          :headers="_headers"
          :items="consolidations"
          :options.sync="options"
          :server-items-length="total"
          :loading="consolidationsLoader"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-row class="mt-0">
              <v-col
                cols="10"
                class="d-flex flex-column align-left justify-center pt-0"
              >
                <v-toolbar-title class="pl-4 text-h6"
                  >View Existing Consolidation</v-toolbar-title
                >
              </v-col>
              <v-col cols="2">
                <v-btn
                  color="primary"
                  dark
                  class="mr-4 float-right"
                  @click="goToDetails(0)"
                >
                  Create
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pt-0">
                <Search
                  :search-options="searchOptions"
                  :val="searchType"
                  @changeText="(res) => (search = res)"
                  @changeType="(res) => (searchType = res)"
                />
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.destinations`]="{ item }">
            {{ item.destinations.map((i) => i.code).join() }}
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
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  v-if="item.status !== 'finalize'"
                  @click="goToDetails(item.id)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  v-else
                  @click="goToDetails(item.id, 1)"
                >
                  mdi-dots-horizontal
                </v-icon>
              </template>
              <span>
                {{ item.status !== "finalize" ? "Edit" : "View" }} Consolidation
              </span>
            </v-tooltip>
            <v-tooltip v-if="item.status !== 'finalize'" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  class="mr-2"
                  @click="removeConsolidation(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>Delete Consolidation</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
      <v-col md="3" sm="3" xs="12">
        <v-card>
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title>Status Legend</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <Legends legend-type="consolidation" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <CountryPopup
      :dialog="countryDialog"
      :countries="editedItem.destinations"
      @close="countryDialog = false"
    />
    <ConfirmDialog
      :dialog="dialogDelete"
      text="Are you sure want to delete this consolidation?"
      :loader="deleteLoader"
      @confirm="confirmDelete"
      @close="closeConfirm"
    />
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import CountryPopup from "@/components/front/common/CountryPopup";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";
import Search from "@/components/front/common/Search";
import Legends from "@/components/front/common/Legends";
export default {
  components: {
    Search,
    CountryPopup,
    Legends,
    ConfirmDialog,
  },
  computed: {
    ...mapGetters(["userRole"]),
    _headers() {
      return this.headers.filter((i) =>
        this.userRole.code !== "AD" ? i.value !== "client_name" : true
      );
    },
  },
  data: () => ({
    dialogDelete: false,
    search: "",
    searchType: "consolidation_number",
    searchOptions: [
      {
        text: "Consolidation #",
        value: "consolidation_number",
      },
      {
        text: "Status",
        value: "status",
      },
    ],
    headers: [
      {
        text: "Consolidation",
        value: "consolidation_number",
        class: "body-1 font-weight-bold",
        width: "180px",
      },
      {
        text: "Client Name",
        value: "client_name",
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
        text: "Total Consignments",
        value: "total_consignments",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Total Packages",
        value: "total_packages",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Total Items",
        value: "total_items",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Destinations",
        value: "destinations",
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
    deleteLoader: false,
    editedIndex: -1,
    editedItem: {},
    countryDialog: false,
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
      "getConsolidations",
      "deleteConsolidation",
      "downloadConsolidation",
      "snackBar",
    ]),
    fetchConsolidations() {
      this.consolidations = [];
      this.consolidationsLoader = true;
      this.getConsolidations({
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
    closeConfirm() {
      this.dialogDelete = false;
    },
    confirmDelete() {
      this.deleteLoader = true;
      this.deleteConsolidation(this.editedItem.id)
        .then((res) => {
          this.deleteLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.fetchConsolidations();
          this.closeConfirm();
        })
        .catch(() => {
          this.deleteLoader = false;
        });
    },
    removeConsolidation(item) {
      this.editedIndex = this.consolidations.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    download(item) {
      this.consolidationsLoader = true;
      this.downloadConsolidation(item.id)
        .then((res) => {
          this.fileDownload(res);
          this.consolidationsLoader = false;
        })
        .catch(() => {
          this.consolidationsLoader = false;
        });
    },
    goToDetails(id, r = 0) {
      this.$router.push({
        name: "ConsolidationsDetails",
        params: {
          id,
        },
        query: { r },
      });
    },
    openCountry(item) {
      this.editedItem = item;
      this.countryDialog = true;
    },
  },
};
</script>
