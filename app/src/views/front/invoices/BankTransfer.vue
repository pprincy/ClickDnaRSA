<!-- #69 -->
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
            md="12"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              Bank Transfer
            </v-toolbar-title>
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
      <template v-slot:[`item.transaction_date`]="{ item }">
        {{ item.transaction_date | localMoment | moment("DD MMM, YYYY") }}
      </template>
      <template v-slot:[`item.amount`]="{ item }">
        {{ item.amount | money }}
      </template>
    </v-data-table>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import Search from "@/components/front/common/Search";

export default {
  components: {
    Search,
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
    ],
    headers: [
      {
        text: "Product",
        value: "product",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Seller Name",
        value: "seller_name",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Client Name",
        value: "client_name",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Ramco Job Id",
        value: "ramco_job_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ramco Invoice Id",
        value: "ramco_invoice_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Invoice Number",
        value: "invoice_no",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Bank Payment Mode",
        value: "payment_mode",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Transaction Date",
        value: "transaction_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Amount (in USD)",
        value: "amount",
        class: "body-1 font-weight-bold",
        align: "right",
      },
      {
        text: "Total Paid",
        value: "total_paid",
        class: "body-1 font-weight-bold",
        align: "right",
      },
    ],
    payments: [],
    options: {},
    total: 0,
    paymentsLoader: false,
  }),

  watch: {
    options: {
      handler() {
        this.fetchBankList();
      },
      deep: true,
    },
    search() {
      this.fetchBankList();
    },
    searchType() {
      if (this.search) this.fetchBankList();
    },
  },

  methods: {
    ...mapActions(["getBankTransferList", "snackBar"]),
    fetchBankList() {
      this.payments = [];
      this.paymentsLoader = true;
      this.getBankTransferList({
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
  },
};
</script>
