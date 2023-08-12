<!-- #59 -->
<template>
  <v-col
    cols="12"
    :md="
      formData.freight_id ||
      ['new', 'on_hold', 'package_list_approved_by_rsa'].includes(invoiceStatus)
        ? 12
        : 6
    "
    sm="12"
    xs="12"
    class="ma-4"
  >
    <v-row class="d-flex align-center justify-space-between">
      <v-col>
        <v-card class="elevation-2">
          <v-toolbar flat>
            <v-toolbar-title>
              Edit IOR Package
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
          <template>
            <div class="step-process">
              <div class="step1">
                <strong class="black--text">Step 1</strong>
                <p
                  :style="{
                    background: activeBackgroundStep1,
                  }"
                >
                  Create Package
                </p>
              </div>
              <div class="step2">
                <strong class="black--text">Step 2</strong>
                <p
                  :style="{
                    background: activeBackgroundStep2,
                  }"
                >
                  RSA to Send Payment Details
                </p>
              </div>
              <div class="step3">
                <strong class="black--text">Step 3</strong>
                <p
                  :style="{
                    background: activeBackgroundStep3,
                  }"
                >
                  Seller to Complete the Payment
                </p>
              </div>
              <div class="step4">
                <strong class="black--text">Step 4</strong>
                <p
                  :style="{
                    background: activeBackgroundStep4,
                  }"
                >
                  Provide Pre-alert and Ship the Package
                </p>
              </div>
              <div class="step5">
                <strong class="black--text">Step 5</strong>
                <p
                  :style="{
                    background: activeBackgroundStep5,
                  }"
                >
                  Customs Clearance
                </p>
              </div>
            </div>
          </template>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                label="Client Name"
                :value="formData.client_name"
                disabled
              ></v-text-field>
              <v-text-field
                label="Seller Name"
                :value="formData.seller_name"
                disabled
              ></v-text-field>
              <v-text-field
                v-model="formData.invoice_no"
                label="Invoice Number"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Invoice Number is required',
                ]"
                class="required"
                :disabled="!['new', 'on_hold'].includes(invoiceStatus)"
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
                :disabled="!['new', 'on_hold'].includes(invoiceStatus)"
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
                    :disabled="!['new', 'on_hold'].includes(invoiceStatus)"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.invoice_date"
                  @input="dateMenu = false"
                ></v-date-picker>
              </v-menu>
              <v-file-input
                v-model="formData.invoice_file_path"
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
                v-if="!isURL(formData.invoice_file_path)"
              >
                <template v-slot:append>
                  <Sample :inv-id="+$route.params.id" />
                </template>
              </v-file-input>
              <div class="d-flex justify-space-between my-4" v-else>
                <label>Invoice PDF</label>
                <div>
                  <v-btn
                    v-if="formData.invoice_file_path"
                    :href="formData.invoice_file_path | assetURL"
                    target="_blank"
                    color="success"
                    class="mr-1"
                    small
                  >
                    View
                  </v-btn>
                  <v-btn
                    v-if="['new', 'on_hold'].includes(invoiceStatus)"
                    color="primary"
                    @click="formData.invoice_file_path = null"
                    small
                  >
                    Upload New
                  </v-btn>
                </div>
              </div>
              <v-select
                label="Is Shipping By RSA?"
                v-model="formData.rsa_shipping_status"
                :items="allShippedByRSAStatues"
                class="required"
                :rules="[(v) => !!v || 'Field is required.']"
                :disabled="
                  [
                    'custom_initiated',
                    'rejected_by_rsa',
                    'custom_approved',
                    'custom_rejected',
                  ].includes(invoiceStatus)
                "
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
              <v-select
                v-model="formData.status"
                label="Status"
                :items="statusItems"
                :disabled="isStatusDisabled(formData.status)"
                :item-disabled="checkIsItemDisabled"
                class="required"
                :rules="[(v) => !!v || 'Field is required.']"
              ></v-select>
              <template
                v-if="
                  [
                    'payment_pending_from_seller',
                    'ready_to_be_shipped',
                    'shipped',
                    'custom_initiated',
                    'rejected_by_rsa',
                    'custom_approved',
                    'custom_rejected',
                  ].includes(formData.status)
                "
              >
                <v-text-field
                  v-model="formData.ramco_job_id"
                  label="Ramco Job ID"
                  v-if="userRole.code === 'AD'"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Ramco Job ID is required',
                  ]"
                  class="required"
                  :disabled="
                    [
                      'ready_to_be_shipped',
                      'shipped',
                      'custom_initiated',
                      'rejected_by_rsa',
                      'custom_approved',
                      'custom_rejected',
                    ].includes(invoiceStatus)
                  "
                ></v-text-field>
                <v-text-field
                  v-model="formData.ramco_invoice_id"
                  label="Ramco Invoice ID"
                  v-if="userRole.code === 'AD'"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Ramco Invoice ID is required',
                  ]"
                  class="required"
                  :disabled="
                    [
                      'ready_to_be_shipped',
                      'shipped',
                      'custom_initiated',
                      'rejected_by_rsa',
                      'custom_approved',
                      'custom_rejected',
                    ].includes(invoiceStatus)
                  "
                ></v-text-field>
                <v-text-field
                  label="Amount"
                  type="number"
                  v-model.number="formData.amount"
                  class="required"
                  :rules="[
                    (v) =>
                      (v !== '' && v !== undefined) || 'Amount is required',
                    (v) => v > 0 || 'Amount should be greater than 0',
                  ]"
                  :disabled="
                    [
                      'payment_pending_from_seller',
                      'ready_to_be_shipped',
                      'shipped',
                      'custom_initiated',
                      'rejected_by_rsa',
                      'custom_approved',
                      'custom_rejected',
                    ].includes(invoiceStatus)
                  "
                >
                  <template v-slot:append>
                    <strong>USD</strong>
                  </template>
                </v-text-field>
              </template>
              <template
                v-if="
                  [
                    'shipped',
                    'custom_initiated',
                    'custom_approved',
                    'custom_rejected',
                  ].includes(formData.status)
                "
              >
                <v-file-input
                  v-model="formData.shipping_details_file_path"
                  show-size
                  accept=".pdf"
                  label="Shipped Document PDF Upload"
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
                  class="required"
                  prepend-icon=""
                  append-icon="mdi-paperclip"
                  v-if="
                    formData.status === 'shipped' &&
                    !isURL(formData.shipping_details_file_path)
                  "
                >
                </v-file-input>
                <div class="d-flex justify-space-between my-4" v-else>
                  <label>Shipped Document PDF</label>
                  <div>
                    <v-btn
                      v-if="formData.shipping_details_file_path"
                      :href="formData.shipping_details_file_path | assetURL"
                      target="_blank"
                      color="success"
                      class="mr-1"
                      small
                    >
                      View
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="formData.shipping_details_file_path = null"
                      v-if="formData.status === 'shipped'"
                      small
                    >
                      Upload New
                    </v-btn>
                  </div>
                </div>
                <v-text-field
                  v-model="formData.awb_number"
                  label="AWB Number / Bill of lading number"
                  :rules="
                    formData.status === 'shipped'
                      ? [
                          (v) =>
                            (v && !!v.trim()) ||
                            'AWB Number / Bill of lading number is required.',
                        ]
                      : []
                  "
                  :class="{ required: formData.status === 'shipped' }"
                  :disabled="formData.status !== 'shipped'"
                ></v-text-field>
              </template>
              <template
                v-if="
                  ['custom_approved', 'custom_rejected'].includes(
                    formData.status
                  )
                "
              >
                <v-file-input
                  v-model="formData.custom_declaration_pdf"
                  show-size
                  accept=".pdf"
                  label="Custom Declaration PDF Upload"
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
                  class="required"
                  prepend-icon=""
                  append-icon="mdi-paperclip"
                  v-if="!isURL(formData.custom_declaration_pdf)"
                >
                </v-file-input>
                <div class="d-flex justify-space-between my-4" v-else>
                  <label>Custom Declaration PDF</label>
                  <div>
                    <v-btn
                      v-if="formData.custom_declaration_pdf"
                      :href="formData.custom_declaration_pdf | assetURL"
                      target="_blank"
                      color="success"
                      class="mr-1"
                      small
                    >
                      View
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="formData.custom_declaration_pdf = null"
                      v-if="
                        userRole.code === 'AD' &&
                        !['custom_approved', 'custom_rejected'].includes(
                          invoiceStatus
                        )
                      "
                      small
                    >
                      Upload New
                    </v-btn>
                  </div>
                </div>
                <v-text-field
                  v-model="formData.declaration_id"
                  label="Declaration id"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Declaration id is required.',
                  ]"
                  class="required"
                  :disabled="
                    ['custom_approved', 'custom_rejected'].includes(
                      invoiceStatus
                    )
                  "
                ></v-text-field>
                <!-- <v-file-input
              v-model="formData.bill_of_entry_pdf"
              show-size
              accept=".pdf"
              label="Bill Of Entry PDF Upload"
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
              class="required"
              prepend-icon=""
              append-icon="mdi-paperclip"
              v-if="!isURL(formData.bill_of_entry_pdf)"
            >
            </v-file-input>
            <div class="d-flex justify-space-between my-4" v-else>
              <label>Bill Of Entry PDF</label>
              <div>
                <v-btn
                  v-if="formData.bill_of_entry_pdf"
                  :href="formData.bill_of_entry_pdf | assetURL"
                  target="_blank"
                  color="success"
                  class="mr-1"
                  small
                >
                  View
                </v-btn>
                <v-btn
                  color="primary"
                  @click="formData.bill_of_entry_pdf = null"
                  v-if="
                    userRole.code === 'AD' &&
                    !['custom_approved', 'custom_rejected'].includes(
                      invoiceStatus
                    )
                  "
                  small
                >
                  Upload New
                </v-btn>
              </div>
            </div> -->
              </template>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              class="mr-1"
              color="primary"
              :loading="loading1"
              @click="downloadReport1()"
              v-if="['custom_initiated'].includes(invoiceStatus)"
            >
              <v-icon small>mdi-download</v-icon>
              Download Report1
            </v-btn>
            <v-btn
              class="mr-1"
              color="primary"
              :loading="loading2"
              @click="downloadReport2()"
              v-if="['custom_initiated'].includes(invoiceStatus)"
            >
              <v-icon small>mdi-download</v-icon>
              Download Report2
            </v-btn>
            <v-btn
              v-if="
                !['custom_approved', 'custom_rejected'].includes(invoiceStatus)
              "
              class="mr-1"
              color="primary"
              @click="save()"
              :loading="loader"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <Quote
        :inv-id="+$route.params.id"
        :freight-id="formData.freight_id"
        @created="onQuoteCreated"
        v-if="
          formData.freight_id ||
          ['new', 'on_hold', 'package_list_approved_by_rsa'].includes(
            invoiceStatus
          )
        "
      />
    </v-row>
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
import { mapActions, mapGetters } from "vuex";
import { shippedByRSAStatues, invoiceStatues } from "@/config/data";
import Sample from "@/views/front/invoices/Sample";
import Quote from "@/views/front/invoices/Quote";

