<!-- #57 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="invoices"
      :loading="invoicesLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="text-h6">IOR Package</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="addInvoice()">
            Add IOR Package
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.invoice_count`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{ name: 'ClientInvoices', query: { id: item.id } }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.invoice_count }}
          </strong>
        </router-link>
      </template>
      <template v-slot:[`item.package_list_approved_by_rsa`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: 'ClientInvoices',
            query: { id: item.id, status: 'package_list_approved_by_rsa' },
          }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.package_list_approved_by_rsa }}
          </strong>
        </router-link>
      </template>
      <template v-slot:[`item.payment_pending_from_seller`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: 'ClientInvoices',
            query: { id: item.id, status: 'payment_pending_from_seller' },
          }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.payment_pending_from_seller }}
          </strong>
        </router-link>
      </template>
      <template v-slot:[`item.ready_to_be_shipped`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: 'ClientInvoices',
            query: { id: item.id, status: 'ready_to_be_shipped' },
          }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.ready_to_be_shipped }}
          </strong>
        </router-link>
      </template>
      <template v-slot:[`item.shipped`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: 'ClientInvoices',
            query: { id: item.id, status: 'shipped' },
          }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.shipped }}
          </strong>
        </router-link>
      </template>
      <template v-slot:[`item.on_hold`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: 'ClientInvoices',
            query: { id: item.id, status: 'on_hold' },
          }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.on_hold }}
          </strong>
        </router-link>
      </template>
      <template v-slot:[`item.custom_initiated`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: 'ClientInvoices',
            query: { id: item.id, status: 'custom_initiated' },
          }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.custom_initiated }}
          </strong>
        </router-link>
      </template>
      <template v-slot:[`item.custom_approved`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: 'ClientInvoices',
            query: { id: item.id, status: 'custom_approved' },
          }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.custom_approved }}
          </strong>
        </router-link>
      </template>
    </v-data-table>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { invoiceTypeOfRequest } from "@/config/data";

export default {
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
    headers: [
      {
        text: "Client Name",
        value: "name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total IOR Package",
        value: "invoice_count",
        class: "body-1 font-weight-bold black--text",
      },
      {
        text: "On-Hold",
        value: "on_hold",
        class: "body-1 font-weight-bold red--text",
      },
      {
        text: "RSA to Send Payment details",
        value: "package_list_approved_by_rsa",
        class: "body-1 font-weight-bold yellow--text",
      },
      {
        text: "Payment pending from seller",
        value: "payment_pending_from_seller",
        class: "body-1 font-weight-bold orange--text",
      },
      {
        text: "Ready to be Shipped",
        value: "ready_to_be_shipped",
        class: "body-1 font-weight-bold blue--text",
      },
      {
        text: "Shipped",
        value: "shipped",
        class: "body-1 font-weight-bold yellow--text",
      },

      {
        text: "Customs Initiated",
        value: "custom_initiated",
        class: "body-1 font-weight-bold green--text",
      },
      {
        text: "Customs Approved",
        value: "custom_approved",
        class: "body-1 font-weight-bold green--text",
      },
    ],
    invoices: [],
    invoicesLoader: false,
  }),

  created() {
    this.fetchInvoices();
  },

  methods: {
    ...mapActions(["getInvoiceCounts", "snackBar"]),
    fetchInvoices() {
      this.invoices = [];
      this.invoicesLoader = true;
      this.getInvoiceCounts()
        .then((res) => {
          this.invoicesLoader = false;
          this.invoices = res.data;
        })
        .catch(() => {
          this.invoicesLoader = false;
        });
    },
    addInvoice() {
      this.$router.push({
        name: "InvoiceAdd",
      });
    },
  },
};
</script>
