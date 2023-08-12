<!-- #22 -->
<template>
  <v-col class="mx-4">
    <v-card>
      <v-card-title class="pl-4 text-h6"
        >Get a Package or Bag Status or POD</v-card-title
      >
      <v-card-subtitle
        >You can track bags or packages by entering tracking numbers, reference
        numbers or by search.</v-card-subtitle
      >
      <v-tabs dark grow background-color="primary accent-4">
        <v-tab> Tracking Number </v-tab>
        <v-tab> Track by Reference </v-tab>
        <!-- <v-tab> Obtain Proof of Delivery </v-tab> -->
        <v-tab> Search & Track </v-tab>

        <v-tab-item>
          <v-container fluid>
            <v-row justify="space-around">
              <v-col cols="5">
                <template v-for="(item, i) in trackNos">
                  <v-text-field
                    class="full-width"
                    type="text"
                    :placeholder="
                      'Tracking Number ' + ('0' + (i + 1)).slice(-2)
                    "
                    @focus="checkAndAdd(i, trackNos)"
                    :key="i"
                    v-model="trackNos[i]"
                  >
                    <template v-slot:append>
                      <v-img
                        v-if="item && item.startsWith('1B')"
                        max-height="24"
                        max-width="24"
                        class="mr-2"
                        src="/images/bag.svg"
                      ></v-img>
                      <v-img
                        v-if="item && item.startsWith('1P')"
                        max-height="24"
                        max-width="24"
                        class="mr-2"
                        src="/images/package.svg"
                      ></v-img>
                      <v-icon color="green">mdi-check-circle</v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-btn
                  color="primary"
                  class="float-right"
                  @click="goToTrackNoSummary()"
                  >Track</v-btn
                >
              </v-col>
              <!-- <v-divider vertical></v-divider>
              <v-col cols="4" class="align-self-center">
                <div class="text-center py-0">
                  <v-file-input
                    v-model="trackFile"
                    accept=".xlsx"
                    label="Upload Tracking Numbers"
                    class="w-90"
                    clearable
                    hide-details
                    single-line
                    @change="upload(trackFile, 'trackNos', 'Tracking Number')"
                  >
                  </v-file-input>
                  <v-btn
                    color="info"
                    target="_blank"
                    href="/Tracking-Numbers.xlsx"
                    class="mt-2"
                    >Download upload template</v-btn
                  >
                </div>
              </v-col> -->
            </v-row>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container fluid>
            <v-row justify="space-around">
              <v-col cols="7">
                <template v-for="(item, i) in refNos">
                  <v-text-field
                    class="full-width"
                    :placeholder="
                      'Reference Number ' + ('0' + (i + 1)).slice(-2)
                    "
                    type="text"
                    @focus="checkAndAdd(i, refNos)"
                    :key="i"
                    v-model="refNos[i]"
                  >
                  </v-text-field>
                </template>
                <v-row>
                  <v-col>
                    <v-autocomplete
                      label="Country"
                      :items="allCountries"
                      v-model="country"
                    ></v-autocomplete>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="DESTINATION POSTAL CODE"
                      v-model="destinationPostalCode"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-menu
                      v-model="dateMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="shipDate"
                          label="Ship Date"
                          append-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="shipDate"
                        @input="dateMenu = false"
                        :min="new Date().toISOString()"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-text-field
                  class="full-width"
                  type="text"
                  label="ACCOUNT NUMBER (RECOMMENDED)"
                  v-model="accountNumber"
                >
                </v-text-field>
                <v-btn
                  color="primary"
                  class="float-right"
                  @click="goToRefNoSummary()"
                  >Track</v-btn
                >
              </v-col>
              <!-- <v-divider vertical></v-divider>
              <v-col cols="4" class="align-self-center">
                <div class="text-center py-0">
                  <v-file-input
                    v-model="refFile"
                    accept=".xlsx"
                    label="Upload Reference Numbers"
                    class="w-90"
                    clearable
                    hide-details
                    single-line
                    @change="upload(refFile, 'refNos', 'Reference Number')"
                  >
                  </v-file-input>
                  <v-btn
                    color="info"
                    target="_blank"
                    href="/Reference-Numbers.xlsx"
                    class="mt-2"
                    >Download upload template</v-btn
                  >
                </div>
              </v-col> -->
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- <v-tab-item>
          <v-container fluid>
            <v-row justify="space-around">
              <v-col cols="5">
                <template v-for="(item, i) in proofTrackNos">
                  <v-text-field
                    class="full-width"
                    :placeholder="
                      'Tracking Number ' + ('0' + (i + 1)).slice(-2)
                    "
                    type="text"
                    @focus="checkAndAdd(i, proofTrackNos)"
                    :key="i"
                    v-model="proofTrackNos[i]"
                  >
                    <template v-slot:append>
                      <v-img
                        v-if="item && item.startsWith('1B')"
                        max-height="24"
                        max-width="24"
                        class="mr-2"
                        src="/images/bag.svg"
                      ></v-img>
                      <v-img
                        v-if="item && item.startsWith('1P')"
                        max-height="24"
                        max-width="24"
                        class="mr-2"
                        src="/images/package.svg"
                      ></v-img>
                      <v-icon color="green">mdi-check-circle</v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-btn
                  color="primary"
                  class="float-right"
                  :loading="downloader"
                  @click="downloadProofs()"
                  >Download</v-btn
                >
              </v-col>
              <v-divider vertical></v-divider>
              <v-col cols="4" class="align-self-center">
                <div class="text-center py-0">
                  <v-file-input
                    v-model="proofTrackFile"
                    accept=".xlsx"
                    label="Upload Tracking Numbers"
                    class="w-90"
                    clearable
                    hide-details
                    single-line
                    @change="
                      upload(proofTrackFile, 'proofTrackNos', 'Tracking Number')
                    "
                  >
                  </v-file-input>
                  <v-btn
                    color="info"
                    target="_blank"
                    href="/Tracking-Numbers.xlsx"
                    class="mt-2"
                    >Download upload template</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item> -->
        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col>
                <v-data-table
                  :headers="_headers"
                  :items="consolidations"
                  :options.sync="options"
                  :server-items-length="total"
                  :loading="consolidationsLoader"
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-row class="mt-4">
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
                  <template v-slot:[`item.destinations`]="{ item }">
                    {{ item.destinations.map((i) => i.code).join() }}
                    <v-btn
                      v-if="item.destinations"
                      @click="openCountry(item)"
                      icon
                    >
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
                          @click="goToConsSummary(item)"
                        >
                          mdi-dots-horizontal
                        </v-icon>
                      </template>
                      <span>View</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
                <CountryPopup
                  :dialog="dialog"
                  :countries="editedItem.destinations"
                  @close="dialog = false"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-col>
