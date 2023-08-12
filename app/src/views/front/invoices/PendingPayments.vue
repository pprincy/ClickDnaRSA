<!-- #68 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="payments"
      :options.sync="options"
      :server-items-length="total"
      :loading="paymentsLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="12"
            md="8"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              Payment Pending from Seller
            </v-toolbar-title>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-end pt-0">
            <v-dialog
              v-model="dialog"
              max-width="550px"
              @keydown.esc="dialog = false"
              v-if="userCategory.user_category === 3"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="success"
                  :loading="fileLoader"
                  v-bind="attrs"
                  v-on="on"
                  class="mr-2"
                  small
                  >Additional Payment Link</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Additional Payment Link</span>
                </v-card-title>
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
                      @change="fetchSellerList(), reset()"
                    ></v-autocomplete>
                    <v-autocomplete
                      v-if="userCategory.user_category === 3"
                      v-model="formData.seller_id"
                      :items="sellers"
                      :loading="sellerLoader"
                      hide-no-data
                      item-text="name"
                      item-value="id"
                      label="Select Seller"
                      placeholder="Start typing to Search"
                      class="required"
                      @change="resetSeller()"
                      :rules="[(v) => !!v || 'Please select seller']"
                    ></v-autocomplete>
                    <v-select
                      v-model="formData.action"
                      label="Type of Request"
                      :items="invoiceTypeOfRequestList"
                      class="required"
                      @change="fetchInvoiceDetails()"
                      :rules="[(v) => !!v || 'Please select an option']"
                    ></v-select>
                    <v-autocomplete
                      v-model="formData.invoice_id"
                      :items="invoiceDetails"
                      :loading="invoiceDetailsLoader"
                      hide-no-data
                      item-text="invoice_name"
                      item-value="invoice_id"
                      label="Select Package Invoice No"
                      placeholder="Start typing to Search"
                      class="required"
                      @change="fetchInvoiceList()"
                      :rules="[
                        (v) => !!v || 'Please select Package Invoice No',
                      ]"
                    ></v-autocomplete>
                    <div id="invoiceId">
                      <v-text-field
                        v-model="formData.ramco_invoice_no"
                        label="Ramco Invoice ID"
                        v-if="formData.action === 'create_invoice'"
                        :rules="[
                          (v) =>
                            (v && !!v.trim()) || 'Ramco Invoice ID is required',
                        ]"
                        class="required"
                      ></v-text-field>
                    </div>
                    <div id="amt">
                      <v-text-field
                        label="Amount"
                        type="number"
                        v-model.number="formData.amount"
                        v-if="
                          formData.action === 'create_invoice' ||
                          formData.action === 'update_invoice'
                        "
                        class="required"
                        :rules="[
                          (v) =>
                            (v !== '' && v !== undefined) ||
                            'Amount is required',
                          (v) => v > 0 || 'Amount should be greater than 0',
                        ]"
                      >
                        <template v-slot:append>
                          <strong>USD</strong>
                        </template>
                      </v-text-field>
                    </div>
                    <p
                      v-if="
                        formData.action === 'create_invoice' ||
                        formData.action === 'update_invoice'
                      "
                    >
                      Ramco Job ID: <span id="ramcoJobId"></span>
                    </p>
                    <p v-if="formData.action === 'update_invoice'">
                      Amount: <span id="dispAmtId"></span>
                    </p>
                    <p v-if="formData.action === 'update_invoice'">
                      Ramco Invoice No: <span id="ramcoInvId"></span>
                    </p>
                    <p v-if="formData.action === 'update_invoice'" hidden>
                      Finance Id: <span id="financeId"></span>
                    </p>
                    <p v-if="formData.action === 'update_invoice'" hidden>
                      Client Id: <span id="clientId"></span>
                    </p>
                    <v-btn
                      color="success"
                      dark
                      class="mt-3 ml-3"
                      :loading="submitLoader"
                      @click="submitInvoice()"
                    >
                      Submit
                    </v-btn>
                    <v-btn
                      class="mt-3 ml-3"
                      @click="(dialog = false), resetForm()"
                    >
                      Cancel
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-btn
              color="primary"
              class="mr-2"
              small
              :loading="downloader"
              @click="downloadPendingPaymentDetails()"
              >Download</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" class="mb-2">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            /> </v-col
        ></v-row>
        <UpdatePayment
          :default-item="editedItem"
          :dialog="editDialog"
          @close="editDialog = false"
          @refreshData="fetchPendingPayments()"
        />
      </template>
      <template v-slot:[`item.invoice_no`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: 'InvoiceEdit',
            params: { id: item.invoice_id },
          }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.invoice_no }}
          </strong>
        </router-link>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <span v-if="item.created_at">{{
          item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.total_amount`]="{ item }">
        {{ item.total_amount | money }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click="editItem(item)" icon>
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit</span>
        </v-tooltip>
        <v-tooltip v-if="item.link" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              :href="item.link"
              target="_blank"
              icon
            >
              <v-icon>mdi-cash</v-icon>
            </v-btn>
          </template>
          <span>Pay Online</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Search from "@/components/front/common/Search";
import UpdatePayment from "@/views/front/invoices/UpdatePayment";
import { invoiceTypeOfRequest } from "@/config/data";

export default {
  components: {
    Search,
    UpdatePayment,
  },
  computed: {
    ...mapGetters(["userCategory"]),
    invoiceTypeOfRequestList() {
      return Object.keys(invoiceTypeOfRequest).map((i) => {
        return {
          text: invoiceTypeOfRequest[i],
          value: i,
        };
      });
    },
  },
  data: () => ({
    search: "",
    searchType: "invoice_no",
    searchOptions: [
      {
        text: "Package Invoice Number",
        value: "invoice_no",
      },
      {
        text: "Client Name",
        value: "client_name",
      },
      {
        text: "Seller Name",
        value: "seller_name",
      },
      {
        text: "Ramco Job ID",
        value: "ramco_job_id",
      },
      {
        text: "Ramco Invoice ID",
        value: "ramco_invoice_id",
      },
    ],
    headers: [
      {
        text: "Package Invoice Number",
        value: "invoice_no",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ramco Job ID",
        value: "ramco_job_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ramco Invoice ID",
        value: "ramco_invoice_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Client Name",
        value: "client_name",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Seller Name",
        value: "seller_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Amount (in USD)",
        value: "total_amount",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Paid (in USD)",
        value: "total_paid",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Created At",
        value: "created_at",
        class: "body-1 font-weight-bold",
        width: "180px",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
        align: "right",
        width: "180px",
      },
    ],
    payments: [],
    options: {},
    total: 0,
    editedItem: {},
    paymentsLoader: false,
    editDialog: false,
    downloader: false,
    dialog: false,
    clients: [],
    clientLoader: false,
    formData: {},
    fileLoader: false,
    sellers: [],
    sellerLoader: false,
    invoiceDetails: [],
    invoiceDetailsLoader: false,
    submitLoader: false,
    invoiceList: {},
    invList: {},
  }),

  watch: {
    options: {
      dialog(val) {
        val || this.close();
      },
      handler() {
        this.fetchPendingPayments();
      },
      deep: true,
    },
    search() {
      this.fetchPendingPayments();
    },
    searchType() {
      if (this.search) this.fetchPendingPayments();
    },
  },

  created() {
    this.fetchClientList();
  },

  methods: {
    ...mapActions([
      "getPendingPaymentList",
      "downloadPendingPayment",
      "getClients",
      "getSellers",
      "getInvoiceDetail",
      "submitInvoiceDetails",
      "snackBar",
    ]),
    reset() {
      this.formData = {
        action: "",
        invoice_id: "",
        ramco_invoice_no: "",
        amount: "",
      };
      this.$refs.form.resetValidation();
    },
    resetSeller() {
      this.formData = {
        client_id: this.formData.client_id,
        seller_id: this.formData.seller_id,
        action: "",
        invoice_id: "",
        ramco_invoice_no: "",
        amount: "",
      };
    },
    resetForm() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
    fetchPendingPayments() {
      this.payments = [];
      this.paymentsLoader = true;
      this.getPendingPaymentList({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.paymentsLoader = false;
          this.payments = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.paymentsLoader = false;
        });
    },
    editItem(item) {
      this.editedItem = item;
      this.editDialog = true;
    },
    downloadPendingPaymentDetails() {
      this.downloader = true;
      this.downloadPendingPayment()
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },
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
      if (this.userCategory.user_category !== 3) return;
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
          if (res.data.length == 0) {
            var invoiceField = document.getElementById("invoiceId");
            invoiceField.style.display = "none";
            var amtField = document.getElementById("amt");
            amtField.style.display = "none";
          }
        })
        .catch(() => {
          this.sellerLoader = false;
        });
    },

    fetchInvoiceDetails() {
      if (!(this.formData.seller_id && this.formData.action)) return;
      this.invoiceDetailsLoader = true;
      this.formData = {
        client_id: this.formData.client_id,
        seller_id: this.formData.seller_id,
        action: this.formData.action,
        invoice_id: "",
        ramco_invoice_no: "",
        amount: "",
      };
      this.getInvoiceDetail({
        params: {
          seller_id: this.formData.seller_id,
          action: this.formData.action,
        },
      })
        .then((res) => {
          this.invoiceDetailsLoader = false;
          this.invoiceDetails = res.data;
          this.invoiceList = {};
          document.getElementById("ramcoJobId").innerHTML = "";
          res.data.forEach((value) => {
            this.invoiceList[value.invoice_id] = value;
          });
          if (res.data.length == 0) {
            var invoiceField = document.getElementById("invoiceId");
            invoiceField.style.display = "none";
            var amtField = document.getElementById("amt");
            amtField.style.display = "none";
          } else {
            document.getElementById("invoiceId").style.display = "block";

            document.getElementById("amt").style.display = "block";
          }
        })
        .catch(() => {
          this.invoiceDetailsLoader = false;
          var invoiceField = document.getElementById("invoiceId");
          invoiceField.style.display = "none";
          var amtField = document.getElementById("amt");
          amtField.style.display = "none";
        });
    },
    fetchInvoiceList() {
      var invID = this.formData.invoice_id;
      this.invList = this.invoiceList[invID];
      this.formData = {
        client_id: this.formData.client_id,
        seller_id: this.formData.seller_id,
        action: this.formData.action,
        invoice_id: this.formData.invoice_id,
        ramco_invoice_no: "",
        amount: "",
      };
      document.getElementById("ramcoJobId").innerHTML =
        this.invList.ramco_job_id;
      document.getElementById("dispAmtId").innerHTML = this.invList.disp_amount;
      document.getElementById("ramcoInvId").innerHTML =
        this.invList.ramco_invoice_no;
      document.getElementById("financeId").innerHTML = this.invList.finance_id;
      document.getElementById("clientId").innerHTML = this.invList.client_id;
    },
    submitInvoice() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.submitLoader = true;
      const payload = new FormData();
      payload.append("invoice_id", this.formData.invoice_id);
      payload.append("action", this.formData.action);
      payload.append("amount", this.formData.amount);
      payload.append("ramco_invoice_no", this.formData.ramco_invoice_no);
      payload.append("finance_id", this.invList.finance_id);
      payload.append("client_id", this.invList.client_id);
      this.submitInvoiceDetails(payload)
        .then((res) => {
          this.resetForm();
          this.submitLoader = false;
          this.dialog = false;
          if (res && res.status_code == "200" && res.data) {
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
          } else {
            this.snackBar({
              color: "error",
              message: "res.data.message",
            });
            this.close();
          }
        })
        .catch(() => {
          this.submitLoader = false;
        });
    },
    close() {
      this.dialog = false;
      this.restForm();
    },
  },
};
</script>
