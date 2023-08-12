<!-- #18 -->
<template>
  <v-row>
    <v-col md="12" sm="12" xs="12">
      <v-data-table
        :headers="_headers"
        :items="packages"
        :options.sync="options"
        :server-items-length="total"
        :loading="packagesLoader"
      >
        <template v-slot:top>
          <v-row class="my-4">
            <v-col md="9" sm="9" xs="12">
              <p class="text-h6 mt-5 ml-2">Packages</p>
            </v-col>
            <v-col
              md="3"
              sm="3"
              xs="12"
              class="d-flex flex-column align-center"
            >
              <p class="border-bottom px-4 pb-2 mb-4">Upload Package Data</p>
              <div class="d-flex">
                <v-btn
                  color="info"
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
                      @click="fetchClientList()"
                      >Upload package data</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Upload Package Data</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="form" lazy-validation>
                        <v-row
                          no-gutters
                          v-if="userCategory.user_category === 3"
                        >
                          <v-col md="1">
                            <v-icon class="mt-2">mdi-domain</v-icon>
                          </v-col>
                          <v-col md="11">
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
                              class="pb-2 pt-0 text-center required"
                              :rules="[(v) => !!v || 'Please select client']"
                              return-object
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
                              label="Select your packages file"
                              :rules="[
                                (v) => !!v || 'Please select Packages File',
                              ]"
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
                                name: 'PackagesTemplate',
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
          </v-row>
          <v-row class="pb-6" justify="space-around">
            <v-col cols="12" md="12" sm="12" xs="12" class="py-0">
              <Search
                :search-options="searchOptions"
                :val="searchType"
                @changeText="(res) => (search = res)"
                @changeType="(res) => (searchType = res)"
              />
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          {{ item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A") }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" small @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon @click="download(item.tracking_no)" small>
            mdi-download
          </v-icon>
        </template>
        <template v-slot:[`item.tracking_no`]="{ item }">
          <label @click="fetchTrackingDetails(item)">
            <a>{{ item.tracking_no }}</a>
          </label>
        </template>
      </v-data-table>
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
import { EventBus } from "@/plugins/event-bus";
import Search from "@/components/front/common/Search";
import BulkErrors from "@/components/front/common/BulkErrors";

export default {
  components: {
    Search,
    BulkErrors,
  },
  computed: {
    ...mapGetters(["userRole", "userCategory"]),
    _headers() {
      return this.headers.filter((i) =>
        this.userRole.code !== "AD" ? i.value !== "client_name" : true
      );
    },
  },
  data() {
    return {
      packages: [],
      clients: [],
      selectedClient: null,
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
          sortable: false,
        },
        {
          text: "Tracking Number",
          value: "tracking_no",
          class: "body-1 font-weight-bold",
          width: "150px",
        },
        {
          text: "Recipient Name",
          value: "recipient_name",
          class: "body-1 font-weight-bold",
          width: "150px",
        },
        {
          text: "Origin Country",
          value: "origin_country",
          class: "body-1 font-weight-bold",
          width: "180px",
        },
        {
          text: "Destination Country",
          value: "destination_country",
          class: "body-1 font-weight-bold",
          width: "180px",
        },
        {
          text: "Weight (kg)",
          value: "weight",
          class: "body-1 font-weight-bold",
          sortable: false,
        },
        {
          text: "Qty",
          value: "quantity",
          class: "body-1 font-weight-bold",
          sortable: false,
        },
        {
          text: "Value",
          value: "total_value",
          class: "body-1 font-weight-bold",
          width: "150px",
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
          width: "150px",
        },
      ],
      searchOptions: [
        {
          text: "Tracking #",
          value: "tracking_no",
        },
        {
          text: "Origin Country",
          value: "origin_country",
        },
        {
          text: "Destination country",
          value: "destination_country",
        },
        {
          text: "Status",
          value: "status",
        },
      ],
      total: 0,
      packagesLoader: false,
      search: null,
      options: {},
      searchType: null,
      file: null,
      fileLoader: false,
      dialog: false,
      statusType: null,
      downloader: false,
      uploadRes: {},
      uploadResDialog: false,
      clientLoader: false,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    options: {
      handler() {
        this.fetchPackage();
      },
      deep: true,
    },
    search() {
      this.fetchPackage();
    },
    searchType() {
      if (this.search) this.fetchPackage();
    },
  },

  created() {
    EventBus.$off("packageStatus");
    EventBus.$on("packageStatus", (status) => {
      this.statusType = status;
      this.fetchPackage();
    });
  },

  methods: {
    ...mapActions([
      "getAllPackages",
      "downloadPackageDetails",
      "downloadPackageDataTemplate",
      "uploadPackageExcel",
      "getClients",
      "snackBar",
    ]),
    fetchPackage() {
      this.packages = [];
      this.packagesLoader = true;
      this.getAllPackages({
        ...this.options,
        search: this.search,
        type: this.searchType,
        status: this.statusType,
      })
        .then((res) => {
          this.packagesLoader = false;
          this.packages = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.packagesLoader = false;
        });
    },

    editItem(item) {
      this.$router.push({
        name: "PackageDetails",
        params: {
          id: item.tracking_no,
        },
      });
    },

    close() {
      this.dialog = false;
    },

    download(id) {
      this.packagesLoader = true;
      this.downloadPackageDetails(id)
        .then((res) => {
          this.fileDownload(res);
          this.packagesLoader = false;
        })
        .catch(() => {
          this.packagesLoader = false;
        });
    },

    downloadTemplate() {
      this.downloader = true;
      this.downloadPackageDataTemplate()
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
      if (this.userCategory.user_category === 3) {
        payload.append("client_id", this.selectedClient.id);
      }
      this.uploadPackageExcel(payload)
        .then((res) => {
          this.fileLoader = false;
          this.dialog = false;
          this.uploadRes = res.data;
          this.uploadResDialog = true;
          this.fetchPackage();
          EventBus.$emit("packCountUpdate");
        })
        .catch(() => {
          this.fileLoader = false;
        });
    },
    fetchClientList() {
      if (this.clients.length) return;
      this.clientLoader = true;
      if (this.clients.length === 0 && this.userCategory.user_category === 3) {
        this.getClients({
          fields: "id,name",
          pagination: 0,
          service: "clickdna",
        })
          .then((res) => {
            this.clientLoader = false;
            this.clients = res.data;
          })
          .catch(() => {
            this.clientLoader = false;
          });
      }
    },
    fetchTrackingDetails(item) {
      this.$router.push({
        name: "ClientTrackingDetails",
        params: {
          id: item.tracking_no,
          viewName: "orderList",
        },
      });
    },
  },
};
</script>
