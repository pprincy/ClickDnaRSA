<!-- #52 -->
<template>
  <v-row>
    <v-col :md="displayLegend ? 9 : 12" :sm="displayLegend ? 9 : 12" xs="12">
      <!-- <v-data-table
        :headers="headers"
        :items="pSellers"
        :options.sync="pOptions"
        :server-items-length="pTotal"
        :loading="pSellersLoader"
        style="min-height: 600px"
      >
        <template v-slot:top>
          <v-row class="pb-6" justify="space-around">
            <v-col cols="12" class="py-0">
              <v-divider class="my-2"></v-divider>
              <p class="text-h6 ml-2 d-inline-block">
                Action Pending on Seller Onboarding
              </p>
              <Search
                :search-options="_pSearchOptions"
                :val="pSearchType"
                :items="statusItems"
                @changeText="(res) => (pSearch = res)"
                @changeType="(res) => (pSearchType = res)"
              />
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          {{ item.name }}<br />(L-{{ item.legal_name }})
        </template>
        <template v-slot:[`item.signatory_name`]="{ item }">
          {{ item.signatory_name }}<br />({{ item.job_title }})
        </template>
        <template v-slot:[`item.rsa_status`]="{ item }">
          <v-chip text-color="white" :color="getColor(item.rsa_status)">
            <strong> {{ item.rsa_status | statusStr(sellerStatuses) }} </strong>
          </v-chip>
        </template>
        <template v-slot:[`item.client_status`]="{ item }">
          <v-chip text-color="white" :color="getColor(item.client_status)">
            <strong>
              {{ item.client_status | statusStr(sellerStatuses) }}
            </strong>
          </v-chip>
        </template>
        <template v-slot:[`item.seller_status`]="{ item }">
          <v-chip>
            <strong>
              {{ item.seller_status | sellerStatusStr(item.seller_status) }}
            </strong>
          </v-chip>
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          {{ item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A") }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" small @click="editItem(item)">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table> -->
      <v-data-table
        :headers="headers"
        :items="sellers"
        :options.sync="options"
        :server-items-length="total"
        :loading="sellersLoader"
        class="mt-4"
        style="min-height: 600px"
      >
        <template v-slot:top>
          <v-row class="pb-6" justify="space-around">
            <v-col
              cols="12"
              md="6"
              sm="12"
              xs="12"
              class="d-flex flex-column align-center justify-center"
            >
              <p class="border-bottom px-4 mb-4 w-90 text-center">
                Upload Sellers Data
              </p>
              <div class="d-flex">
                <v-btn
                  color="primary"
                  class="mr-2"
                  small
                  :loading="downloader"
                  @click="downloadTemplate()"
                  >Download template</v-btn
                >
                <v-dialog
                  v-model="dialog"
                  max-width="550px"
                  @keydown.esc="dialog = false"
                  persistent
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      :loading="fileLoader"
                      small
                      v-bind="attrs"
                      v-on="on"
                      >Upload sellers data</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline"
                        >Upload sellers data
                        <i class="caption red--text ml-4">
                          * required field</i
                        ></span
                      >
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="form" lazy-validation>
                        <v-row v-if="userRole.code === 'AD'">
                          <v-col>
                            <v-autocomplete
                              v-model="clientId"
                              :items="clients"
                              :loading="clientLoader"
                              hide-no-data
                              item-text="name"
                              item-value="id"
                              label="Select client"
                              placeholder="Start typing to Search"
                              prepend-icon="mdi-database-search"
                              :rules="[(v) => !!v || 'Please select a client.']"
                              class="required"
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-file-input
                              v-model="file"
                              counter
                              show-size
                              accept=".xlsx"
                              label="Select your sellers excel file"
                              :rules="[
                                (v) => !!v || 'Sellers excel is required.',
                                (v) =>
                                  !v ||
                                  v.size < 2097152 ||
                                  `File size should be less than 2 MB!`,
                                (v) =>
                                  !v ||
                                  [
                                    'application/vnd.ms-excel',
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                  ].includes(v.type) ||
                                  `Excel file is required`,
                              ]"
                              class="required"
                            >
                            </v-file-input>
                            <v-btn
                              color="primary"
                              dark
                              class="mt-3"
                              :loading="fileLoader"
                              @click="upload"
                            >
                              Upload
                            </v-btn>
                            <v-btn
                              color="info"
                              class="mt-3 ml-3"
                              :loading="downloader"
                              @click="downloadTemplate()"
                              >Download template</v-btn
                            >
                            <v-btn
                              color="info"
                              class="mt-3 ml-3"
                              :to="{
                                name: 'SellersTemplate',
                              }"
                              ><v-icon>mdi-information</v-icon></v-btn
                            >
                            <v-btn class="mt-3 ml-3" @click="dialog = false">
                              Cancel
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="12"
              xs="12"
              class="d-flex align-center justify-end"
            >
              <v-btn
                color="primary"
                :loading="sellersLoader"
                @click="downloadAll()"
                >Download Sellers</v-btn
              >
              <v-btn
                class="ml-2 mr-6"
                color="info"
                @click="displayLegend = !displayLegend"
              >
                Status Legend
              </v-btn>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-divider class="my-2"></v-divider>
              <p class="text-h6 ml-2 d-inline-block">All Sellers</p>
              <Search
                :search-options="_searchOptions"
                :val="searchType"
                :items="statusItems"
                @changeText="(res) => (search = res)"
                @changeType="(res) => (searchType = res)"
              />
            </v-col>
          </v-row>
          <Details
            :default-item="editedItem"
            :dialog="editDialog"
            @close="editDialog = false"
            @refreshData="fetchSeller()"
          />
        </template>
        <template v-slot:[`item.name`]="{ item }">
          {{ item.name }}<br />(L-{{ item.legal_name }})
        </template>
        <template v-slot:[`item.signatory_name`]="{ item }">
          {{ item.signatory_name }}<br />({{ item.job_title }})
        </template>
        <template v-slot:[`item.rsa_status`]="{ item }">
          <v-chip text-color="white" :color="getColor(item.rsa_status)">
            <strong> {{ item.rsa_status | statusStr(sellerStatuses) }} </strong>
          </v-chip>
        </template>
        <template v-slot:[`item.client_status`]="{ item }">
          <v-chip text-color="white" :color="getColor(item.client_status)">
            <strong>
              {{ item.client_status | statusStr(sellerStatuses) }}
            </strong>
          </v-chip>
        </template>
        <template v-slot:[`item.seller_status`]="{ item }">
          <v-chip class="mt-2">
            <strong>
              {{ item.seller_status | sellerStatusStr(item.seller_status) }}
            </strong> </v-chip
          ><br />
          <div v-if="item.rsa_status != 1 && item.seller_status < 2">
            <p
              v-if="
                item.expiry_date != '' &&
                new Date(item.expiry_date) < new Date()
              "
              class="mt-2 red--text"
            >
              {{
                item.expiry_date | localMoment | moment("DD MMM, YYYY hh:mm A")
              }}
            </p>
            <p
              v-else-if="
                item.expiry_date != '' &&
                new Date(item.expiry_date) > new Date()
              "
              class="mt-2 green--text"
            >
              {{
                item.expiry_date | localMoment | moment("DD MMM, YYYY hh:mm A")
              }}
            </p>
          </div>
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          {{ item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A") }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small @click="editItem(item)"> mdi-pencil </v-icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                :href="item.e_sign_link"
                target="_blank"
                icon
              >
                <v-icon
                  small
                  v-if="item.rsa_status != 1 && item.seller_status < 2"
                >
                  mdi-icon-park mdi-book-account-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Link of Agreement</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon
                  small
                  v-bind:id="'expiryDateIcon' + item.id"
                  @click="expiryDate(item)"
                  v-if="
                    item.rsa_status != 1 &&
                    item.seller_status < 2 &&
                    new Date(item.expiry_date) < new Date()
                  "
                >
                  mdi-clipboard-text-clock-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Extend validity of Agreement Link</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>
    <v-col md="3" sm="3" xs="12" v-if="displayLegend">
      <v-card>
        <v-toolbar color="primary" dense dark flat>
          <v-toolbar-title>Status Legend</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <Legends legend-type="sellers" :status-list="sellerStatuses" />
        </v-card-text>
      </v-card>
    </v-col>
    <BulkErrors
      :dialog="uploadResDialog"
      :data="uploadRes"
      @close="uploadResDialog = false"
    />
  </v-row>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Search from "@/components/front/common/Search";
import Legends from "@/components/front/common/Legends";
import BulkErrors from "@/components/front/common/BulkErrors";
import Details from "./Details";
import { sellerProgress } from "@/config/data";

export default {
  components: {
    Search,
    Legends,
    BulkErrors,
    Details,
  },
  computed: {
    ...mapGetters(["userRole", "sellerStatuses"]),
    _searchOptions() {
      return this.searchOptions.filter((i) =>
        this.userRole.code === "AD" ? true : i.value !== "client_name"
      );
    },
    _pSearchOptions() {
      return this.pSearchOptions.filter((i) =>
        this.userRole.code === "AD" ? true : i.value !== "client_name"
      );
    },
    statusItems() {
      if (
        this.searchType === "seller_status" ||
        this.pSearchType === "seller_status"
      ) {
        return Object.keys(sellerProgress).map((i) => {
          return {
            text: sellerProgress[i],
            value: i,
          };
        });
      } else if (
        this.sellerStatuses &&
        (["rsa_status", "client_status"].includes(this.searchType) ||
          ["rsa_status", "client_status"].includes(this.pSearchType))
      ) {
        return this.sellerStatuses.map((i) => {
          return {
            text: i.value,
            value: i.key,
          };
        });
      } else {
        return [];
      }
    },
  },
  filters: {
    statusStr(key, sellerStatuses) {
      if (!sellerStatuses) return "";
      return sellerStatuses.find((item) => item.key === key)?.value;
    },
    sellerStatusStr(key, status) {
      return sellerProgress[status];
    },
  },
  data() {
    return {
      sellers: [],
      pSellers: [],
      headers: [
        {
          text: "Actions",
          value: "actions",
          class: "body-1 font-weight-bold",
          width: "100px",
          sortable: false,
        },
        {
          text: "Client Name",
          value: "client_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Seller Name",
          value: "name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Country",
          value: "country_name",
          class: "body-1 font-weight-bold",
          width: "150px",
        },
        {
          text: "Email",
          value: "email",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Signatory Name",
          value: "signatory_name",
          class: "body-1 font-weight-bold",
          sortable: false,
        },
        {
          text: "Client Status",
          value: "client_status",
          class: "body-1 font-weight-bold",
        },
        {
          text: "RSA Status",
          value: "rsa_status",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Seller Status",
          value: "seller_status",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Created At",
          value: "created_at",
          class: "body-1 font-weight-bold",
          width: "150px",
        },
      ],
      searchOptions: [
        {
          text: "Client Name",
          value: "client_name",
        },
        {
          text: "Merchant Id",
          value: "client_merchant_id",
        },
        {
          text: "RSA Status",
          value: "rsa_status",
        },
        {
          text: "Client Status",
          value: "client_status",
        },
        {
          text: "Seller Status",
          value: "seller_status",
        },
        {
          text: "Country",
          value: "country_name",
        },
        {
          text: "Seller Name",
          value: "name",
        },
        {
          text: "Email",
          value: "email",
        },
      ],
      pSearchOptions: [
        {
          text: "Client Name",
          value: "client_name",
        },
        {
          text: "Merchant Id",
          value: "client_merchant_id",
        },
        {
          text: "RSA Status",
          value: "rsa_status",
        },
        {
          text: "Client Status",
          value: "client_status",
        },
        {
          text: "Seller Status",
          value: "seller_status",
        },
        {
          text: "Country",
          value: "country_name",
        },
        {
          text: "Seller Name",
          value: "name",
        },
        {
          text: "Email",
          value: "email",
        },
      ],
      total: 0,
      pTotal: 0,
      sellersLoader: false,
      pSellersLoader: false,
      search: null,
      pSearch: null,
      options: {},
      pOptions: {},
      searchType: "client_name",
      pSearchType: "client_name",
      file: null,
      fileLoader: false,
      dialog: false,
      downloader: false,
      uploadRes: {},
      uploadResDialog: false,
      clientLoader: false,
      clients: [],
      clientId: null,
      editedItem: {},
      editDialog: false,
      displayLegend: false,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
      if (val && this.clients.length === 0 && this.userRole.code === "AD") {
        this.fetchClientList();
      }
    },
    options: {
      handler() {
        this.fetchSeller();
      },
      deep: true,
    },
    pOptions: {
      handler() {
        this.fetchPSeller();
      },
      deep: true,
    },
    search() {
      this.fetchSeller();
    },
    searchType() {
      if (this.search) this.fetchSeller();
    },
    pSearch() {
      this.fetchPSeller();
    },
    pSearchType() {
      if (this.pSearch) this.fetchPSeller();
    },
  },

  created() {
    this.getSellerStatuses();
    if (+this.$route.query.id) {
      this.clientLoader = true;
      this.getUploadedSeller(this.$route.query.id).then((res) => {
        this.editItem(res.data);
      });
    }
  },

  methods: {
    ...mapActions([
      "getSellersUploadList",
      "downloadSellerDataTemplate",
      "uploadSellerExcel",
      "getClients",
      "getSellerStatuses",
      "downloadSellerList",
      "snackBar",
      "getUploadedSeller",
      "extendAgreementExpiry",
    ]),

    getColor(status) {
      return status === 0
        ? "red"
        : status === 1
        ? "green"
        : status === 3
        ? "yellow"
        : "orange";
    },

    fetchSeller() {
      this.sellers = [];
      this.sellersLoader = true;
      this.getSellersUploadList({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.sellersLoader = false;
          this.sellers = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.sellersLoader = false;
        });
    },

    fetchPSeller() {
      this.pSellers = [];
      this.pSellersLoader = true;
      this.getSellersUploadList({
        ...this.options,
        search: this.pSearch,
        type: this.pSearchType,
      })
        .then((res) => {
          this.pSellersLoader = false;
          this.pSellers = res.data.records;
          this.pTotal = res.data.total;
        })
        .catch(() => {
          this.pSellersLoader = false;
        });
    },

    editItem(item) {
      this.editedItem = item;
      this.editDialog = true;
    },

    close() {
      this.dialog = false;
    },

    downloadTemplate() {
      this.downloader = true;
      this.downloadSellerDataTemplate()
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },

    upload() {
      if (!this.$refs.form.validate()) return;
      this.fileLoader = true;
      const payload = new FormData();
      payload.append("data_file", this.file, this.file.name);
      if (this.clientId) payload.append("client_id", this.clientId);
      this.uploadSellerExcel(payload)
        .then((res) => {
          this.fileLoader = false;
          this.dialog = false;
          this.uploadRes = res.data;
          this.uploadResDialog = true;
          this.fetchSeller();
        })
        .catch(() => {
          this.fileLoader = false;
        });
    },

    fetchClientList() {
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

    downloadAll() {
      this.sellersLoader = true;
      this.downloadSellerList({
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.fileDownload(res);
          this.sellersLoader = false;
        })
        .catch(() => {
          this.sellersLoader = false;
        });
    },
    expiryDate(item) {
      document.getElementById("expiryDateIcon" + item.id).disabled = true;
      const payload = new FormData();
      payload.append("seller_id", item.id);
      payload.append("expiry_date", item.expiry_date);
      this.extendAgreementExpiry(payload)
        .then((res) => {
          this.sellersLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.fetchSeller();
        })
        .catch(() => {
          this.sellersLoader = false;
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
</style>
