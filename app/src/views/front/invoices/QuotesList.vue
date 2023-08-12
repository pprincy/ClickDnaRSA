<!-- #68 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="quotes"
      :options.sync="options"
      :server-items-length="total"
      :loading="quotesLoader"
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
              List of Quote Requested by Seller
            </v-toolbar-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              :items="statusItems"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.invoice_number`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: 'InvoiceEdit',
            params: { id: item.invoice_id },
          }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.invoice_number }}
          </strong>
        </router-link>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        {{ item.created_at | localMoment | moment("DD MMM, YYYY") }}
      </template>
      <template v-slot:[`item.quote_sent_to_seller_date`]="{ item }">
        <span v-if="item.quote_sent_to_seller_date">
          {{
            item.quote_sent_to_seller_date
              | localMoment
              | moment("DD MMM, YYYY")
          }}
        </span>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <strong>
          {{ item.status | statusStr }}
        </strong>
      </template>
      <template v-slot:[`item.type`]="{ item }">
        <strong>
          {{ item.type | freightTypeStr }}
        </strong>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip v-if="[0, 2].includes(item.status)" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click="offerQuote(item)" icon>
              <v-icon small>mdi-reply</v-icon>
            </v-btn>
          </template>
          <span>Offer Quote</span>
        </v-tooltip>
        <div style="display: inline-block; width: 36px" v-else>&nbsp;</div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click="viewPackList(item)" icon>
              <v-icon small>mdi-receipt</v-icon>
            </v-btn>
          </template>
          <span>View Packing List</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <PackingList
      :dialog="packDialog"
      :invoice="{
        id: editedItem.invoice_id,
        invoice_no: editedItem.invoice_no,
        seller_name: editedItem.seller_name,
      }"
      @close="packDialog = false"
    />
    <OfferQuote
      :dialog="offerDialog"
      :freight-id="freightId"
      :default-item="editedItem"
      @refreshData="fetchQuotes()"
      @close="offerDialog = false"
    />
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import Search from "@/components/front/common/Search";
import PackingList from "@/views/front/invoices/PackingList";
import OfferQuote from "@/views/front/invoices/OfferQuote";
import { freightTypes, quoteStatuses } from "@/config/data";

export default {
  components: {
    Search,
    PackingList,
    OfferQuote,
  },
  computed: {
    statusItems() {
      return quoteStatuses;
    },
  },
  filters: {
    statusStr(key) {
      if (!quoteStatuses) return "";
      return quoteStatuses.find((i) => i.value === key).text;
    },
    freightTypeStr(key) {
      if (!freightTypes) return "";
      return freightTypes.find((i) => i.value === key).text;
    },
  },
  data: () => ({
    search: "",
    searchType: "client_name",
    searchOptions: [
      {
        text: "Package Invoice Number",
        value: "invoice_number",
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
        text: "Status",
        value: "status",
      },
    ],
    headers: [
      {
        text: "Package Invoice Number",
        value: "invoice_number",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Client Name",
        value: "client_name",
        class: "body-1 font-weight-bold",
        width: "180px",
      },
      {
        text: "Seller Name",
        value: "seller_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Freight type",
        value: "type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Status",
        value: "status",
        class: "body-1 font-weight-bold",
        width: "180px",
      },
      {
        text: "Requested Date",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Offer sent date",
        value: "quote_sent_to_seller_date",
        class: "body-1 font-weight-bold",
        width: "180px",
      },
      {
        text: "Created By",
        value: "created_by",
        class: "body-1 font-weight-bold",
        width: "180px",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
        width: "180px",
      },
    ],
    quotes: [],
    editedItem: {},
    options: {},
    total: 0,
    quotesLoader: false,
    freightId: 0,
    packDialog: false,
    offerDialog: false,
  }),

  watch: {
    options: {
      handler() {
        this.fetchQuotes();
      },
      deep: true,
    },
    search() {
      this.fetchQuotes();
    },
    searchType() {
      if (this.search) this.fetchQuotes();
    },
  },

  mounted() {
    if (+this.$route.query.id) {
      this.offerQuote({
        id: +this.$route.query.id,
        seller_name: this.$route.query.seller_name,
        client_name: this.$route.query.client_name,
      });
    }
  },

  methods: {
    ...mapActions(["getQuoteList", "snackBar"]),
    fetchQuotes() {
      this.quotes = [];
      this.quotesLoader = true;
      this.getQuoteList({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.quotesLoader = false;
          this.quotes = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.quotesLoader = false;
        });
    },
    viewPackList(item) {
      this.editedItem = item;
      this.packDialog = true;
    },
    offerQuote(item) {
      this.freightId = item.id;
      this.editedItem = item;
      this.offerDialog = true;
    },
  },
};
</script>
