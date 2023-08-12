<!-- #10 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="_headers"
      :items="ranges"
      :options.sync="options"
      :server-items-length="total"
      :loading="rangesLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="8"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              Tracking Range for Bag or Package
            </v-toolbar-title>
          </v-col>
          <Details
            :add-item="editedItem"
            :edited-index="editedIndex"
            :default-item="defaultItem"
            :form-title="formTitle"
            @refreshData="fetchTrackingRanges()"
          />
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-icon color="success" v-if="item.status === 'active'">
          mdi-check
        </v-icon>
        <v-icon color="error" v-else> mdi-close </v-icon>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="download(item)"
            >
              mdi-download
            </v-icon>
          </template>
          <span>Download Range</span>
        </v-tooltip>
        <v-tooltip v-if="userRole.code === 'AD'" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="openEmail(item)"
            >
              mdi-email
            </v-icon>
          </template>
          <span>Send Email</span>
        </v-tooltip>
        <v-tooltip v-if="userRole.code === 'AD'" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="stopTransactions(item)"
            >
              mdi-stop
            </v-icon>
          </template>
          <span>Stop Transactions</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              v-bind="attrs"
              v-on="on"
              @click="downloadActive(item)"
            >
              mdi-clock
            </v-icon>
          </template>
          <span>Download Active Range</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <ConfirmDialog
      :dialog="dialogConfirm"
      text="Are you sure want to stop transactions for this tracking range?"
      :loader="statusLoader"
      @confirm="confirmStopTransactions"
      @close="closeConfirm"
    />
    <ConfirmDialog
      v-if="userRole.code === 'AD'"
      :dialog="dialogEmail"
      text="Are you sure want to send email?"
      :loader="statusLoader"
      @confirm="sendEmail"
      @close="dialogEmail = false"
    />
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Details from "./Details";
import Search from "@/components/front/common/Search";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";

export default {
  components: {
    Details,
    Search,
    ConfirmDialog,
  },
  data: () => ({
    dialogConfirm: false,
    search: "",
    searchType: "name",
    searchOptions: [
      {
        text: "Range Name",
        value: "name",
      },
      {
        text: "Country",
        value: "destination_country_id",
      },
      {
        text: "Type",
        value: "package_type",
      },
    ],
    headers: [
      {
        text: "Range Name",
        value: "name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Client",
        value: "client_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Country",
        value: "destination_country_id",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Service Code",
        value: "service_code",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Type",
        value: "package_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Qty",
        value: "quantity",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Valid",
        value: "status",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
        width: "120px",
      },
    ],
    ranges: [],
    options: {},
    total: 0,
    rangesLoader: false,
    statusLoader: false,
    editedIndex: -1,
    editedItem: {
      package_type: "parcel",
      name: null,
      destination_country_id: null,
      quantity: null,
      valid: null,
      status: "active",
    },
    defaultItem: null,
    dialogEmail: false,
    emailLoader: false,
  }),

  computed: {
    ...mapGetters(["userRole"]),
    formTitle() {
      return this.editedIndex === -1 ? "Add Range" : "Edit Range";
    },
    _headers() {
      return this.headers.filter((i) =>
        this.userRole.code !== "AD" ? i.value !== "client_name" : true
      );
    },
  },

  watch: {
    options: {
      handler() {
        this.fetchTrackingRanges();
      },
      deep: true,
    },
    search() {
      this.fetchTrackingRanges();
    },
    searchType() {
      if (this.search) this.fetchTrackingRanges();
    },
  },

  created() {
    this.defaultItem = Object.assign({}, this.editedItem);
  },

  methods: {
    ...mapActions([
      "getTrackingRanges",
      "stopTransactionsTrackingRange",
      "downloadActiveRange",
      "downloadRange",
      "sendTrackingRangesToClient",
      "snackBar",
    ]),
    fetchTrackingRanges() {
      this.ranges = [];
      this.rangesLoader = true;
      this.getTrackingRanges({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.rangesLoader = false;
          this.ranges = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.rangesLoader = false;
        });
    },
    openEmail(item) {
      this.editedIndex = this.ranges.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEmail = true;
    },
    reset() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeConfirm() {
      this.dialogConfirm = false;
      this.ranges[this.editedIndex].status = this.ranges[this.editedIndex]
        .status
        ? 0
        : 1;
      this.reset();
    },
    confirmStopTransactions() {
      this.statusLoader = true;
      this.editedItem.status = 0;
      this.stopTransactionsTrackingRange(this.editedItem.id)
        .then((res) => {
          this.statusLoader = false;
          Object.assign(this.ranges[this.editedIndex], this.editedItem);
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.dialogConfirm = false;
          this.reset();
        })
        .catch(() => {
          this.statusLoader = false;
          this.closeConfirm();
        });
    },
    stopTransactions(item) {
      this.editedIndex = this.ranges.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogConfirm = true;
    },
    download(item) {
      this.rangesLoader = true;
      this.downloadRange(item.id)
        .then((res) => {
          this.fileDownload(res);
          this.rangesLoader = false;
        })
        .catch(() => {
          this.rangesLoader = false;
        });
    },
    downloadActive(item) {
      this.rangesLoader = true;
      this.downloadActiveRange(item.id)
        .then((res) => {
          this.fileDownload(res);
          this.rangesLoader = false;
        })
        .catch(() => {
          this.rangesLoader = false;
        });
    },
    sendEmail() {
      this.emailLoader = true;
      this.sendTrackingRangesToClient(this.editedItem.id)
        .then((res) => {
          this.emailLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.dialogEmail = false;
        })
        .catch(() => {
          this.emailLoader = false;
        });
    },
  },
};
</script>