</template>
<script>
import XLSX from "xlsx";
import { countries } from "@/config/data";
import { mapActions, mapMutations, mapGetters } from "vuex";
import Search from "@/components/front/common/Search";
import CountryPopup from "@/components/front/common/CountryPopup";

export default {
  components: {
    Search,
    CountryPopup,
  },
  computed: {
    ...mapGetters(["userRole"]),
    allCountries() {
      return Object.keys(countries).map((i) => {
        return {
          text: countries[i],
          value: i,
        };
      });
    },
    _headers() {
      return this.headers.filter((i) =>
        this.userRole.code !== "AD" ? i.value !== "client_name" : true
      );
    },
  },
  data() {
    return {
      tab: "trackingNumber",
      trackNos: [null],
      refNos: [null],
      destinationPostalCode: null,
      proofTrackNos: [null],
      limit: 50,
      accountNumber: null,
      country: null,
      shipDate: null,
      dateMenu: false,
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
          text: "Client",
          value: "client_name",
          sortable: false,
          class: "body-1 font-weight-bold",
        },
        {
          text: "Consolidation",
          value: "consolidation_number",
          class: "body-1 font-weight-bold",
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
      downloader: false,
      refFile: null,
      trackFile: null,
      proofTrackFile: null,
      editedItem: {},
      dialog: false,
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
  methods: {
    ...mapMutations(["setTrackNos", "setRfNoData", "setConsNo"]),
    ...mapActions([
      "getConsolidations",
      "downloadConsolidation",
      "downloadPOD",
      "snackBar",
    ]),
    openCountry(item) {
      this.editedItem = item;
      this.dialog = true;
    },
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
    checkAndAdd(index, nos) {
      if (
        this.limit > nos.length &&
        index + 1 === nos.length &&
        nos.filter((item, i) => i !== index && !item).length === 0
      ) {
        nos.push(null);
      }
    },
    goToTrackNoSummary() {
      const trackNo = this.trackNos.filter(Boolean);
      if (trackNo.length) {
        this.setRfNoData(null);
        this.setTrackNos(trackNo);
        this.$router.push({
          name: "ClientTrackingSummary",
        });
      } else {
        this.snackBar({
          color: "error",
          message: "Please add tracking numbers.",
        });
      }
    },
    goToRefNoSummary() {
      this.setTrackNos([]);
      this.setConsNo(null);
      this.setRfNoData({
        reference_no: this.refNos.filter(Boolean),
        destinations: this.country,
        destination_postal_code: this.destinationPostalCode,
        ship_date: this.shipDate,
        account_number: this.accountNumber,
      });
      this.$router.push({
        name: "ClientTrackingSummary",
      });
    },
    goToConsSummary(item) {
      this.setTrackNos([]);
      this.setConsNo(item.consolidation_number);
      this.$router.push({
        name: "ClientTrackingSummary",
      });
    },
    upload(fileModel, dataVar, columnName) {
      if (!fileModel) return;
      const reader = new FileReader();
      const $v = this;
      reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(first_worksheet);
        if (data.length === 0) return;
        $v[dataVar] = data.map((i) => i[columnName].toString());
      };
      reader.readAsArrayBuffer(fileModel);
    },
    downloadProofs() {
      this.downloader = true;
      this.downloadPOD({
        tracking_numbers: this.proofTrackNos.filter(Boolean),
      })
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },
  },
};
</script>
