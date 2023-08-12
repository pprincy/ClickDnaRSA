<!-- #77 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="commercialList"
      :options.sync="options"
      :server-items-length="total"
      :loading="commercialListLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="12"
            md="4"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              RSA XML Invoice
            </v-toolbar-title>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.id`]="{ item }">
        <strong
          @click="load(item.id)"
          class="black--text font-weight-bold pointer"
          >{{ item.id }}
        </strong>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <span v-if="item.created_at">{{
          item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.transmission_creation_date`]="{ item }">
        <span v-if="item.transmission_creation_date">{{
          item.transmission_creation_date
            | localMoment
            | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.manifest_create_datetime`]="{ item }">
        <span v-if="item.manifest_create_datetime">{{
          item.manifest_create_datetime
            | localMoment
            | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.shipment_date`]="{ item }">
        <span v-if="item.shipment_date">{{
          item.shipment_date | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
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
        text: "Id",
        value: "id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Created At",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Sender Party Id",
        value: "sender_party_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Recipient Party Id",
        value: "recipient_party_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Transmission Creation Date",
        value: "transmission_creation_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Transmission Schema Version",
        value: "transmission_schema_version",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Warehouse Location Id",
        value: "warehouse_location_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Manifest Create Datetime",
        value: "manifest_create_datetime",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Carrier Internal Id",
        value: "carrier_internal_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Carrier Account Id",
        value: "carrier_account_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Technical Name",
        value: "technical_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Manifest Number",
        value: "manifest_number",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Carrier Manifest Id",
        value: "carrier_manifest_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Carrier Manifest Group Id",
        value: "carrier_manifest_group_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Shipment Date",
        value: "shipment_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Currency Code",
        value: "currency_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Amazon Tax Id",
        value: "amazon_tax_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Prepaid Collect",
        value: "prepaid_collect",
        class: "body-1 font-weight-bold",
      },
    ],
    commercialList: [],
    options: {},
    total: 0,
    editedItem: {},
    commercialListLoader: false,
  }),

  watch: {
    options: {
      handler() {
        this.fetchRsaXmlCommercialList();
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions(["getRsaXmlCommercialListing"]),
    fetchRsaXmlCommercialList() {
      this.commercialList = [];
      this.commercialListLoader = true;
      this.getRsaXmlCommercialListing({
        ...this.options,
      })
        .then((res) => {
          this.commercialListLoader = false;
          this.commercialList = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.commercialListLoader = false;
        });
    },
    load(val) {
      this.$router.push({
        name: "ManifestXMLDetails",
        params: {
          id: val,
        },
      });
    },
  },
};
</script>
<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
