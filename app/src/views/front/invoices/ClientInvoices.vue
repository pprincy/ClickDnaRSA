<!-- #64 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="_headers"
      :items="invoices"
      :options.sync="options"
      :server-items-length="total"
      :loading="invoicesLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="12"
            md="3"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              IOR Packages
            </v-toolbar-title>
          </v-col>
          <v-col cols="12" md="6" class="pt-0">
            <v-row>
              <v-col class="d-flex align-end">
                <v-autocomplete
                  v-model="clientId"
                  :items="clients"
                  :loading="clientLoader"
                  class="pt-0"
                  hide-no-data
                  item-text="name"
                  item-value="id"
                  label="Select client to load invoices"
                  placeholder="Start typing to Search"
                  prepend-icon="mdi-database-search"
                  @change="refreshInvoices()"
                ></v-autocomplete>
              </v-col>
              <v-col v-if="clientId">
                <Search
                  :search-options="searchOptions"
                  :val="searchType"
                  :items="allInvStatuses"
                  @changeText="(res) => (search = res)"
                  @changeType="(res) => (searchType = res)"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              color="primary"
              dark
              class="mr-4 float-right"
              @click="addInvoice()"
            >
              Add IOR Package
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.invoice_no`]="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: 'InvoiceEdit',
            params: { id: item.id },
          }"
        >
          <strong class="text-h6 black--text font-weight-bold"
            >{{ item.invoice_no }}
          </strong>
        </router-link>
      </template>
      <template v-slot:[`item.rsa_shipping_status`]="{ item }">
        <strong>
          {{ item.rsa_shipping_status | statusStr }}
        </strong>
      </template>
      <template v-slot:[`item.status_text`]="{ item }">
        <div class="d-flex flex-column" v-if="statusStyles[item.status]">
          <v-progress-linear
            v-if="statusStyles[item.status].bar"
            :color="statusStyles[item.status].color"
            :value="statusStyles[item.status].value"
            height="7"
          ></v-progress-linear>
          <strong
            class="mt-1"
            :class="{ [statusStyles[item.status].color + '--text']: true }"
          >
            {{ item.status_text }}
          </strong>
        </div>
      </template>
      <template v-slot:[`item.invoice_date`]="{ item }">
        {{ item.invoice_date | moment("DD MMM, YYYY") }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click="editInvoice(item.id)" icon>
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit IOR Package</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click="viewPackList(item)" icon>
              <v-icon small>mdi-receipt</v-icon>
            </v-btn>
          </template>
          <span>View Packing List</span>
        </v-tooltip>
        <v-tooltip v-if="item.invoice_file_path" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              :href="item.invoice_file_path | assetURL"
              target="_blank"
              icon
            >
              <v-icon small>mdi-file</v-icon>
            </v-btn>
          </template>
          <span>View IOR Package</span>
        </v-tooltip>
        <v-tooltip
          v-if="
            ['custom_initiated', 'custom_approved', 'custom_rejected'].includes(
              item.status
            )
          "
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              :to="{ name: 'InboundEntries', params: { id: item.id } }"
              icon
            >
              <v-icon small>mdi-view-list</v-icon>
            </v-btn>
          </template>
          <span>Inbound Entries</span>
        </v-tooltip>
        <v-tooltip v-if="item.freight_id" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              @click="openQuote(item.id, item.freight_id)"
              icon
            >
              <v-icon
                :color="
                  item.freight_status === 0
                    ? 'warning'
                    : item.freight_status === 5
                    ? 'success'
                    : item.freight_status === 6
                    ? 'error'
                    : 'info'
                "
                small
                >mdi-comment-quote</v-icon
              >
            </v-btn>
          </template>
          <span>{{ displayStatus(item.freight_status) }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <PackingList
      :dialog="packDialog"
      :invoice="editedItem"
      @close="packDialog = false"
    />
    <RequestQuote
      :dialog="quoteDialog"
      :invId="invId"
      :freight-id="freightId"
      @close="quoteDialog = false"
    />
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Search from "@/components/front/common/Search";
import PackingList from "@/views/front/invoices/PackingList";
import RequestQuote from "@/views/front/invoices/RequestQuote";
import {
  shippedByRSAStatues,
  invStatusBarItems,
  invStatuses,
  quoteStatuses,
} from "@/config/data";

export default {
  components: {
    Search,
    PackingList,
    RequestQuote,
  },
  computed: {
    ...mapGetters(["userRole"]),
    _headers() {
      return this.headers.filter((i) =>
        this.userRole.code !== "AD" ? i.value !== "seller_name" : true
      );
    },
    statusStyles() {
      return invStatusBarItems;
    },
    allInvStatuses() {
      return Object.keys(invStatuses).map((i) => {
        return {
          text: invStatuses[i],
          value: i,
        };
      });
    },
  },
  filters: {
    statusStr(key) {
      if (!shippedByRSAStatues) return "";
      return shippedByRSAStatues[key];
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
        text: "Invoice Date",
        value: "invoice_date",
      },
      {
        text: "Seller",
        value: "seller_name",
      },
      {
        text: "Status",
        value: "status",
      },
    ],
    headers: [
      {
        text: "Seller",
        value: "seller_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Invoice Number",
        value: "invoice_no",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Invoice Date",
        value: "invoice_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Shipped By RSA?",
        value: "rsa_shipping_status",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Status",
        value: "status_text",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
        width: "180px",
      },
    ],
    invoices: [],
    options: {},
    total: 0,
    invoicesLoader: false,
    clientLoader: false,
    clients: [],
    clientId: null,
    packDialog: false,
    editedItem: null,
    quoteStatus: "Available",
    invId: null,
    freightId: null,
    quoteDialog: false,
  }),

  watch: {
    options: {
      handler() {
        this.fetchInvoices();
      },
      deep: true,
    },
    search() {
      this.fetchInvoices();
    },
    searchType() {
      if (this.search) this.fetchInvoices();
    },
    userRole() {
      this.fetchClientList();
    },
  },

  created() {
    this.fetchClientList();
    if (+this.$route.query.id) {
      this.clientId = +this.$route.query.id;
    }
  },

  methods: {
    ...mapActions(["getInvoices", "getClients", "snackBar"]),
    fetchInvoices() {
      if (!this.clientId) return;
      this.invoices = [];
      this.invoicesLoader = true;
      this.getInvoices({
        client_id: this.clientId,
        params: {
          ...this.options,
          search: this.search,
          type: this.searchType,
          status: this.$route.query.status,
        },
      })
        .then((res) => {
          this.invoicesLoader = false;
          this.invoices = res.data.records.map((item) => {
            this.$set(item, "loading1", false);
            this.$set(item, "loading2", false);
            return item;
          });
          this.total = res.data.total;
        })
        .catch(() => {
          this.invoicesLoader = false;
        });
    },
    refreshInvoices() {
      this.invoices = [];
      this.options = {};
      if (this.clientId !== +this.$route.query.id) {
        this.$router.replace({
          query: {
            id: this.clientId,
            status: this.$route.query.status,
          },
        });
      }
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
        })
        .catch(() => {
          this.clientLoader = false;
        });
    },
    addInvoice() {
      this.$router.push({
        name: "InvoiceAdd",
      });
    },
    editInvoice(id) {
      this.$router.push({
        name: "InvoiceEdit",
        params: { id },
      });
    },
    viewPackList(item) {
      this.editedItem = item;
      this.packDialog = true;
    },
    openQuote(id, freightId) {
      this.invId = id;
      this.freightId = freightId;
      this.quoteDialog = true;
    },
    displayStatus(status) {
      return quoteStatuses.find((i) => i.value === status)?.text;
    },
  },
};
</script>
