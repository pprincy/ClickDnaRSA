<!-- #65 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="inEntries"
      :options.sync="options"
      :server-items-length="total"
      :loading="inEntriesLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-card flat>
          <v-card-title class="text-h6">
            <v-btn @click="$router.go(-1)" icon small>
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            Inbound Entries
          </v-card-title>
          <v-card-text>
            <v-card class="pb-4" color="grey lighten-4" flat>
              <v-row>
                <v-col>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">
                        Invoice Number
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ invoiceNumber }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">
                        Invoice Date
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ invoiceDate | moment("DD MMM, YYYY") }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">
                        Client
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ clientName }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">
                        Seller
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ sellerName }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    headers: [
      {
        text: "ITEM_CODE",
        value: "item_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "SELLER_SKU",
        value: "seller_sku",
        class: "body-1 font-weight-bold",
      },
      {
        text: "ITEM_DESCRIPTION",
        value: "item_description",
        class: "body-1 font-weight-bold",
      },
      {
        text: "FNSKU",
        value: "fnsku",
        class: "body-1 font-weight-bold",
      },
      {
        text: "QUANTITY",
        value: "quantity",
        class: "body-1 font-weight-bold",
      },
      {
        text: "UNIT_OF_MEASURE",
        value: "unit_of_measure",
        class: "body-1 font-weight-bold",
      },
      {
        text: "COUNTRY_OF_ORIGIN",
        value: "country",
        class: "body-1 font-weight-bold",
      },
      {
        text: "UNIT_OF_WEIGHT",
        value: "unit_of_weight",
        class: "body-1 font-weight-bold",
      },
      {
        text: "CURRENCY",
        value: "currency",
        class: "body-1 font-weight-bold",
      },
      {
        text: "UNIT_PRICE",
        value: "unit_price",
        class: "body-1 font-weight-bold",
      },
      {
        text: "TOTAL_WEIGHT",
        value: "total_weight",
        class: "body-1 font-weight-bold",
      },
      {
        text: "TOTAL_PRICE",
        value: "total_price",
        class: "body-1 font-weight-bold",
      },
      {
        text: "HS_CODE",
        value: "hs_code",
        class: "body-1 font-weight-bold",
      },
    ],
    inEntries: [],
    options: {},
    total: 0,
    inEntriesLoader: false,
    invoiceNumber: null,
    invoiceDate: null,
    sellerName: null,
    clientName: null,
  }),

  watch: {
    options: {
      handler() {
        this.fetchInvInEntries();
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions(["getInvInboundEntries", "snackBar"]),
    fetchInvInEntries() {
      this.inEntries = [];
      this.inEntriesLoader = true;
      this.getInvInboundEntries({
        id: this.$route.params.id,
        params: this.options,
      })
        .then((res) => {
          this.inEntriesLoader = false;
          this.inEntries = res.data.records;
          this.total = res.data.total;
          this.invoiceNumber = res.data.invoice_number;
          this.invoiceDate = res.data.invoice_date;
          this.sellerName = res.data.seller_name;
          this.clientName = res.data.client_name;
        })
        .catch(() => {
          this.inEntriesLoader = false;
        });
    },
  },
};
</script>
