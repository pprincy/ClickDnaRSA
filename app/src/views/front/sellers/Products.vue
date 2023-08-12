<!-- #60 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="_headers"
      :items="products"
      :options.sync="options"
      :server-items-length="total"
      :loading="productsLoader"
    >
      <template v-slot:top>
        <p class="text-h6 ml-2 d-inline-block">Check Product Eligibility</p>
        <div class="help-videos-sec" @click="showHelpVideoSection()">
          <v-icon>mdi-help</v-icon>
          <label class="video-title">How to check Product Eligibility</label>
          <v-btn class="mx-2 video-btn" fab dark small>
            <v-icon dark> mdi-video </v-icon>
          </v-btn>
        </div>
        <v-row class="pb-6">
          <v-col cols="12" md="6" sm="12" xs="12" v-if="userRole.code == 'AD'">
            <v-form
              class="d-flex flex-column align-center"
              ref="sellerForm"
              lazy-validation
            >
              <v-autocomplete
                v-model="selectedClient"
                :items="clients"
                :loading="clientLoader"
                hide-no-data
                hide-details
                item-text="name"
                item-value="id"
                label="Select Client"
                placeholder="Start typing to Search"
                class="px-4 pb-2 pt-0 w-90 text-center required"
                :rules="[(v) => !!v || 'Please select client']"
                return-object
              ></v-autocomplete>
              <v-btn
                color="primary"
                :disabled="!selectedClient"
                @click="goToMapping()"
              >
                Add Product Code and HS Code mapping
              </v-btn>
            </v-form>
          </v-col>
          <v-col cols="12" md="6" sm="12" xs="12">
            <v-form
              class="d-flex flex-column align-center"
              ref="form"
              lazy-validation
            >
              <v-autocomplete
                v-model="formData.selectedClient"
                :items="clients"
                :loading="clientLoader"
                hide-no-data
                hide-details
                item-text="name"
                item-value="id"
                label="Select Client"
                placeholder="Start typing to Search"
                class="px-4 pb-2 pt-0 w-90 text-center required"
                :rules="[(v) => !!v || 'Please select client']"
                @change="fetchSellerList()"
              ></v-autocomplete>
              <v-autocomplete
                v-if="userRole.code === 'AD'"
                v-model="formData.seller_id"
                :items="sellers"
                :loading="sellerLoader"
                hide-no-data
                item-text="name"
                item-value="id"
                label="Select Seller"
                placeholder="Start typing to Search"
                class="px-4 pb-2 pt-0 w-90 text-center required"
                :rules="[(v) => !!v || 'Please select seller']"
              ></v-autocomplete>
              <template>
                <v-file-input
                  v-model="file"
                  accept=".csv"
                  label="Select csv for new product code"
                  :rules="[
                    (v) => !!v || 'CSV File is required.',
                    (v) =>
                      !v ||
                      v.size < 2097152 ||
                      `File size should be less than 2 MB!`,
                    (v) => !v || ['text/csv'],
                  ]"
                  class="px-4 pb-2 pt-0 w-90 text-center required"
                  prepend-icon=""
                  append-icon="mdi-paperclip"
                  hide-details
                >
                </v-file-input>
                <div class="d-flex">
                  <v-btn
                    color="info"
                    class="mr-2"
                    small
                    :loading="downloader"
                    @click="downloadTemplate()"
                    >Download template</v-btn
                  >
                  <v-btn
                    color="primary"
                    :loading="fileLoader"
                    @click="upload"
                    small
                    >Upload New Product Code</v-btn
                  >
                </div>
              </template>
            </v-form>
          </v-col>
          <v-col cols="12" md="12" sm="12" xs="12">
            <v-divider class="my-2"></v-divider>
            <p class="text-h6 ml-2 d-inline-block">Product Eligibility</p>
            <Search
              :search-options="searchOptions"
              :val="searchType"
              :items="statusItems"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <ProductDetails
          :default-item="editedItem"
          :invoice="{
            id: editProduct.id,
            invoice_number: editProduct.invoice_number,
            client_name: editProduct.client_name,
            seller_name: editProduct.seller_name,
            product_id: editProduct.product_id,
            product_description: editProduct.product_description,
            hs_code: editProduct.hs_code,
          }"
          :dialog="editDialog"
          @close="editDialog = false"
          @refreshData="fetchTempProducts()"
        />
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
      <template v-slot:[`item.status`]="{ item }">
        <strong
          :class="{
            'primary--text': +item.status === 0,
            'green--text': +item.status === 1,
            'red--text': +item.status === 2,
          }"
        >
          {{ item.status | statusStr }}
        </strong>
        <p v-if="item.status == 2">
          <strong>Reason:</strong> {{ item.reject_reason }}
        </p>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        {{ item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A") }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn @click="refresh(item)" :loading="item.loader" icon>
          <v-icon class="mr-2" small> mdi-refresh </v-icon>
        </v-btn>
        <v-icon small class="mr-2" @click="editProductDetails(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
    <BulkErrors
      :dialog="uploadResDialog"
      :data="uploadRes"
      @close="uploadResDialog = false"
    />
    <template>
      <v-row justify="center">
        <v-col cols="auto">
          <v-dialog v-model="showVideoUrl" width="900">
            <v-card class="text-center">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title class="mt-4"
                    ><strong
                      ><u
                        >Video on How to check the Verify Product Eligibility</u
                      ></strong
                    >
                  </v-list-item-title>
                  <v-list-item-subtitle class="mb-4">
                    <video
                      width="850"
                      height="500"
                      id="my-video"
                      class="video-js"
                      controls
                      preload="auto"
                      data-setup=""
                      loop
                    >
                      <source
                        src="/videos/Freight Module - IOR Portal - Check Prod Eligibility.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions class="pa-5">
                <v-btn
                  class="ml-auto"
                  outlined
                  color="primary"
                  @click="showVideoUrl = false"
                  >Close</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </template>
  </v-col>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Search from "@/components/front/common/Search";
import ProductDetails from "./ProductDetails";
import { productStatues } from "@/config/data";
import BulkErrors from "@/components/front/common/BulkErrors";

export default {
  components: {
    Search,
    ProductDetails,
    BulkErrors,
  },

  computed: {
    ...mapGetters(["userRole"]),
    _headers() {
      return this.headers.filter((i) =>
        this.userRole.code !== "AD" ? i.value !== "actions" : true
      );
    },
    statusItems() {
      return Object.keys(productStatues).map((i) => {
        return {
          text: productStatues[i],
          value: i,
        };
      });
    },
  },

  filters: {
    statusStr(key) {
      if (!productStatues) return "";
      return productStatues[key];
    },
  },

  data() {
    return {
      formData: {},
      sellerLoader: false,
      sellers: [],
      editProduct: {},
      uploadRes: {},
      uploadResDialog: false,
      showVideoUrl: false,

      headers: [
        {
          text: "ID",
          value: "id",
          display: true,
        },
        {
          text: "Actions",
          value: "actions",
          class: "body-1 font-weight-bold",
          width: "100px",
          sortable: false,
        },
        {
          text: "Package Invoice Number",
          value: "invoice_number",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Client Name",
          value: "client_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Seller Name",
          value: "seller_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Product Code (ASIN)",
          value: "product_id",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Product Description",
          value: "product_description",
          class: "body-1 font-weight-bold",
        },
        {
          text: "HS Code by Seller",
          value: "hs_code",
          class: "body-1 font-weight-bold",
        },
        {
          text: "HS Code by RSA",
          value: "rsa_hs_code",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Status",
          value: "status",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Created At",
          value: "created_at",
          class: "body-1 font-weight-bold",
          width: "180px",
        },
      ],
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
          text: "Product Code (ASIN)",
          value: "product_id",
        },
        {
          text: "HS Code",
          value: "hs_code",
        },
        {
          text: "Status",
          value: "status",
        },
      ],
      products: [],
      total: 0,
      productsLoader: false,
      search: null,
      options: {},
      searchType: null,
      file: null,
      fileLoader: false,
      statusType: null,
      downloader: false,
      editedItem: {},
      editDialog: false,
      clientLoader: false,
      clients: [],
      selectedClient: null,
    };
  },

  watch: {
    options: {
      handler() {
        this.fetchTempProducts();
      },
      deep: true,
    },
    search() {
      this.fetchTempProducts();
    },
    searchType() {
      if (this.search) this.fetchTempProducts();
    },
    userRole() {
      this.fetchClientList();
    },
  },

  created() {
    this.fetchClientList();
  },

  methods: {
    ...mapActions([
      "getTempProducts",
      "getClients",
      "getSellers",
      "downloadTempProdTemplate",
      "uploadTempProductExcel",
      "refreshProduct",
    ]),

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
    fetchSellerList() {
      if (this.userRole.code !== "AD") return;
      this.sellerLoader = true;
      this.getSellers({
        client_id: this.formData.selectedClient,
        params: {
          fields: "id,name",
          pagination: 0,
        },
      })
        .then((res) => {
          this.sellerLoader = false;
          this.sellers = res.data;
        })
        .catch(() => {
          this.sellerLoader = false;
        });
    },

    fetchTempProducts() {
      this.products = [];
      this.productsLoader = true;
      this.getTempProducts({
        ...this.options,
        search: this.search,
        type: this.searchType,
        status: this.statusType,
      })
        .then((res) => {
          this.productsLoader = false;
          this.products = res.data.records.map((item) => {
            this.$set(item, "loader", false);
            return item;
          });
          this.total = res.data.total;
        })
        .catch(() => {
          this.productsLoader = false;
        });
    },

    refresh(item) {
      item.loader = true;
      this.refreshProduct(item.id)
        .then((res) => {
          item.status = res.data.status;
          item.loader = false;
        })
        .catch(() => {
          item.loader = false;
        });
    },

    editItem(item) {
      this.editedItem = item;
      this.editDialog = true;
    },

    downloadTemplate() {
      this.downloader = true;
      this.downloadTempProdTemplate()
        .then((res) => {
          this.fileCSVDownload(res);
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
      payload.append("client_id", this.formData.selectedClient);
      payload.append("seller_id", this.formData.seller_id);
      this.uploadTempProductExcel(payload)
        .then((res) => {
          this.fileLoader = false;
          this.$refs.form.reset();
          this.fetchTempProducts();
          this.uploadRes = res.data;
          this.uploadResDialog = true;
        })
        .catch((error) => {
          console.log("error", error);
          this.fileLoader = false;
        });
    },

    goToMapping() {
      this.$router.push({
        name: "ProductHSCodeMap",
        params: {
          id: this.selectedClient.id,
        },
        query: {
          name: this.selectedClient.name,
        },
      });
    },
    editProductDetails(item) {
      this.editProduct = item;
      this.editDialog = true;
    },
    showHelpVideoSection() {
      this.showVideoUrl = true;
    },
  },
};
</script>

<style lang="scss">
.help-videos-sec {
  position: fixed;
  top: 170px;
  right: 0;
  color: white;
  background-color: rgba(45, 156, 49, 0.9411764705882353) !important;
  border-radius: 9px 0 0 9px;
  padding: 5px 0 5px 7px;
  box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%),
    0 1px 18px 0 rgb(0 0 0 / 12%);
  z-index: 2;
  cursor: pointer;
  .v-icon {
    color: white;
    font-size: 17px;
    margin-top: -2px;
  }
  .video-title {
    font-weight: bold;
    color: white;
    font-size: 12px;
  }
}
</style>
