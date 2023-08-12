<!-- #79 -->
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
              Commercial Invoice XML
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
      <template v-slot:[`item.datetime`]="{ item }">
        <span v-if="item.datetime">{{
          item.datetime | localMoment | moment("DD MMM, YYYY hh:mm A")
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
        text: "Sender Id",
        value: "sender_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Recipient Id",
        value: "recipient_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Document Type",
        value: "document_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Document Id",
        value: "document_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Date Time",
        value: "datetime",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Commercial Invoice Date",
        value: "commercial_invoice_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Carrier Internal Id",
        value: "carrier_internal_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Payment Terms",
        value: "payment_terms",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Incoterms",
        value: "incoterms",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Warehouse Location Id",
        value: "warehouse_location_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Carrier Internal Id",
        value: "carrier_internal_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Reason For Export",
        value: "reason_for_export",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Export License",
        value: "export_license",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Exporter Code",
        value: "exporter_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Importer Code",
        value: "importer_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Importer Vat Id",
        value: "importer_vat_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Vr ID",
        value: "vrid",
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
        this.fetchOutboundAMZCommercialList();
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions(["getOutboundAMZCommercialListing"]),
    fetchOutboundAMZCommercialList() {
      this.commercialList = [];
      this.commercialListLoader = true;
      this.getOutboundAMZCommercialListing({
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
        name: "CommercialInvoiceXMLDetails",
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
