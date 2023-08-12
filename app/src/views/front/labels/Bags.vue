<!-- #5 -->
<template>
  <v-col class="mx-4">
    <p class="text-h6">Download a label for a Bag(s)</p>
    <v-divider class="py-2"></v-divider>
    <v-row>
      <v-col md="9" sm="9" xs="12">
        <v-data-table
          v-model="selectedBags"
          :headers="headers"
          :items="bags"
          :options.sync="options"
          :server-items-length="total"
          :loading="bagsLoader"
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
                  label="Upload Bag Numbers"
                  class="w-90"
                  clearable
                  hide-details
                  single-line
                  @change="upload"
                  @click:clear="fileBagNumbers = []"
                >
                </v-file-input>
                <v-btn
                  color="info"
                  target="_blank"
                  href="/Bag-Numbers.xlsx"
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
                  label="Consignment ID"
                  v-model="consignmentNumber"
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
            <Legends legend-type="bag" />
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
      bags: [],
      selectedBags: [],
      headers: [
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
      ],
      searchOptions: [
        {
          text: "Bag #",
          value: "bag_number",
        },
        {
          text: "D.Airport",
          value: "destination_airport",
        },
        {
          text: "O.Airport",
          value: "origin_airport",
        },
        {
          text: "Service",
          value: "service_code",
        },
        // {
        //   text: "Split",
        //   value: "split_code",
        // },
        {
          text: "Pcs",
          value: "pieces",
        },
        {
          text: "Total Value",
          value: "value",
        },
      ],
      total: 0,
      bagsLoader: false,
      search: null,
      options: {},
      searchType: null,
      file: null,
      selectedFormat: "pdf",
      selectedSize: "4x6",
      downloader: false,
      consignmentNumber: "",
      fileBagNumbers: [],
    };
  },
  watch: {
    options: {
      handler() {
        this.fetchBag();
      },
      deep: true,
    },
    search() {
      this.fetchBag();
    },
    searchType() {
      if (this.search) this.fetchBag();
    },
  },
  methods: {
    ...mapActions(["getAllBags", "downloadBagLabels", "snackBar"]),
    fetchBag() {
      this.bags = [];
      this.bagsLoader = true;
      this.getAllBags({
        ...this.options,
        search: this.search,
        type: this.searchType,
        status: this.statusType,
      })
        .then((res) => {
          this.bagsLoader = false;
          this.bags = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.bagsLoader = false;
        });
    },
    download() {
      if (
        this.selectedBags.length === 0 &&
        !this.consignmentNumber &&
        this.fileBagNumbers.length === 0
      ) {
        return this.snackBar({
          color: "error",
          message: "Please select atleast one record.",
        });
      }
      const bagNumbers = [];
      if (this.selectedBags.length) {
        this.selectedBags.forEach((i) => {
          bagNumbers.push(i.bag_number);
        });
      }
      if (this.fileBagNumbers.length) {
        bagNumbers.push(...this.fileBagNumbers);
      }
      this.downloader = true;
      this.downloadBagLabels({
        format: this.selectedFormat,
        size: this.selectedSize,
        data: {
          bag_numbers: bagNumbers.filter((v, i, a) => a.indexOf(v) === i),
          consignment_number: this.consignmentNumber,
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
        $v.fileBagNumbers = data.map((i) => i["Bag Number"]);
      };
      reader.readAsArrayBuffer(this.file);
    },
  },
};
</script>