export default {
  components: {
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
      dateMenu: false,
      search: null,
      statusItems: [],
      loading1: false,
      loading2: false,
      invoiceStatus: "",
      activeBackgroundStep1: "#4daeeb",
      activeBackgroundStep2: "#b5aeae",
      activeBackgroundStep3: "#b5aeae",
      activeBackgroundStep4: "#b5aeae",
      activeBackgroundStep5: "#b5aeae",
      showVideoUrlInvoicePackage: false,
      showVideoUrlRequestQuote: false,
    };
  },

  created() {
    this.fetchInvoiceDetails();
  },

  methods: {
    ...mapActions([
      "getInvoiceDetails",
      "updateInvoiceDetails",
      "downloadInvReport1",
      "downloadInvReport2",
      "snackBar",
    ]),
    isStatusDisabled(status) {
      if (!status) return;
      return (
        this.userRole.code !== "AD" &&
        this.invoiceStatus !== "package_list_approved_by_rsa" &&
        [
          "package_list_approved_by_rsa",
          "rejected_by_rsa",
          "custom_initiated",
          "custom_approved",
          "custom_rejected",
        ].includes(status)
      );
    },
    fetchInvoiceDetails() {
      this.loader = true;
      this.getInvoiceDetails(this.$route.params.id)
        .then((res) => {
          this.loader = false;
          this.formData = res.data;
          if (this.formData.status == "on_hold") {
            this.activeBackgroundStep1 = "#55ad37";
            this.activeBackgroundStep2 = "#4daeeb";
            this.activeBackgroundStep3 = "#b5aeae";
            this.activeBackgroundStep4 = "#b5aeae";
            this.activeBackgroundStep5 = "#b5aeae";
          } else if (this.formData.status == "package_list_approved_by_rsa") {
            this.activeBackgroundStep1 = "#55ad37";
            this.activeBackgroundStep2 = "#4daeeb";
            this.activeBackgroundStep3 = "#b5aeae";
            this.activeBackgroundStep4 = "#b5aeae";
            this.activeBackgroundStep5 = "#b5aeae";
          } else if (this.formData.status == "payment_pending_from_seller") {
            this.activeBackgroundStep1 = "#55ad37";
            this.activeBackgroundStep2 = "#55ad37";
            this.activeBackgroundStep3 = "#4daeeb";
            this.activeBackgroundStep4 = "#b5aeae";
            this.activeBackgroundStep5 = "#b5aeae";
          } else if (this.formData.status == "ready_to_be_shipped") {
            this.activeBackgroundStep1 = "#55ad37";
            this.activeBackgroundStep2 = "#55ad37";
            this.activeBackgroundStep3 = "#55ad37";
            this.activeBackgroundStep4 = "#4daeeb";
            this.activeBackgroundStep5 = "#b5aeae";
          } else if (this.formData.status == "shipped") {
            this.activeBackgroundStep1 = "#55ad37";
            this.activeBackgroundStep2 = "#55ad37";
            this.activeBackgroundStep3 = "#55ad37";
            this.activeBackgroundStep4 = "#4daeeb";
            this.activeBackgroundStep5 = "#b5aeae";
          } else if (this.formData.status == "custom_initiated") {
            this.activeBackgroundStep1 = "#55ad37";
            this.activeBackgroundStep2 = "#55ad37";
            this.activeBackgroundStep3 = "#55ad37";
            this.activeBackgroundStep4 = "#55ad37";
            this.activeBackgroundStep5 = "#4daeeb";
          } else if (this.formData.status == "custom_approved") {
            this.activeBackgroundStep1 = "#55ad37";
            this.activeBackgroundStep2 = "#55ad37";
            this.activeBackgroundStep3 = "#55ad37";
            this.activeBackgroundStep4 = "#55ad37";
            this.activeBackgroundStep5 = "#55ad37";
          } else if (this.formData.status == "custom_rejected") {
            this.activeBackgroundStep1 = "#55ad37";
            this.activeBackgroundStep2 = "#55ad37";
            this.activeBackgroundStep3 = "#55ad37";
            this.activeBackgroundStep4 = "#55ad37";
            this.activeBackgroundStep5 = "#f7454b";
          } else if (this.formData.status == "rejected_by_rsa") {
            this.activeBackgroundStep1 = "#55ad37";
            this.activeBackgroundStep2 = "#f7454b";
            this.activeBackgroundStep3 = "#f7454b";
            this.activeBackgroundStep4 = "#f7454b";
            this.activeBackgroundStep5 = "#f7454b";
          } else if (this.formData.status == "rejected_by_seller") {
            this.activeBackgroundStep1 = "#55ad37";
            this.activeBackgroundStep2 = "#f7454b";
            this.activeBackgroundStep3 = "#f7454b";
            this.activeBackgroundStep4 = "#f7454b";
            this.activeBackgroundStep5 = "#f7454b";
          } else {
            this.activeBackgroundStep1 = "#4daeeb";
            this.activeBackgroundStep2 = "#b5aeae";
            this.activeBackgroundStep3 = "#b5aeae";
            this.activeBackgroundStep4 = "#b5aeae";
            this.activeBackgroundStep5 = "#b5aeae";
          }
          this.invoiceStatus = res.data.status;
          this.statusItems = invoiceStatues[res.data.status].map((i) => {
            i.disabled =
              this.isStatusDisabled(i.value) ||
              (i.value === "ready_to_be_shipped" &&
                this.invoiceStatus !== i.value);
            return i;
          });
        })
        .catch(() => {
          this.loader = false;
        });
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const payload = new FormData();
      for (const field in this.formData) {
        if (Object.prototype.hasOwnProperty.call(this.formData, field)) {
          const fieldVal = this.formData[field];
          if ("File" in window && fieldVal instanceof File) {
            payload.append(field, fieldVal, fieldVal.name);
          } else if (
            ![
              "invoice_file_path",
              "shipping_details_file_path",
              "custom_declaration_pdf",
              "freight_id",
            ].includes(field)
          ) {
            payload.append(field, fieldVal === null ? "" : fieldVal);
          }
        }
      }
      this.loader = true;
      this.updateInvoiceDetails({
        id: this.$route.params.id,
        data: payload,
      })
        .then((res) => {
          this.loader = false;
          this.statusItems = invoiceStatues[this.formData.status];
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.invoiceStatus = this.formData.status;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    downloadReport1() {
      this.loading1 = true;
      this.downloadInvReport1(this.$route.params.id)
        .then((res) => {
          this.fileDownload(res);
          this.loading1 = false;
        })
        .catch(() => {
          this.loading1 = false;
        });
    },
    downloadReport2() {
      this.loading2 = true;
      this.downloadInvReport2(this.$route.params.id)
        .then((res) => {
          this.fileDownload(res);
          this.loading2 = false;
        })
        .catch(() => {
          this.loading2 = false;
        });
    },
    onQuoteCreated(freightId) {
      Object.assign(this.formData, { freight_id: freightId });
      this.$forceUpdate();
    },
    checkIsItemDisabled(item) {
      if (this.userRole.code == "SE") {
        if (item.value == "payment_pending_from_seller") {
          return (item.disabled = true);
        }
      }
      if (item.value == "package_list_approved_by_rsa") {
        return (item.disabled = true);
      }
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
.step-process {
  display: inline-flex;
  .step1,
  .step2,
  .step3,
  .step4,
  .step5 {
    position: relative;
    text-align: center;
    margin: 0.5rem;
    p {
      width: 130px;
      height: 90px;
      color: white;
      font-size: 13px;
      padding: 0.5rem;
      margin-top: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &:not(:last-child):after {
      content: "\2192";
      width: 50px;
      height: 100px;
      position: absolute;
      top: 70px;
      right: -33px;
    }
  }
}
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
