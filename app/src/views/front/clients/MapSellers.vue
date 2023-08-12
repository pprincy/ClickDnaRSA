<!-- #56 -->
<template>
  <v-col class="mx-4">
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="sellers"
          :options.sync="options"
          :server-items-length="total"
          :loading="sellersLoader"
        >
          <template v-slot:top>
            <v-row class="mt-0">
              <v-col
                cols="12"
                md="8"
                class="d-flex flex-column align-left justify-center pt-0"
              >
                <v-toolbar-title class="pl-4 text-h6">
                  <v-btn icon :to="{ name: 'Clients' }" text>
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>
                  Mapped Sellers - {{ $route.query.name }}
                </v-toolbar-title>
              </v-col>
              <v-col cols="12" md="4" class="d-flex justify-end pt-0">
                <v-btn
                  color="primary"
                  :loading="sellersLoader"
                  @click="downloadMappedSellersDetails()"
                  >Download</v-btn
                >
              </v-col>

              <!-- <v-col cols="12" md="4" class="pt-0 d-flex">
                <v-autocomplete
                  class="mx-4 pt-0 w-90"
                  label="Search seller to map with client"
                  hide-details
                ></v-autocomplete>
                <v-btn
                  class="primary"
                  @click="save()"
                  :loading="saveLoader"
                  >Add Seller</v-btn
                >
              </v-col> -->
            </v-row>
            <v-row>
              <v-col cols="12" md="12" class="pt-0">
                <Search
                  :search-options="searchOptions"
                  :val="searchType"
                  @changeText="(res) => (search = res)"
                  @changeType="(res) => (searchType = res)"
                />
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  color="error"
                  @click="removeSeller(item)"
                >
                  mdi-close
                </v-icon>
              </template>
              <span>Remove Seller</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <ConfirmDialog
      :dialog="confimDialog"
      :loader="confirmLoader"
      @confirm="removeConfirm()"
      @close="confimDialog = false"
    />
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import Search from "@/components/front/common/Search";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";

export default {
  components: {
    Search,
    ConfirmDialog,
  },
  data() {
    return {
      sellers: [],
      headers: [
        {
          text: "Recipient Name",
          value: "name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Country",
          value: "country_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Legal Name",
          value: "legal_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Email",
          value: "email",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Actions",
          value: "actions",
          class: "body-1 font-weight-bold",
          width: "100px",
          sortable: false,
        },
      ],
      searchOptions: [
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
      sellersLoader: false,
      search: null,
      options: {},
      searchType: null,
      dialogConfirm: false,
      editedIndex: -1,
      editedItem: {
        id: null,
        name: null,
        country_name: null,
        email: null,
        legal_name: true,
        active: true,
      },
      // saveLoader: false,
      confimDialog: false,
      confirmLoader: false,
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    options: {
      handler() {
        this.fetchSellers();
      },
      deep: true,
    },
    search() {
      this.fetchSellers();
    },
    searchType() {
      if (this.search) this.fetchSellers();
    },
  },

  methods: {
    ...mapActions([
      "getMappedSellers",
      "unMapSeller",
      "downloadMappedSellers",
      "snackBar",
    ]),

    fetchSellers() {
      this.sellers = [];
      this.sellersLoader = true;
      this.getMappedSellers({
        id: this.$route.params.id,
        params: {
          ...this.options,
          search: this.search,
          type: this.searchType,
          status: this.statusType,
        },
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

    removeSeller(item) {
      this.editedItem = item;
      this.confimDialog = true;
    },

    removeConfirm() {
      this.confirmLoader = true;
      this.unMapSeller(this.editedItem.id)
        .then((res) => {
          this.confirmLoader = false;
          this.confimDialog = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.fetchSellers();
        })
        .catch(() => {
          this.confirmLoader = false;
        });
    },
    downloadMappedSellersDetails() {
      this.sellersLoader = true;
      this.downloadMappedSellers(this.$route.params.id)
        .then((res) => {
          this.fileDownload(res);
          this.sellersLoader = false;
        })
        .catch(() => {
          this.sellersLoader = false;
        });
    },

    // save() {
    //   if (!this.$refs.form.validate()) {
    //     return;
    //   }
    //   this.saveLoader = true;
    //   delete this.editedItem.country_name;
    //   this.updateManageSeller({
    //     id: this.editedItem.id,
    //     data: this.editedItem,
    //   })
    //     .then((res) => {
    //       this.fetchSellers();
    //       this.saveLoader = false;
    //       this.snackBar({
    //         color: "success",
    //         message: res.data.message,
    //       });
    //       this.close();
    //     })
    //     .catch(() => {
    //       this.saveLoader = false;
    //     });
    // },
  },
};
</script>
