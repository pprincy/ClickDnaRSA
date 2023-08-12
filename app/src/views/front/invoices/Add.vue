<!-- #58 -->
<template>
  <v-col cols="12" :md="invId ? 8 : 5" sm="6" xs="12" class="ma-4">
    <v-row class="d-flex align-center justify-space-between">
      <v-col>
        <v-card class="elevation-2">
          <v-toolbar flat>
            <v-toolbar-title>
              Add IOR Package
              <i class="caption red--text ml-4"> * required field</i>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon>mdi-receipt</v-icon>
          </v-toolbar>
          <div
            class="help-videos-sec-inv-pckg"
            @click="showHelpVideoSectionForInvoicePackage()"
          >
            <v-icon>mdi-help</v-icon>
            <label class="video-title">How to Create Invoice Package</label>
            <v-btn class="mx-2 video-btn" fab dark small>
              <v-icon dark> mdi-video </v-icon>
            </v-btn>
          </div>
          <div
            class="help-videos-sec-req-quote"
            @click="showHelpVideoSectionForRequestQuote()"
          >
            <v-icon>mdi-help</v-icon>
            <label class="video-title">Request Freight Quote by RSA</label>
            <v-btn class="mx-2 video-btn" fab dark small>
              <v-icon dark> mdi-video </v-icon>
            </v-btn>
          </div>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-autocomplete
                v-model="formData.client_id"
                :items="clients"
                :loading="clientLoader"
                hide-no-data
                item-text="name"
                item-value="id"
                label="Select Client"
                placeholder="Start typing to Search"
                class="required"
                :rules="[(v) => !!v || 'Please select client']"
                @change="fetchSellerList()"
                :disabled="!!invId"
              ></v-autocomplete>
              <v-autocomplete
                v-if="userRole.code === 'AD'"
                v-model="formData.seller_id"
                :items="sellers"
                :loading="sellerLoader"
                hide-no-data
                item-text="name"
                item-value="id"
                label="Select Seller"
                placeholder="Start typing to Search"
                class="required"
                :rules="[(v) => !!v || 'Please select seller']"
                :disabled="!!invId"
              ></v-autocomplete>
              <div class="d-flex">
                <v-file-input
                  v-model="formData.pack_file"
                  show-size
                  accept=".xlsx, .xls"
                  label="Packing List Upload Excel File"
                  :rules="[
                    (v) => !!v || 'File is required.',
                    (v) =>
                      !v ||
                      v.size < 2097152 ||
                      `File size should be less than 2 MB!`,
                    (v) =>
                      !v ||
                      [
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      ].includes(v.type) ||
                      `Excel file is required`,
                  ]"
                  class="required"
                  prepend-icon=""
                  append-icon="mdi-paperclip"
                  @change="verified = false"
                  :disabled="!!invId"
                >
                </v-file-input>
                <v-btn
                  color="info"
                  class="mt-3 ml-3"
                  :loading="downloader"
                  @click="downloadTemplate()"
                  v-if="!verified"
                  :disabled="!!invId"
                  >Download template</v-btn
                >
                <v-btn
                  color="success"
                  dark
                  class="mt-3 ml-3"
                  :loading="verifyLoader"
                  @click="verify()"
                  v-if="!verified"
                  :disabled="!!invId"
                >
                  Verify
                </v-btn>
              </div>
              <template v-if="verified">
                <v-text-field
                  v-model="formData.invoice_number"
                  label="Invoice Number"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Invoice Number is required',
                  ]"
                  class="required"
                  :disabled="!!invId"
                ></v-text-field>
                <v-text-field
                  v-model="formData.merchant_invoice_number"
                  label="Amazon Seller Central FBA Shipment ID"
                  :rules="[
                    (v) =>
                      (v && !!v.trim()) ||
                      'Amazon Seller Central FBA Shipment ID is required',
                  ]"
                  class="required"
                  :disabled="!!invId"
                ></v-text-field>
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
                      :value="getFormattedDate(formData.invoice_date)"
                      label="Invoice Date"
                      placeholder="ddd DD MMM, YYYY"
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="[(v) => !!v || 'Invoice Date is required']"
                      class="required"
                      :disabled="!!invId"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="formData.invoice_date"
                    @input="dateMenu = false"
                    :disabled="!!invId"
                  ></v-date-picker>
                </v-menu>
                <v-select
                  label="Is Shipping By RSA?"
                  v-model="formData.rsa_shipping_status"
                  :items="allShippedByRSAStatues"
                  class="required"
                  :rules="[(v) => !!v || 'Field is required.']"
                  :disabled="!!invId"
                >
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
                      </template>
                      Do you require shipping services provided by RSA?
                    </v-tooltip>
                  </template>
                </v-select>
                <v-file-input
                  v-if="!!invId"
                  v-model="formData.invoice_pdf"
                  show-size
                  accept=".pdf"
                  label="Invoice PDF Upload"
                  :rules="[
                    (v) => !!v || 'File is required.',
                    (v) =>
                      !v ||
                      v.size < 2097152 ||
                      `File size should be less than 2 MB!`,
                    (v) =>
                      !v ||
                      ['application/pdf'].includes(v.type) ||
                      `PDF file required`,
                  ]"
                  prepend-icon=""
                  class="required"
                >
                  <template v-slot:append>
                    <Sample :inv-id="invId" />
                  </template>
                </v-file-input>
              </template>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="verified && !invId"
              class="mr-1"
              color="primary"
              @click="createInv()"
              :loading="loader"
            >
              Create IOR Package
            </v-btn>
            <v-btn
              v-if="verified && invId"
              class="mr-1"
              color="primary"
              @click="updateInv()"
              :loading="loader"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <Quote
        v-if="invId"
        :invId="invId"
        :freight-id="formData.freight_id"
        @created="onQuoteCreated"
      />
    </v-row>

    <BulkErrors
      :dialog="uploadResDialog"
      :data="uploadRes"
      @close="uploadResDialog = false"
      other="add"
      @add="confimDialog = true"
    />
    <ConfirmDialog
      :dialog="confimDialog"
      :loader="confirmLoader"
      @confirm="addAfterConfirm()"
      text="Are you sure you want to proceed with the new found products which currently doesn't exist in the system?"
      @close="confimDialog = false"
    />
    <template>
      <v-row justify="center">
        <v-col cols="auto">
          <v-dialog v-model="showVideoUrlInvoicePackage" width="900">
            <v-card class="text-center">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title class="mt-4"
                    ><strong
                      ><u
                        >Video on How to Create an Invoice for the Package</u
                      ></strong
                    >
                  </v-list-item-title>
                  <v-list-item-subtitle class="mb-4">
                    <video
                      width="850"
                      height="500"
                      id="my-video"
                      class="video-js"
                      controls
                      preload="auto"
                      data-setup=""
                      loop
                    >
                      <source
                        src="/videos/Freight Module - IOR Portal - Create a Shipment 1.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions class="pa-5">
                <v-btn
                  class="ml-auto"
                  outlined
                  color="primary"
                  @click="showVideoUrlInvoicePackage = false"
                  >Close</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </template>
    <template>
      <v-row justify="center">
        <v-col cols="auto">
          <v-dialog v-model="showVideoUrlRequestQuote" width="900">
            <v-card class="text-center">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title class="mt-4"
                    ><strong
                      ><u
                        >Video on How to Request for Freight Quote within
                        Portal</u
                      ></strong
                    >
                  </v-list-item-title>
                  <v-list-item-subtitle class="mb-4">
                    <video
                      width="850"
                      height="500"
                      id="my-video"
                      class="video-js"
                      controls
                      preload="auto"
                      data-setup=""
                      loop
                    >
                      <source
                        src="/videos/Freight Module - IOR Portal - Request a Quote.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions class="pa-5">
                <v-btn
                  class="ml-auto"
                  outlined
                  color="primary"
                  @click="showVideoUrlRequestQuote = false"
                  >Close</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </template>
  </v-col>
