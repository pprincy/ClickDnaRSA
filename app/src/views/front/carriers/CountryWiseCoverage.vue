<!-- #84 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="countriesCoverage"
      :options.sync="options"
      :loading="countriesLoader"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col cols="12" md="8" sm="8" xs="12" class="pt-0">
            <v-toolbar-title class="pl-4 text-h6">
              Country Wise Coverage
            </v-toolbar-title>
          </v-col>
          <v-col cols="12" md="4" sm="4" xs="12" class="pt-0 text-right">
            <router-link
              class="text-decoration-none"
              :to="{ name: 'CarrierCoverage' }"
            >
              <v-btn
                color="primary"
                class="mr-2"
                small
                :loading="countriesLoader"
                >Carrier Wise Coverage</v-btn
              >
            </router-link>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" sm="12" xs="12" class="pt-0">
            <Search
              :search-options="searchOptions"
              @changeText="(res) => (search = res)"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.partner`]="{ item }">
        <p class="ma-1" v-for="(s, i) in item.partner" :key="i">
          {{ s }}
        </p>
      </template>
      <template v-slot:[`item.client`]="{ item }">
        <p class="ma-1" v-for="(s, i) in item.client" :key="i">
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
    searchOptions: [
      {
        text: "Country Coverage",
        value: "country_name",
      },
    ],
    headers: [
      {
        text: "Country Coverage",
        value: "country_name",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Partner",
        value: "partner",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Client",
        value: "client",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
    ],
    countriesCoverage: [],
    options: {},
    countriesLoader: false,
  }),

  watch: {
    options: {
      handler() {
        this.fetchCountryWiseCoverage();
      },
      deep: true,
    },
    search() {
      this.fetchCountryWiseCoverage();
    },
  },

  methods: {
    ...mapActions(["getCountrywiseCoverage"]),

    fetchCountryWiseCoverage() {
      this.countriesCoverage = [];
      this.countriesLoader = true;
      const payload = new FormData();
      payload.append("country", this.search);

      this.getCountrywiseCoverage(payload)
        .then((res) => {
          this.countriesLoader = false;
          this.countriesCoverage = res.data.records;
        })
        .catch(() => {
          this.countriesLoader = false;
        });
    },
  },
};
</script>
