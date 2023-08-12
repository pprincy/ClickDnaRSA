<!-- #78 -->
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
      :headers="packageInfoHeaders"
      :items="packageInfoList"
      :loading="packageInfoLoader"
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
              Package Info
            </v-toolbar-title>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <span v-if="item.created_at">{{
          item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.commercial_invoice_date`]="{ item }">
        <span v-if="item.commercial_invoice_date">{{
          item.commercial_invoice_date
            | localMoment
            | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.scheduled_delivery_date`]="{ item }">
        <span v-if="item.scheduled_delivery_date">{{
          item.scheduled_delivery_date
            | localMoment
            | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.expected_ship_date`]="{ item }">
        <span v-if="item.expected_ship_date">{{
          item.expected_ship_date | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.estimated_arrival_date`]="{ item }">
        <span v-if="item.estimated_arrival_date">{{
          item.estimated_arrival_date
            | localMoment
            | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
    </v-data-table>
    <v-data-table
      :headers="packageItemDetailsHeaders"
      :items="packageItemDetailsList"
      :loading="packageItemDetailsLoader"
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
              Package Item Details
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
      :headers="summaryHeaders"
      :items="summaryList"
      :loading="summaryLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-5">
          <v-col
            cols="12"
            md="4"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6"> Summary </v-toolbar-title>
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
        text: "Market Place Id",
        value: "market_place_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Customer Order Number",
        value: "customer_order_number",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Consignee Address",
        value: "consignee_address",
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
        text: "District",
        value: "district",
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
        text: "Country Code",
        value: "country_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Country Name",
        value: "country_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Contact Phone",
        value: "contact_phone",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Delivery To Customer Only",
        value: "delivery_to_customer_only",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Is Export Charge Prepaid",
        value: "is_export_charge_prepaid",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Address Id",
        value: "address_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Customer Id",
        value: "customer_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor Name",
        value: "eor_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor Address Line 1",
        value: "eor_address_line_1",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor Address Line 2",
        value: "eor_address_line_2",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor City",
        value: "eor_city",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor Country Code",
        value: "eor_country_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor Country Name",
        value: "eor_country_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Reason For Export",
        value: "reason_for_export",
        class: "body-1 font-weight-bold",
        align: "right",
      },
    ],
    shipAddressHeaders: [
      {
        text: "Created At",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Rsa Invoice",
        value: "rsa_invoice",
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
    costInfoHeaders: [
      {
        text: "Created At",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Rsa Invoice",
        value: "rsa_invoice",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Terms Of Sale",
        value: "terms_of_sale",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Amazon Freight Unit",
        value: "amazon_freight_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Amazon Freight Type",
        value: "amazon_freight_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Amazon Freight Value",
        value: "amazon_freight_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Goods Unit",
        value: "goods_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Goods Type",
        value: "goods_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Goods Value",
        value: "goods_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Cif Unit",
        value: "cif_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Cif Type",
        value: "cif_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Cif Value",
        value: "cif_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Consignee Freight Unit",
        value: "consignee_freight_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Consignee Freight Type",
        value: "consignee_freight_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Consignee Freight Value",
        value: "consignee_freight_value",
        class: "body-1 font-weight-bold",
        align: "right",
      },
    ],
    packageInfoHeaders: [
      {
        text: "Created At",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Amazon Bar Code",
        value: "amazon_bar_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Encrypted Shipment Id",
        value: "encrypted_shipment_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Id",
        value: "package_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Tracking Id",
        value: "tracking_id",
        class: "body-1 font-weight-bold",
      },

      {
        text: "Barcode Id",
        value: "barcode_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Cash On Delivery Type",
        value: "cash_on_delivery_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Cash On Delivery Unit",
        value: "cash_on_delivery_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Cash On Delivery Value",
        value: "cash_on_delivery_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Shipment Method",
        value: "package_shipment_method",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Method Of Payment",
        value: "method_of_payment",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ship Zone",
        value: "ship_zone",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ship Sort",
        value: "ship_sort",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ship Option",
        value: "ship_option",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Commercial Invoice Date",
        value: "commercial_invoice_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Consumption Type",
        value: "consumption_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Consumption Unit",
        value: "consumption_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Consumption Value",
        value: "consumption_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Scheduled Delivery Date",
        value: "scheduled_delivery_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Expected Ship Date",
        value: "expected_ship_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Estimated Arrival Date",
        value: "estimated_arrival_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Scheduled Pickup Date",
        value: "scheduled_pickup_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller Of Record",
        value: "seller_of_record",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Value Of Goods Type",
        value: "value_of_goods_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Value Of Goods Unit",
        value: "value_of_goods_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Value Of Goods Value",
        value: "value_of_goods_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Declared Package Unit",
        value: "declared_package_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Declared Package Type",
        value: "declared_package_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Declared Package Value",
        value: "declared_package_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Calc Method",
        value: "package_calc_method",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Cost Type",
        value: "package_cost_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Calc Unit",
        value: "package_cost_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Calc Value",
        value: "package_cost_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Declared Gross Weight Unit",
        value: "declared_gross_weight_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Declared Gross Weight Value",
        value: "declared_gross_weight_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Actual Gross Weight Unit",
        value: "actual_gross_weight_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Actual Gross Weight Value",
        value: "actual_gross_weight_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Length Unit",
        value: "package_length_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Lenght Value",
        value: "package_lenght_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Height Unit",
        value: "package_height_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Height Value",
        value: "package_height_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Width Unit",
        value: "package_width_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Width Value",
        value: "package_width_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Declared Value",
        value: "total_declared_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Declared Value Iso Code",
        value: "total_declared_value_iso_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Export Charge Value",
        value: "total_export_charge_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Export Charge Value Iso Code",
        value: "total_export_charge_value_iso_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Package Harmonized Tariff Number Description",
        value: "package_harmonized_tariff_number_description",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Shipment Package Item Quantity Unit",
        value: "shipment_package_item_quantity_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Shipment Package Item Quantity Value",
        value: "shipment_package_item_quantity_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Is Over Size",
        value: "is_over_size",
        class: "body-1 font-weight-bold",
        align: "right",
      },
    ],
    packageItemDetailsHeaders: [
      {
        text: "Created At",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Rsa Invoice",
        value: "rsa_invoice",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Rsa Package Info",
        value: "rsa_package_info",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Id Type",
        value: "item_id_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Id Is Free Rep",
        value: "item_id_is_free_rep",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Id Value",
        value: "item_id_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Title",
        value: "item_title",
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
        text: "Item Extended Price Unit",
        value: "item_extended_price_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: " Item Extended Price Type",
        value: "item_extended_price_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: " Item Extended Price Value",
        value: "item_extended_price_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Weight Unit",
        value: "item_weight_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Item Weight Value",
        value: "item_weight_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor Name",
        value: "eor_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor Country Code",
        value: "eor_country_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor Country Name",
        value: "eor_country_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor Address Line 1",
        value: "eor_address_line_1",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor City",
        value: "eor_city",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Eor Country",
        value: "eor_country",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller Name",
        value: "seller_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller Legal Name",
        value: "seller_legal_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller Address Line 1",
        value: "seller_address_line_1",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller Address Line 2",
        value: "seller_address_line_2",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller City",
        value: "seller_city",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller State",
        value: "seller_state",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller Tax ID",
        value: "seller_tax_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller Zip",
        value: "seller_zip",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Tax Rate",
        value: "tax_rate",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Tax Value",
        value: "tax_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller Country Code",
        value: "seller_country_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Seller Country Name",
        value: "seller_country_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Harmonized Tariff Number",
        value: "harmonized_tariff_number",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Hazmat Exception",
        value: "hazmat_exception",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ior Address Line 1",
        value: "ior_address_line_1",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ior Address Line 2",
        value: "ior_address_line_2",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ior City",
        value: "ior_city",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ior Country Code",
        value: "ior_country_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ior Country Code",
        value: "ior_country_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ior Name",
        value: "ior_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ior State",
        value: "ior_state",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Ior Zip",
        value: "ior_zip",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Is Hazmat",
        value: "is_hazmat",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Destination Country Hs Code",
        value: "destination_country_hs_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Origin Country Hs Code",
        value: "origin_country_hs_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Harmonized Tariff Number Description",
        value: "harmonized_tariff_number_description",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Coo",
        value: "coo",
        class: "body-1 font-weight-bold",
        align: "right",
      },
    ],
    summaryHeaders: [
      {
        text: "Created At",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Shipment Quantity Unit",
        value: "total_shipment_quantity_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Shipment Quantity Value",
        value: "total_shipment_quantity_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Shipment Value Unit",
        value: "total_shipment_value_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Shipment Value Type",
        value: "total_shipment_value_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Shipment Value Value",
        value: "total_shipment_value_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Declared Gross Weight Unit",
        value: "total_declared_gross_weight_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Declared Gross Weight Value",
        value: "total_declared_gross_weight_value",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Actual Gross Weight Unit",
        value: "total_actual_gross_weight_unit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Total Actual Gross Weight Value",
        value: "total_actual_gross_weight_value",
        class: "body-1 font-weight-bold",
        align: "right",
      },
    ],
    shippmentDetailslList: [],
    shipAddresslList: [],
    costInfoList: [],
    packageInfoList: [],
    packageItemDetailsList: [],
    summaryList: [],
    shippmentDetailsLoader: false,
    shipAddressLoader: false,
    costInfoLoader: false,
    packageInfoLoader: false,
    packageItemDetailsLoader: false,
    summaryLoader: false,
  }),

  created() {
    this.fetchRsaXmlDataListing();
  },

  methods: {
    ...mapActions(["getRsaXmlDataListing"]),
    fetchRsaXmlDataListing() {
      var code = this.$route.params;
      var payload = new FormData();
      payload.append("invoice_pk", code.id);
      this.getRsaXmlDataListing(payload)
        .then((res) => {
          this.shippmentDetailslList = res[0].shipment_details;
          this.shipAddresslList = res[0].ship_address;
          this.costInfoList = res[0].cost_info;
          this.packageInfoList = res[0].package_info;
          this.packageItemDetailsList = res[0].package_item_details;
          this.summaryList = res[0].summary;
        })
        .catch(() => {});
    },
  },
};
</script>
