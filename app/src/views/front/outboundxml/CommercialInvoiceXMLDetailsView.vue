<!-- #80 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="shippmentDetailsHeaders"
      :items="shippmentDetailslList"
      :loading="shippmentDetailsLoader"
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
              Shippment Details
            </v-toolbar-title>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <span v-if="item.created_at">{{
          item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
    </v-data-table>
    <v-data-table
      :headers="costInfoHeaders"
      :items="costInfoList"
      :loading="costInfoLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-5">
          <v-col
            cols="12"
            md="4"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6"> Cost Info </v-toolbar-title>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <span v-if="item.created_at">{{
          item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
    </v-data-table>
    <v-data-table
      :headers="shipAddressHeaders"
      :items="shipAddresslList"
      :loading="shipAddressLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-5">
          <v-col
            cols="12"
            md="4"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              Ship Address
            </v-toolbar-title>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <span v-if="item.created_at">{{
          item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
    </v-data-table>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    shippmentDetailsHeaders: [
      {
        text: "Created At",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Invoice Number",
        value: "invoice_number",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Customer Order Number",
        value: "customer_order_number",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Customer Id",
        value: "customer_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Address Id",
        value: "address_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Tracking Id",
        value: "tracking_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Destination Country Code",
        value: "destination_country_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Asin",
        value: "asin",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Fnsku",
        value: "fnsku",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Title",
        value: "item_title",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Product Group",
        value: "product_group",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Hs Code",
        value: "hs_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Export Controller Number",
        value: "export_controller_number",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Coo",
        value: "coo",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Quantity Unit",
        value: "item_quantity_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Quantity Value",
        value: "item_quantity_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Net Weight Unit",
        value: "total_net_weight_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Net Weight Value",
        value: "total_net_weight_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Unit Price Unit",
        value: "item_unit_price_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Unit Price Type",
        value: "item_unit_price_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Unit Price Value",
        value: "item_unit_price_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Unit Price Unit",
        value: "total_unit_price_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Unit Price Type",
        value: "total_unit_price_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Unit Price Value",
        value: "total_unit_price_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller Name",
        value: "seller_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Merchant Id",
        value: "merchant_id",
        class: "body-1 font-weight-bold",
      },
    ],
    costInfoHeaders: [
      {
        text: "created_at",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Commercial Invoice Id",
        value: "commercial_invoice_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Shipment Details Id",
        value: "shipment_details_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Charge Unit",
        value: "charge_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Charge Type",
        value: "charge_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Charge Value",
        value: "charge_value",
        class: "body-1 font-weight-bold",
      },
    ],
    shipAddressHeaders: [
      {
        text: "Created At",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Commercial Invoice Id",
        value: "commercial_invoice_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Address Type",
        value: "address_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Name",
        value: "name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Address Line 1",
        value: "address_line_1",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Address Line 2",
        value: "address_line_2",
        class: "body-1 font-weight-bold",
      },
      {
        text: "City",
        value: "city",
        class: "body-1 font-weight-bold",
      },
      {
        text: "State",
        value: "state",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Zip",
        value: "zip",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Country Code",
        value: "country_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Country Name",
        value: "country_name",
        class: "body-1 font-weight-bold",
        align: "right",
      },
    ],
    shippmentDetailslList: [],
    costInfoList: [],
    shipAddresslList: [],
    shippmentDetailsLoader: false,
    costInfoLoader: false,
    shipAddressLoader: false,
  }),

  created() {
    this.fetchOutbouncAMZDataListing();
  },

  methods: {
    ...mapActions(["getOutboundAMZDataListing"]),
    fetchOutbouncAMZDataListing() {
      var code = this.$route.params;
      var payload = new FormData();
      payload.append("commercial_invoice_pk", code.id);
      this.getOutboundAMZDataListing(payload)
        .then((res) => {
          this.shippmentDetailslList = res[0].shipment_details;
          this.costInfoList = res[0].cost_info;
          this.shipAddresslList = res[0].ship_address;
        })
        .catch(() => {});
    },
  },
};
</script>
