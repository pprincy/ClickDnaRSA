<!-- #66 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="carriers"
      :options.sync="options"
      :server-items-length="total"
      :loading="carriersLoader"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col cols="12" md="8" sm="8" xs="12" class="pt-0">
            <v-toolbar-title class="pl-4 text-h6">
              Carrier Wise Coverage
            </v-toolbar-title>
          </v-col>
          <v-col cols="12" md="4" sm="4" xs="12" class="pt-0 text-right">
            <router-link
              class="text-decoration-none"
              :to="{ name: 'CountryWiseCoverage' }"
            >
              <v-btn
                color="primary"
                class="mr-2"
                small
                :loading="carriersLoader"
                >Country Wise Coverage</v-btn
              >
            </router-link>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" sm="12" xs="12" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.supported_countries`]="{ item }">
        <p class="ma-1" v-for="(s, i) in item.supported_countries" :key="i">
          {{ s }}
        </p>
      </template>
      <template v-slot:[`item.configure_countries`]="{ item }">
        <p class="ma-1" v-for="(s, i) in item.configure_countries" :key="i">
          {{ s }}
        </p>
      </template>
      <template v-slot:[`item.clients`]="{ item }">
        <p class="ma-1" v-for="(s, i) in item.clients" :key="i">
          {{ s }}
        </p>
      </template>
    </v-data-table>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import Search from "@/components/front/common/Search";

export default {
  components: {
    Search,
  },

  data: () => ({
    search: "",
    searchType: "name",
    searchOptions: [
      {
        text: "Carrier Name",
        value: "name",
      },
      {
        text: "Payment Type",
        value: "service_payment_type",
      },
      {
        text: "Configured Coverage",
        value: "configure_countries",
      },
    ],
    headers: [
      {
        text: "Carrier Name",
        value: "name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Payment Type",
        value: "service_payment_type",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Configured Coverage",
        value: "configure_countries",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Clients",
        value: "clients",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
    ],
    carriers: [],
    options: {},
    total: 0,
    carriersLoader: false,
  }),

  watch: {
    options: {
      handler() {
        this.fetchCarrierData();
      },
      deep: true,
    },
    search() {
      this.fetchCarrierData();
    },
    searchType() {
      if (this.search) this.fetchCarrierData();
    },
  },

  methods: {
    ...mapActions(["getCarriersCoverages", "snackBar"]),

    fetchCarrierData() {
      this.carriers = [];
      this.carriersLoader = true;
      this.getCarriersCoverages({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.carriersLoader = false;
          this.carriers = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.carriersLoader = false;
        });
    },
  },
};
</script>
