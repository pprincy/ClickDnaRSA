<template>
  <v-col>
    <v-row>
      <v-col cols="12" md="7" sm="5" xs="12">
        <template>
          <v-row class="pl-5" v-if="userCategory.user_category === 3">
            <v-col cols="12" class="pt-6">
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
                class="px-5 pb-2 pt-0 text-center required"
                :rules="[(v) => !!v || 'Please select client']"
                @change="fetchBag()"
                return-object
              ></v-autocomplete>
            </v-col>
          </v-row>
        </template>
        <v-data-table
          v-model="selectedBags"
          :headers="_headers"
          :items="bags"
          :options.sync="options"
          :server-items-length="total"
          :loading="bagsLoader"
          :show-select="+$route.query.r !== 1"
          disable-pagination
          hide-default-footer
          v-show="showConsolidation"
        >
          <template v-slot:top>
            <v-row class="pb-6">
              <v-col cols="12" class="pt-6">
                <Search
                  :search-options="searchOptions"
                  :val="searchType"
                  @changeText="(res) => (search = res)"
                  @changeType="(res) => (searchType = res)"
                />
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.created_at`]="{ item }">
            {{ item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A") }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="download(item.id)" small>
              mdi-download
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
      <v-col
        cols="12"
        md="1"
        sm="2"
        xs="12"
        class="d-flex align-center text-center"
      >
        <v-btn
          color="primary"
          :disabled="selectedBags.length === 0 || +$route.query.r === 1"
          @click="moveRight()"
        >
          <v-icon>mdi-chevron-double-right</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="4" sm="5" xs="12" v-show="showConsolidation">
        <!-- <div class="text-center py-0">
          <v-file-input
            v-model="file"
            accept=".xlsx"
            label="Upload Tracking Numbers"
            class="w-90"
            clearable
            hide-details
            single-line
            @change="upload"
            @click:clear="fileTrackingNumbers = []"
            :disabled="+$route.query.r === 1"
          >
          </v-file-input>
          <v-btn
            color="info"
            target="_blank"
            href="/Tracking-Numbers.xlsx"
            class="mt-2"
            >Download upload template</v-btn
          >
        </div> -->
        <v-text-field
          v-model="search2"
          append-icon="mdi-magnify"
          label="Search..."
          hide-details
        ></v-text-field>
        <v-list
          class="elevation-2 body-1 font-weight-bold overflow-y-auto"
          height="200px"
          dense
        >
          <template v-for="(item, i) in selectedTrackingNo">
            <div :key="i">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon v-if="+$route.query.r !== 1">
                  <v-btn icon text small @click="remove(i)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
              <v-divider></v-divider>
            </div>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import XLSX from "xlsx";
import Search from "@/components/front/common/Search";

export default {
  components: {
    Search,
  },
  computed: {
    ...mapGetters(["consolidationObj", "userRole", "userCategory"]),
    _headers() {
      return this.headers.filter((i) =>
        this.userRole.code !== "AD" ? i.value !== "client" : true
      );
    },
  },
  data() {
    return {
      bags: [],
      clients: [],
      selectedBags: [],
      selectedClient: null,
      showConsolidation: false,
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
          value: "client",
          class: "body-1 font-weight-bold",
          sortable: false,
        },
        {
          text: "Bag Number",
          value: "bag_number",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Bag Type",
          value: "bag_type",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Origin Airport",
          value: "origin_airport",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Destination Airport",
          value: "destination_airport",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Service",
          value: "service_code",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Weight (kg)",
          value: "weight",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Pcs",
          value: "pieces",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Value (USD)",
          value: "value",
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
        },
      ],
      searchOptions: [
        {
          text: "Bag #",
          value: "bag_number",
        },
        {
          text: "Destination Airport",
          value: "destination_airport",
        },
        {
          text: "Origin Airport",
          value: "origin_airport",
        },
        {
          text: "Service",
          value: "service_code",
        },
        // {
        //   text: "Split",
        //   value: "split_code",
        // },
      ],
      total: 0,
      bagsLoader: false,
      search: null,
      search2: null,
      options: {},
      searchType: null,
      selectedTrackingNo: [],
      file: null,
      clientLoader: false,
    };
  },
  watch: {
    options: {
      handler() {
        // this.fetchBag();
        if (this.userRole.code == "CL") {
          this.fetchBag();
        }
      },
      deep: true,
    },
    search() {
      this.fetchBag();
    },
    searchType() {
      if (this.search) this.fetchBag();
    },
  },

  created() {
    if (this.clients.length === 0 && this.userCategory.user_category === 3) {
      this.fetchClientList();
    }
  },

  methods: {
    ...mapActions([
      "getAllBags",
      "downloadBagDetails",
      "getClients",
      "snackBar",
    ]),
    fetchClientList() {
      if (this.clients.length) return;
      this.clientLoader = true;
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
    },
    fetchBag() {
      this.bags = [];
      this.bagsLoader = true;
      this.getAllBags(
        this.userRole.code == "AD"
          ? {
              ...this.options,
              search: this.search,
              type: this.searchType,
              status: this.statusType,
              ctx: "pending",
              client_id: this.selectedClient.id,
            }
          : {
              ...this.options,
              search: this.search,
              type: this.searchType,
              status: this.statusType,
              ctx: "pending",
            }
      )
        .then((res) => {
          this.bagsLoader = false;
          this.bags = res.data.records;
          this.total = res.data.total;
          this.showConsolidation = true;
        })
        .catch(() => {
          this.bagsLoader = false;
        });
    },
    upload() {
      if (!this.file) return;
      const reader = new FileReader();
      const $v = this;
      reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(first_worksheet);
        if (data.length === 0) return;
        data.forEach((i) => {
          if (!$v.selectedTrackingNo.includes(i["Tracking Number"])) {
            $v.selectedTrackingNo.unshift(i["Tracking Number"]);
          }
        });
      };
      reader.readAsArrayBuffer(this.file);
    },
    moveRight() {
      this.selectedBags.forEach((i) => {
        if (!this.selectedTrackingNo.includes(i.bag_number)) {
          this.selectedTrackingNo.unshift(i.bag_number);
        }
      });
      this.selectedBags = [];
    },
    remove(i) {
      this.selectedTrackingNo.splice(i, 1);
    },
    download(id) {
      this.bagsLoader = true;
      this.downloadBagDetails(id)
        .then((res) => {
          this.fileDownload(res);
          this.bagsLoader = false;
        })
        .catch(() => {
          this.bagsLoader = false;
        });
    },
  },
};
</script>
