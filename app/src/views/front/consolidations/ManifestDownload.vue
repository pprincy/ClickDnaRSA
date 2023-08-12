<!-- #26 -->
<template>
  <v-col class="mx-4">
    <p class="pl-4 pb-0 text-h6">
      Download the manifest file for a consolidation
    </p>
    <p class="pl-4">
      This screen will show consolidations that have been manifiested by the
      origin agent. Consolidations that have not been manifest, but physically
      dispatch are not shown here. Please select your manifest options
      carefully.
    </p>
    <v-row>
      <v-col md="9" sm="9" xs="12">
        <v-data-table
          v-model="selectedConsolidations"
          :headers="headers"
          :items="consolidations"
          :options.sync="options"
          :server-items-length="total"
          :loading="consolidationsLoader"
          show-select
        >
          <template v-slot:top>
            <v-expansion-panels v-model="panel">
              <v-expansion-panel>
                <v-expansion-panel-header
                  class="white--text font-weight-bold"
                  color="primary"
                  dense
                >
                  Download Settings
                  <template v-slot:actions>
                    <v-icon color="white"> $expand </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col class="py-0">
                      <p class="pt-5"><strong>File Format</strong></p>
                      <v-radio-group v-model="selectedFormat" mandatory>
                        <v-radio label="CSV" value="csv"></v-radio>
                        <v-radio label="Excel" value="excel"></v-radio>
                        <v-radio label="PDF" value="pdf"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col class="py-0" v-if="selectedFormat === 'pdf'">
                      <p class="pt-5"><strong>Paper Size</strong></p>
                      <v-radio-group v-model="selectedSize" mandatory>
                        <v-radio label="A4" value="A4"></v-radio>
                        <v-radio label="A3" value="A3"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col class="py-0" v-if="selectedFormat === 'excel'">
                      <p class="pt-5">
                        <strong>Flight Details Shown In</strong>
                      </p>
                      <v-radio-group v-model="flightDetailShownIn" mandatory>
                        <v-radio label="Header" value="header"></v-radio>
                        <v-radio label="Body" value="body"></v-radio>
                        <v-radio
                          label="Separate Sheet"
                          value="separate_sheet"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col class="py-0">
                      <p class="pt-5">
                        <strong>Consolidation Summary</strong>
                      </p>
                      <v-radio-group v-model="consSummary" mandatory>
                        <v-radio label="Include" value="include"></v-radio>
                        <v-radio label="Exclude" value="exclude"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <PackageTemplate ref="pitemplate" />
                    <v-col class="py-0">
                      <p class="pt-5"><strong>Manifest Currency</strong></p>
                      <v-autocomplete
                        :items="currencyList"
                        item-key="id"
                        item-value="name"
                        item-text="name"
                        :loading="currencyList.length === 0"
                        v-model="manifestCurrency"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-row class="pb-10 pt-10">
              <v-col class="py-0">
                <Search
                  :search-options="searchOptions"
                  :val="searchType"
                  @changeText="(res) => (search = res)"
                  @changeType="(res) => (searchType = res)"
                />
              </v-col>
              <v-col>
                <v-btn
                  color="primary"
                  class="float-right"
                  :loading="downloader"
                  @click="download()"
                  >Download</v-btn
                >
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.destinations`]="{ item }">
            {{ item.destinations.map((i) => i.code).join() }}
            <v-btn @click="openCountry(item)" icon>
              <v-icon rounded small>mdi-information</v-icon>
            </v-btn>
          </template>
          <template v-slot:[`item.flight_details`]="{ item }">
            <v-data-table
              dense
              :headers="fltHeaders"
              :items="item.flight_details"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:[`item.departure_date`]="{ item }">
                {{ item.departure_date | moment("DD MMM, YYYY") }}
              </template>
            </v-data-table>
          </template>
        </v-data-table>
        <CountryPopup
          :dialog="countryDialog"
          :countries="editedItem.destinations"
          @close="countryDialog = false"
        />
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
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import PackageTemplate from "./PackageTemplate";
import Search from "@/components/front/common/Search";
import CountryPopup from "@/components/front/common/CountryPopup";
import Legends from "@/components/front/common/Legends";

export default {
  components: {
    PackageTemplate,
    Search,
    CountryPopup,
    Legends,
  },
  computed: {
    ...mapGetters(["currencyList"]),
  },
  data() {
    return {
      consolidations: [],
      selectedConsolidations: [],
      headers: [
        {
          text: "Client Consolidation #",
          value: "consolidation_number",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Flight Details",
          value: "flight_details",
          class: "body-1 font-weight-bold",
          sortable: false,
          align: "center",
        },
        {
          text: "Total Bags",
          value: "total_bags",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Total Consignments",
          value: "total_consignments",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Total Packages",
          value: "total_packages",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Total Items",
          value: "total_items",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Destinations",
          value: "destinations",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Total Value (USD)",
          value: "total_value",
          class: "body-1 font-weight-bold",
        },
      ],
      fltHeaders: [
        {
          text: "Flight Number",
          value: "flight_number",
        },
        {
          text: "Departure Date",
          value: "departure_date",
          width: "140px",
        },
        {
          text: "Departure Time",
          value: "departure_time",
        },
        {
          text: "D.Airport",
          value: "destination_airport",
        },
      ],
      searchOptions: [
        {
          text: "Client Consolidation #",
          value: "consolidation_number",
        },
        {
          text: "Flight Number",
          value: "flight_number",
        },
        {
          text: "Departure Date",
          value: "d_date",
        },
        {
          text: "Dest.",
          value: "destination",
        },
        {
          text: "Total Bags",
          value: "total_bags",
        },
      ],
      total: 0,
      consolidationsLoader: false,
      search: null,
      options: {},
      searchType: "consolidation_number",
      panel: 0,
      downloader: false,
      selectedFormat: null,
      selectedSize: null,
      consSummary: null,
      flightDetailShownIn: null,
      manifestCurrency: null,
      editedItem: {},
      countryDialog: false,
    };
  },
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
  created() {
    this.getCurrencyList();
  },
  methods: {
    ...mapActions([
      "getConsolidations",
      "downloadManifest",
      "snackBar",
      "getCurrencyList",
    ]),
    fetchConsolidations() {
      this.consolidations = [];
      this.consolidationsLoader = true;
      this.getConsolidations({
        ...this.options,
        search: this.search,
        type: this.searchType,
        status: "manifest",
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
    download() {
      if (this.selectedConsolidations.length === 0) {
        return this.snackBar({
          color: "error",
          message: "Please select atleast one record.",
        });
      }
      this.downloader = true;
      this.downloadManifest({
        format: this.selectedFormat,
        data: {
          consolidation_numbers: this.selectedConsolidations.map(
            (i) => i.consolidation_number
          ),
          flight_detail_shown_in: this.flightDetailShownIn,
          package_info_template: this.$refs.pitemplate.selectedTemplate?.id,
          consolidation_summary: this.consSummary,
          manifest_currency: this.manifestCurrency,
          paper_size: this.selectedSize,
        },
      })
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },
    openCountry(item) {
      this.editedItem = item;
      this.countryDialog = true;
    },
  },
};
</script>
