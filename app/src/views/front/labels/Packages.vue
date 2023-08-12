<!-- #6 -->
<template>
  <v-col class="mx-4">
    <p class="text-h6">Download a label for a Package(s)</p>
    <v-divider class="py-2"></v-divider>
    <v-row>
      <v-col md="9" sm="9" xs="12">
        <v-data-table
          v-model="selectedPackages"
          :headers="headers"
          :items="packages"
          :options.sync="options"
          :server-items-length="total"
          :loading="packagesLoader"
          item-key="id"
          show-select
        >
          <template v-slot:top>
            <v-row>
              <v-col class="text-center py-0">
                <p class="pt-5"><strong>Label File Format</strong></p>
                <v-radio-group mandatory v-model="selectedFormat" row>
                  <v-radio label="ZPL" value="zpl" disabled></v-radio>
                  <v-radio label="PDF" value="pdf"></v-radio>
                  <v-radio label="PNG" value="png" disabled></v-radio>
                  <v-radio label="SVG" value="svg" disabled></v-radio>
                  <v-radio label="WEBP" value="webp" disabled></v-radio>
                  <v-radio label="JPEG" value="jpeg" disabled></v-radio>
                </v-radio-group>
              </v-col>
              <v-col class="text-center py-0">
                <p class="pt-5"><strong>Label Size</strong></p>
                <v-radio-group mandatory v-model="selectedSize" row>
                  <v-radio label="A4" value="a4" disabled></v-radio>
                  <v-radio label="Letter" value="letter" disabled></v-radio>
                  <v-radio label="4 x 6 inch label" value="4x6"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col class="text-center py-0">
                <v-file-input
                  v-model="file"
                  accept=".xlsx"
                  label="Upload Tracking Numbers"
                  class="w-90"
                  clearable
                  hide-details
                  single-line
                  @change="upload"
                  @click:clear="fileTrackingNumbers = []"
                >
                </v-file-input>
                <v-btn
                  color="info"
                  target="_blank"
                  href="/Tracking-Numbers.xlsx"
                  class="mt-2"
                  >Download upload template</v-btn
                >
              </v-col>
            </v-row>
            <v-row class="pb-10">
              <v-col cols="12" md="6" sm="12" xs="12" class="py-0">
                <Search
                  :search-options="searchOptions"
                  :val="searchType"
                  @changeText="(res) => (search = res)"
                  @changeType="(res) => (searchType = res)"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                sm="12"
                xs="12"
                class="d-flex flex-column align-center justify-center"
              >
                <v-text-field
                  class="w-90"
                  label="Bag Number"
                  v-model="bagNumber"
                ></v-text-field>
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
            <v-divider></v-divider>
          </template>
        </v-data-table>
      </v-col>
      <v-col md="3" sm="3" xs="12">
        <v-card>
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title>Status Legend</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <Legends />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import XLSX from "xlsx";
import { mapActions } from "vuex";
import Search from "@/components/front/common/Search";
import Legends from "@/components/front/common/Legends";

export default {
  components: {
    Search,
    Legends,
  },
  data() {
    return {
      packages: [],
      selectedPackages: [],
      headers: [
        {
          text: "Tracking Number",
          value: "tracking_no",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Recipient Name",
          value: "recipient_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Recipient Tel #",
          value: "recipient_num",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Origin Cnty",
          value: "origin_country",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Destination Cnty",
          value: "destination_country",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Wgt",
          value: "weight",
          class: "body-1 font-weight-bold",
          sortable: false,
        },
        {
          text: "Qty",
          value: "quantity",
          class: "body-1 font-weight-bold",
          sortable: false,
        },
        {
          text: "Value (USD)",
          value: "total_value",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Status",
          value: "status",
          class: "body-1 font-weight-bold",
        },
      ],
      searchOptions: [
        {
          text: "Tracking #",
          value: "tracking_no",
        },
        {
          text: "O.Country",
          value: "origin_country",
        },
        {
          text: "D.country",
          value: "destination_country",
        },
      ],
      total: 0,
      packagesLoader: false,
      search: null,
      options: {},
      searchType: null,
      file: null,
      selectedFormat: "pdf",
      selectedSize: "4x6",
      downloader: false,
      bagNumber: "",
      fileTrackingNumbers: [],
    };
  },
  watch: {
    options: {
      handler() {
        this.fetchPackage();
      },
      deep: true,
    },
    search() {
      this.fetchPackage();
    },
    searchType() {
      if (this.search) this.fetchPackage();
    },
  },
  methods: {
    ...mapActions(["getAllPackages", "downloadPackageLabels", "snackBar"]),
    fetchPackage() {
      this.packages = [];
      this.packagesLoader = true;
      this.getAllPackages({
        ...this.options,
        search: this.search,
        type: this.searchType,
        status: this.statusType,
      })
        .then((res) => {
          this.packagesLoader = false;
          this.packages = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.packagesLoader = false;
        });
    },
    download() {
      if (
        this.selectedPackages.length === 0 &&
        !this.bagNumber &&
        this.fileTrackingNumbers.length === 0
      ) {
        return this.snackBar({
          color: "error",
          message: "Please select atleast one record.",
        });
      }
      const trackingNumbers = [];
      if (this.selectedPackages.length) {
        this.selectedPackages.forEach((i) => {
          trackingNumbers.push(i.tracking_no);
        });
      }
      if (this.fileTrackingNumbers.length) {
        trackingNumbers.push(...this.fileTrackingNumbers);
      }
      if (this.bagNumber) {
        trackingNumbers.push(this.bagNumber);
      }
      this.downloader = true;
      this.downloadPackageLabels({
        format: this.selectedFormat,
        size: this.selectedSize,
        data: {
          tracking_numbers: trackingNumbers.filter(
            (v, i, a) => a.indexOf(v) === i
          ),
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
    upload() {
      if (!this.file) return;
      const reader = new FileReader();
      const $v = this;
      reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(first_worksheet);
        if (data.length === 0) return;
        $v.fileTrackingNumbers = data.map((i) => i["Tracking Number"]);
      };
      reader.readAsArrayBuffer(this.file);
    },
  },
};
</script>
