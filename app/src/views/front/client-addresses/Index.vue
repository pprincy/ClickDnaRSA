<!-- #23 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="addresses"
      :options.sync="options"
      :server-items-length="total"
      :loading="addressesLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="5"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6"
              >Client Addresses</v-toolbar-title
            >
          </v-col>
          <v-col cols="5" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
          <v-col cols="2">
            <v-btn
              color="primary"
              dark
              class="mr-4 float-right"
              @click="goToDetails(0)"
            >
              Create
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="goToDetails(item.id)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Edit</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              v-bind="attrs"
              v-on="on"
              class="mr-2"
              @click="removeAddress(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Delete</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <ConfirmDialog
      :dialog="dialogDelete"
      text="Are you sure want to delete this address?"
      :loader="statusLoader"
      @confirm="confirmDelete"
      @close="closeConfirm"
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
  data: () => ({
    dialogDelete: false,
    search: "",
    searchType: "country_id__code",
    searchOptions: [
      {
        text: "Country",
        value: "country_id__code",
      },
      {
        text: "Nick Name",
        value: "address_nick_name",
      },
      {
        text: "Company",
        value: "company_name",
      },
    ],
    headers: [
      {
        text: "Company",
        value: "company_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Nick Name",
        value: "address_nick_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Country",
        value: "country_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "City",
        value: "city_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Postal Code",
        value: "zip_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Tel1",
        value: "phone_number",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Tel2",
        value: "alternate_phone",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
        width: "150px",
      },
    ],
    addresses: [],
    options: {},
    total: 0,
    addressesLoader: false,
    statusLoader: false,
    editedIndex: -1,
  }),

  watch: {
    options: {
      handler() {
        this.fetchClientAddresses();
      },
      deep: true,
    },
    search() {
      this.fetchClientAddresses();
    },
    searchType() {
      if (this.search) this.fetchClientAddresses();
    },
  },

  methods: {
    ...mapActions(["getClientAddresses", "deleteClientAddress", "snackBar"]),
    fetchClientAddresses() {
      this.addresses = [];
      this.addressesLoader = true;
      this.getClientAddresses({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.addressesLoader = false;
          this.addresses = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.addressesLoader = false;
        });
    },
    closeConfirm() {
      this.dialogDelete = false;
    },
    confirmDelete() {
      this.deleteLoader = true;
      this.deleteClientAddress(this.editedItem.id)
        .then((res) => {
          this.deleteLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.fetchClientAddresses();
          this.closeConfirm();
        })
        .catch(() => {
          this.deleteLoader = false;
        });
    },
    removeAddress(item) {
      this.editedIndex = this.addresses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    goToDetails(id) {
      this.$router.push({
        name: "ClientAddressDetails",
        params: {
          id,
        },
      });
    },
  },
};
</script>
