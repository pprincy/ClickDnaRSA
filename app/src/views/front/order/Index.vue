<!-- #72 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="pgList"
      :options.sync="options"
      :server-items-length="total"
      :loading="pgListLoader"
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
              Fulfillment Order List
            </v-toolbar-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              :items="statusDocItems"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
        </v-row>
      </template>
      <template
        v-slot:[`item.click_dna_shipment_tracking_status_date`]="{ item }"
      >
        <span v-if="item.click_dna_shipment_tracking_status_date">{{
          item.click_dna_shipment_tracking_status_date
            | localMoment
            | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.display_order_date_time`]="{ item }">
        <span v-if="item.display_order_date_time">{{
          item.display_order_date_time
            | localMoment
            | moment("DD MMM, YYYY hh:mm A")
        }}</span>
        <br />
        <label><strong>OMS: </strong></label>
        <span v-if="item.oms_order_date_time">{{
          item.oms_order_date_time
            | localMoment
            | moment("DD MMM, YYYY hh:mm A")
        }}</span>
        <br />
        <label><strong>Click: </strong></label>
        <span v-if="item.created_at">{{
          item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.fulfillment_tat`]="{ item }">
        <span v-if="item.fulfillment_tat">{{
          item.fulfillment_tat | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <strong>Created At:</strong>
        <span v-if="item.created_at">{{
          item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span
        ><br />
        <strong>Modified At:</strong>
        <span v-if="item.modified_at">{{
          item.modified_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.sale_order_code`]="{ item }">
        <v-tooltip bottom>
          <template
            v-slot:activator="{ on, attrs }"
            v-if="
              item.shipping_package_status == 'DISPATCHED' ||
              item.shipping_package_status == 'SHIPPED' ||
              item.shipping_package_status == 'DELIVERED' ||
              item.shipping_package_status == 'MANIFESTED' ||
              item.shipping_package_status == 'READY_TO_SHIP'
            "
          >
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-icon @click="downloadEcom(item.id)" color="success">
                mdi-download-circle
              </v-icon>
            </v-btn>
          </template>
          <span>Download Commercial Invoice</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template
            v-slot:activator="{ on, attrs }"
            v-if="
              item.shipping_package_status == 'DISPATCHED' ||
              item.shipping_package_status == 'SHIPPED' ||
              item.shipping_package_status == 'DELIVERED' ||
              item.shipping_package_status == 'MANIFESTED' ||
              item.shipping_package_status == 'READY_TO_SHIP'
            "
          >
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-icon @click="downloadDa(item.id)" color="info">
                mdi-download-circle
              </v-icon>
            </v-btn>
          </template>
          <span>Download DA</span>
        </v-tooltip>
        <v-tooltip bottom v-if="item.boe_item_count == '0'">
          <template
            v-slot:activator="{ on, attrs }"
            v-if="
              item.shipping_package_status == 'DISPATCHED' ||
              item.shipping_package_status == 'SHIPPED' ||
              item.shipping_package_status == 'DELIVERED' ||
              item.shipping_package_status == 'MANIFESTED' ||
              item.shipping_package_status == 'READY_TO_SHIP'
            "
          >
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-icon @click="downloadCustomerInvoice(item.id)" color="primary">
                mdi-download-circle
              </v-icon>
            </v-btn>
          </template>
          <span>Download Customer Invoice</span>
        </v-tooltip>
        <v-tooltip v-else-if="item.boe_item_count > '0'">
          <template
            v-slot:activator="{ on, attrs }"
            v-if="
              item.shipping_package_status == 'DISPATCHED' ||
              item.shipping_package_status == 'SHIPPED' ||
              item.shipping_package_status == 'DELIVERED' ||
              item.shipping_package_status == 'MANIFESTED' ||
              item.shipping_package_status == 'READY_TO_SHIP'
            "
          >
            <v-btn v-bind="attrs" v-on="on" icon class="boe_exit">
              <v-icon> mdi-download-circle </v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <label>
          {{ item.sale_order_code }} <br />
          ({{ item.shipping_package_code }})
        </label>
      </template>
      <template v-slot:[`item.shipping_address_country`]="{ item }">
        <label>
          {{ item.shipping_address_country }}
          <br />
          (From:{{ item.billing_address_country }})
        </label>
      </template>
      <template v-slot:[`item.click_dna_client_id`]="{ item }">
        <label>
          {{ item.click_dna_client_id }}
          <br />
          ({{ item.oms_client_id }})
        </label>
      </template>
      <template v-slot:[`item.actual_weight`]="{ item }">
        <label>
          {{ item.actual_weight }} kg | <strong>W:</strong>
          {{ item.box_width }} | <strong>H:</strong> {{ item.box_height }} |
          <strong>L:</strong> {{ item.box_length }}
        </label>
      </template>
      <template v-slot:[`item.shipping_provider_tracking_no`]="{ item }">
        <v-icon
          @click="download(item.click_dna_tracking_number)"
          color="primary"
          v-if="item.shipping_provider_tracking_no"
        >
          mdi-download-circle
        </v-icon>
        <label @click="fetchTrackingDetails(item)">
          <strong>Click Dna:</strong>
          <a>{{ item.click_dna_tracking_number }}</a> </label
        ><br />
        (<label>
          <strong>Carrier:</strong>
          {{ item.shipping_provider_tracking_no }} </label
        >)
      </template>
      <template v-slot:[`item.is_cash_on_delivery`]="{ item }">
        <label v-if="item.is_cash_on_delivery == true">
          Cash: {{ item.sale_order_collectable_amount }}
        </label>
        {{ item.sale_order_currency_code }}
      </template>
      <template v-slot:[`item.click_dna_tracking_status`]="{ item }">
        {{ item.click_dna_tracking_status }}
        <br />
        ({{ item.click_dna_shipment_tracking_status_date }})
      </template>
      <v-select
        v-model="boe_item_count"
        label="Outbound BOE available"
        :items="boeUploadedInvoiceList"
        class="required"
        :rules="[(v) => v >= 0 || 'Please select an option']"
      ></v-select>
    </v-data-table>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import Search from "@/components/front/common/Search";
import { boeUploadedInvoice } from "@/config/data";

export default {
  components: {
    Search,
  },

  computed: {
    boeUploadedInvoiceList() {
      return Object.keys(boeUploadedInvoice).map((i) => {
        return {
          text: boeUploadedInvoice[i],
          value: i,
        };
      });
    },
    statusDocItems() {
      return Object.keys(boeUploadedInvoice).map((i) => {
        return {
          text: boeUploadedInvoice[i],
          value: i,
        };
      });
    },
  },
  data: () => ({
    search: "",
    searchOptions: [
      {
        text: "Order Code",
        value: "shipping_package_code",
      },
      {
        text: "Client",
        value: "click_dna_client_id",
      },
      {
        text: "Package Status",
        value: "shipping_package_status",
      },
      {
        text: "Payment Mode",
        value: "is_cash_on_delivery",
      },
      {
        text: "Tracking ID",
        value: "shipping_provider_tracking_no",
      },
      {
        text: "Carrier Status",
        value: "click_dna_tracking_status",
      },
      {
        text: "Outbound BOE available",
        value: "boe_item_count",
      },
    ],
    headers: [
      {
        text: "Order Code",
        value: "sale_order_code",
        class: "body-1 font-weight-bold",
        align: "left",
        width: "150px",
      },
      {
        text: "Order Status",
        value: "order_status",
        class: "body-1 font-weight-bold",
        align: "left",
        width: "150px",
      },
      {
        text: "Client",
        value: "click_dna_client_id",
        class: "body-1 font-weight-bold",
        align: "left",
        width: "150px",
      },
      {
        text: "Order Date",
        value: "display_order_date_time",
        class: "body-1 font-weight-bold",
        align: "left",
        width: "200px",
      },
      {
        text: "Package Info",
        value: "actual_weight",
        class: "body-1 font-weight-bold",
        align: "left",
        width: "200px",
      },
      {
        text: "Payment Mode",
        value: "is_cash_on_delivery",
        class: "body-1 font-weight-bold",
        align: "left",
      },
      {
        text: "Shipping Country",
        value: "shipping_address_country",
        class: "body-1 font-weight-bold",
        align: "left",
        width: "150px",
      },
      {
        text: "Package Status",
        value: "shipping_package_status",
        class: "body-1 font-weight-bold",
        align: "left",
      },
      {
        text: "Carrier",
        value: "carrier_id",
        class: "body-1 font-weight-bold",
        align: "left",
      },
      {
        text: "Tracking ID",
        value: "shipping_provider_tracking_no",
        class: "body-1 font-weight-bold",
        align: "left",
      },
      {
        text: "Carrier Status",
        value: "click_dna_tracking_status",
        class: "body-1 font-weight-bold",
      },
    ],
    pgList: [],
    options: {},
    total: 0,
    pgListLoader: false,
  }),

  watch: {
    options: {
      handler() {
        this.fetchFulfillmentOrderList();
      },
      deep: true,
    },
    search() {
      this.fetchFulfillmentOrderList();
    },
    searchType() {
      if (this.search) this.fetchFulfillmentOrderList();
    },
  },

  methods: {
    ...mapActions([
      "getFulfillmentOrderList",
      "downloadAWBDetails",
      "downloadEcomDetails",
      "downloadDaDetails",
      "downloadCustomerInvoiceDetails",
    ]),
    fetchFulfillmentOrderList() {
      this.pgList = [];
      this.pgListLoader = true;
      this.getFulfillmentOrderList({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.pgListLoader = false;
          this.pgList = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.pgListLoader = false;
        });
    },
    download(click_dna_tracking_number) {
      this.pgListLoader = true;
      this.downloadAWBDetails(click_dna_tracking_number)
        .then((res) => {
          this.fileDownload(res);
          this.pgListLoader = false;
        })
        .catch(() => {
          this.pgListLoader = false;
        });
    },
    fetchTrackingDetails(item) {
      this.$router.push({
        name: "ClientTrackingDetails",
        params: {
          id: item.click_dna_barcode,
          viewName: "orderList",
        },
      });
    },
    downloadEcom(id) {
      this.pgListLoader = true;
      this.downloadEcomDetails(id)
        .then((res) => {
          this.fileDownload(res);
          this.pgListLoader = false;
        })
        .catch(() => {
          this.pgListLoader = false;
        });
    },
    downloadDa(id) {
      this.pgListLoader = true;
      this.downloadDaDetails(id)
        .then((res) => {
          this.fileDownload(res);
          this.pgListLoader = false;
        })
        .catch(() => {
          this.pgListLoader = false;
        });
    },
    downloadCustomerInvoice(id) {
      this.pgListLoader = true;
      this.downloadCustomerInvoiceDetails(id)
        .then((res) => {
          this.fileDownload(res);
          this.pgListLoader = false;
        })
        .catch(() => {
          this.pgListLoader = false;
        });
    },
  },
};
</script>

<style lang="scss">
.v-btn--icon.v-size--default {
  height: 25px;
  width: 25px;
}
.boe_exit {
  position: relative;
  box-sizing: border-box;
}
.boe_exit:hover:after {
  position: absolute;
  top: 136%;
  left: 12%;
  content: "Outbound BOE details not updated";
  background-color: gray;
  color: white;
  border-radius: 4px;
  padding: 5px;
  text-transform: capitalize;
  white-space: nowrap;
  font-size: 12px;
}
</style>
