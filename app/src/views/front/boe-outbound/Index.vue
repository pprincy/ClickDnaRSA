<!-- #86 -->
<template>
  <v-col class="mx-4">
    <template>
      <v-row class="mb-5">
        <v-col cols="12" md="6" sm="12">
          <v-card>
            <v-toolbar color="primary" dense dark flat>
              <v-toolbar-title> Upload Exit BOE data </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form1">
                <div class="text-center py-0">
                  <v-file-input
                    v-model="filePVerify"
                    accept=".xlsx"
                    label="Upload BEO"
                    class="w-90"
                    clearable
                    hide-details
                    single-line
                  >
                  </v-file-input>
                  <div class="text-center">
                    <v-btn
                      class="info mt-2"
                      @click="downloadBoeOutbundDetails()"
                      :loading="downloader"
                      >Download Pending BOE Outbound</v-btn
                    >
                    <v-btn
                      color="primary"
                      class="mt-2 ml-4"
                      :loading="uploaderPUpload"
                      @click="uploadBoeOutbound()"
                      >Submit</v-btn
                    >
                  </div>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <v-data-table
      :headers="headers"
      :items="boeOutboundList"
      :options.sync="options"
      :server-items-length="total"
      :loading="boeOutboundLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-5">
          <v-col
            cols="12"
            md="12"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              BOE Outbound
            </v-toolbar-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
        </v-row>
      </template>
    </v-data-table>
    <BulkErrors
      :dialog="uploadResDialog"
      :data="uploadRes"
      @close="uploadResDialog = false"
      file-name="HS-Product-Errorlist"
      :other="other"
    />
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import Search from "@/components/front/common/Search";
import BulkErrors from "@/components/front/common/BulkErrors";

export default {
  components: {
    Search,
    BulkErrors,
  },

  data: () => ({
    search: "",
    searchType: "id",
    boeOutboundLoader: false,
    filePVerify: null,
    downloader: false,
    uploaderPUpload: false,
    uploadResDialog: false,
    uploadRes: {},
    other: "verify",

    searchOptions: [
      {
        text: "Client Name",
        value: "client_name",
      },
      {
        text: "Order ID",
        value: "sale_order_code",
      },
    ],
    headers: [
      {
        text: "Order ID",
        value: "sale_order_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Client Name",
        value: "client_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Code",
        value: "item_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item",
        value: "item",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Quantity",
        value: "quantity",
        class: "body-1 font-weight-bold",
      },
      {
        text: "UOM",
        value: "uom",
        class: "body-1 font-weight-bold",
      },
      {
        text: "HS Code",
        value: "hs_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "COO",
        value: "coo",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Currency",
        value: "currency",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Unit Price",
        value: "unit_price",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Inbound BOE",
        value: "inbound_boe",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Net Weight",
        value: "net_weight",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Gross Weight",
        value: "gross_weight",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Price",
        value: "total_price",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Invoice",
        value: "invoice_no",
        class: "body-1 font-weight-bold",
      },
      {
        text: "AWB",
        value: "awb",
        class: "body-1 font-weight-bold",
      },
    ],
    boeOutboundList: [],
    options: {},
    total: 0,
  }),

  watch: {
    options: {
      handler() {
        this.fetchboeOuboundList();
      },
      deep: true,
    },
    search() {
      this.fetchboeOuboundList();
    },
    searchType() {
      if (this.search) this.fetchboeOuboundList();
    },
  },

  methods: {
    ...mapActions([
      "getboeOuboundList",
      "downloadBoeOutbund",
      "uploadBoeOutboundList",
      "snackBar",
    ]),
    fetchboeOuboundList() {
      this.boeOutboundList = [];
      this.boeOutboundLoader = true;
      this.getboeOuboundList({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.boeOutboundLoader = false;
          this.boeOutboundList = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.boeOutboundLoader = false;
        });
    },

    downloadBoeOutbundDetails() {
      this.downloader = true;
      this.downloadBoeOutbund()
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },

    uploadBoeOutbound() {
      if (!this.filePVerify) return;
      this.uploaderPUpload = true;
      const payload = new FormData();
      payload.append("data_file", this.filePVerify, this.filePVerify.name);
      this.uploadBoeOutboundList(payload)
        .then((res) => {
          this.uploaderPUpload = false;
          this.uploadRes = res.data;
          this.other = "";
          this.uploadResDialog = true;
        })
        .catch(() => {
          this.uploaderPUpload = false;
        });
    },
  },
};
</script>