</template>
<script>
import BulkErrors from "@/components/front/common/BulkErrors";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";
import Sample from "@/views/front/invoices/Sample";
import { mapActions, mapGetters } from "vuex";
import { shippedByRSAStatues } from "@/config/data";
import Quote from "@/views/front/invoices/Quote";

export default {
  components: {
    BulkErrors,
    ConfirmDialog,
    Sample,
    Quote,
  },
  computed: {
    ...mapGetters(["userRole"]),
    allShippedByRSAStatues() {
      return Object.keys(shippedByRSAStatues).map((i) => {
        return {
          text: shippedByRSAStatues[i],
          value: i,
        };
      });
    },
  },
  data() {
    return {
      formData: {},
      loader: false,
      clientLoader: false,
      clients: [],
      sellers: [],
      verified: false,
      dateMenu: false,
      sellerLoader: false,
      verifyLoader: false,
      downloader: false,
      uploadRes: {},
      uploadResDialog: false,
      confimDialog: false,
      confirmLoader: false,
      invId: null,
      verifyStatusFlag: false,
      showVideoUrlInvoicePackage: false,
      showVideoUrlRequestQuote: false,
    };
  },

  watch: {
    userRole() {
      this.fetchClientList();
    },
  },

  created() {
    this.fetchClientList();
  },

  methods: {
    ...mapActions([
      "getClients",
      "getSellers",
      "downloadPackingListSample",
      "verifyPackingList",
      "createInvoice",
      "uploadInvPDF",
      "addTempProductAndVerify",
      "snackBar",
    ]),
    fetchClientList() {
      if (this.clients.length) return;
      this.clientLoader = true;
      this.getClients({
        fields: "id,name",
        pagination: 0,
        service: "ior",
      })
        .then((res) => {
          this.clientLoader = false;
          this.clients = res.data;
          if (this.formData.client_id) {
            this.fetchSellerList();
          }
        })
        .catch(() => {
          this.clientLoader = false;
        });
    },
    fetchSellerList() {
      if (this.userRole.code !== "AD") return;
      this.sellerLoader = true;
      this.getSellers({
        client_id: this.formData.client_id,
        params: {
          fields: "id,name",
          pagination: 0,
        },
      })
        .then((res) => {
          this.sellerLoader = false;
          this.sellers = res.data;
        })
        .catch(() => {
          this.sellerLoader = false;
        });
    },
    createInv() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const payload = new FormData();
      for (const field in this.formData) {
        if (Object.prototype.hasOwnProperty.call(this.formData, field)) {
          const fieldVal = this.formData[field];
          if (fieldVal?.name) {
            payload.append(field, fieldVal, fieldVal?.name);
          } else {
            payload.append(field, fieldVal === null ? "" : fieldVal);
          }
        }
      }
      this.loader = true;
      this.createInvoice(payload)
        .then((res) => {
          this.loader = false;
          this.invId = +res.data.record_id;
          this.snackBar({
            color: "success",
            message:
              "IOR Package created. Please upload invoice PDF and submit.",
          });
        })
        .catch(() => {
          this.loader = false;
        });
    },
    updateInv() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const payload = new FormData();
      payload.append(
        "invoice_file_path",
        this.formData.invoice_pdf,
        this.formData.invoice_pdf.name
      );
      payload.append("verify_status_flag", this.verifyStatusFlag);
      this.loader = true;
      this.uploadInvPDF({
        id: this.invId,
        data: payload,
      })
        .then((res) => {
          this.loader = false;
          this.$refs.form.reset();
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.$router.replace({
            name: "Invoices",
          });
        })
        .catch(() => {
          this.loader = false;
        });
    },
    verify() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.verifyLoader = true;
      const payload = new FormData();
      payload.append(
        "data_file",
        this.formData.pack_file,
        this.formData.pack_file.name
      );
      if (this.formData.client_id) {
        payload.append("client_id", this.formData.client_id);
      }
      if (this.formData.seller_id) {
        payload.append("seller_id", this.formData.seller_id);
      }
      this.verifyPackingList(payload)
        .then((res) => {
          this.verifyLoader = false;
          if (res.data.with_error) {
            this.uploadRes = res.data;
            this.uploadResDialog = true;
          } else {
            this.verified = true;
            this.verifyStatusFlag = true;
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
          }
        })
        .catch(() => {
          this.verifyLoader = false;
        });
    },

    addAfterConfirm() {
      this.confirmLoader = true;
      const payload = new FormData();
      payload.append(
        "data_file",
        this.formData.pack_file,
        this.formData.pack_file.name
      );
      if (this.formData.client_id) {
        payload.append("client_id", this.formData.client_id);
      }
      if (this.formData.seller_id) {
        payload.append("seller_id", this.formData.seller_id);
      }
      this.addTempProductAndVerify(payload)
        .then((res) => {
          this.uploadResDialog = false;
          this.confirmLoader = false;
          this.confimDialog = false;
          this.verified = true;
          this.verifyStatusFlag = false;
          Object.assign(this.formData, {
            temp_product_id: res.data.temp_product_id,
          });
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.confirmLoader = false;
        });
    },

    downloadTemplate() {
      this.downloader = true;
      this.downloadPackingListSample()
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },

    onQuoteCreated(freightId) {
      Object.assign(this.formData, { freight_id: freightId });
      this.$forceUpdate();
    },
    showHelpVideoSectionForInvoicePackage() {
      this.showVideoUrlInvoicePackage = true;
    },
    showHelpVideoSectionForRequestQuote() {
      this.showVideoUrlRequestQuote = true;
    },
  },
};
</script>
<style lang="scss">
.help-videos-sec-inv-pckg,
.help-videos-sec-req-quote {
  position: fixed;
  right: 0;
  color: white;
  background-color: rgba(45, 156, 49, 0.9411764705882353) !important;
  border-radius: 9px 0 0 9px;
  padding: 5px 0 5px 7px;
  box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%),
    0 1px 18px 0 rgb(0 0 0 / 12%);
  z-index: 2;
  cursor: pointer;
  .v-icon {
    color: white;
    font-size: 17px;
    margin-top: -2px;
  }
  .video-title {
    font-weight: bold;
    color: white;
    font-size: 12px;
  }
}
.help-videos-sec-inv-pckg {
  top: 110px;
}
.help-videos-sec-req-quote {
  top: 170px;
}
</style>
