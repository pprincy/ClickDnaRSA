<!-- #83 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="payments"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="id"
      show-expand
      :options.sync="options"
      :server-items-length="total"
      :loading="paymentsListLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="12"
            md="10"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              List of Payments
            </v-toolbar-title>
          </v-col>
          <v-col cols="12" md="2" class="d-flex justify-end pt-0">
            <v-btn
              color="primary"
              class="mr-2"
              small
              :loading="paymentsListLoader"
              @click="downloadPaymentListDetails()"
              >Download</v-btn
            >
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
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="payment-info">
          <div class="collapse-payment-heading d-flex justify-center">
            <div class="payment-details content-1">
              <label>Payment Mode:</label>
            </div>
            <div class="payment-details content-2">
              <label>Amount(USD):</label>
            </div>
            <div class="payment-details content-3">
              <label>Transaction Date:</label>
            </div>
            <div class="payment-details content-4">
              <label>Info:</label>
            </div>
          </div>
          <div
            v-for="(items, i) in item.transaction_detail_list"
            :key="i"
            class="collapse-payment-table d-flex justify-center"
          >
            <div class="payment-details content-1">
              <p>{{ items.payment_mode }}</p>
            </div>
            <div class="payment-details content-2">
              <p>{{ items.amount }}</p>
            </div>
            <div class="payment-details content-3">
              <p>{{ items.transaction_date }}</p>
            </div>
            <div class="payment-details content-4">
              <p>
                Bank Payment Mode: <br />
                {{ items.bank_payment_mode }}
              </p>
              <br />
              <p>
                Bank Transaction ID: <br />
                {{ items.bank_transaction_id }}
              </p>
            </div>
          </div>
        </td>
      </template>
      <template v-slot:[`items.transaction_date`]="{ items }">
        {{
          items.transaction_date | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}
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
  data() {
    return {
      search: "",
      searchType: "ramco_job_id",
      searchOptions: [
        {
          text: "Package Invoice Number",
          value: "invoice_no",
        },
        {
          text: "Seller Name",
          value: "seller_name",
        },
        {
          text: "Client Name",
          value: "client_name",
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
        },
        {
          text: "Seller Name",
          value: "seller_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Total Paid",
          value: "total_paid",
          class: "body-1 font-weight-bold",
          align: "right",
        },
      ],
      payments: [],
      expanded: [],
      singleExpand: false,
      options: {},
      total: 0,
      paymentsListLoader: false,
    };
  },

  watch: {
    options: {
      handler() {
        this.fetchPaymentList();
      },
      deep: true,
    },
    search() {
      this.fetchPaymentList();
    },
    searchType() {
      if (this.search) this.fetchPaymentList();
    },
  },

  methods: {
    ...mapActions(["getPaymentList", "downloadPaymentList"]),
    fetchPaymentList() {
      this.payments = [];
      this.paymentsListLoader = true;
      this.getPaymentList({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.paymentsListLoader = false;
          this.payments = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.paymentsListLoader = false;
        });
    },
    downloadPaymentListDetails() {
      this.paymentsListLoader = true;
      this.downloadPaymentList()
        .then((res) => {
          this.fileDownload(res);
          this.paymentsListLoader = false;
        })
        .catch(() => {
          this.paymentsListLoader = false;
        });
    },
  },
};
</script>

<style lang="scss">
.payment-info {
  background: #8080801a;
}
.collapse-payment-heading,
.collapse-payment-table {
  .payment-details {
    &.content-1 {
      width: 25%;
    }
    &.content-2 {
      width: 25%;
    }
    &.content-3 {
      width: 25%;
    }
    &.content-4 {
      width: 25%;
    }
    label {
      font-weight: bold;
    }
    p {
      margin-bottom: 0;
    }
  }
}
.collapse-payment-heading {
  padding: 1.25rem 8rem 0.5rem 8rem;
}
.collapse-payment-table {
  padding: 0 8rem 0.5rem 8rem;
}
</style>
