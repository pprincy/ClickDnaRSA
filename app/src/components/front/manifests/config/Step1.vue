<template>
  <v-col class="mx-4">
    <v-row>
      <v-col cols="12" md="12" sm="12" xs="12">
        <p class="body-1 font-weight-bold pl-4 pt-4">
          Select a Carrier or Agent
        </p>
        <v-data-table
          v-model="selectedCarrier"
          :headers="headers"
          :items="carriers"
          item-key="id"
          height="300px"
          show-select
          single-select
          hide-default-footer
          disable-pagination
          class="elevation-1"
          :loading="loader"
        >
          <template v-slot:top>
            <v-row class="pb-6">
              <v-col cols="12" class="py-0">
                <Search
                  :search-options="searchOptions"
                  :val="searchType"
                  @changeText="(res) => (search = res)"
                  @changeType="(res) => (searchType = res)"
                />
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
      <!-- <v-col cols="12" md="6" sm="6" xs="12">
        <p class="body-1 font-weight-bold pt-4">
          Current Manifest Configuration
        </p>
        <p>Format: Excel</p>
        <p>Release: 24 Hour Before ETD</p>
        <p>Sorting: City Asc, Total Value Highest to Lowest</p>
        <br />
        <v-btn color="primary">
          <v-icon left dark> mdi-cloud-download </v-icon>
          Download Sample Layout
        </v-btn>
      </v-col> -->
    </v-row>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import Search from "@/components/front/common/Search";
export default {
  components: {
    Search,
  },
  data() {
    return {
      selectedCarrier: [],
      headers: [
        {
          text: "Company",
          value: "name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Countries Supporting Delivery",
          value: "supported_countries",
          class: "body-1 font-weight-bold",
        },
      ],
      carriers: [],
      searchOptions: [
        {
          text: "Company",
          value: "name",
        },
        {
          text: "Country",
          value: "supported_countries",
        },
      ],
      search: "",
      searchType: "name",
    };
  },
  watch: {
    search() {
      this.fetchCarriers();
    },
    searchType() {
      if (this.search) this.fetchCarriers();
    },
  },
  created() {
    this.fetchCarriers();
  },
  methods: {
    ...mapActions(["getCarrierData"]),
    fetchCarriers() {
      this.loader = true;
      this.getCarrierData({
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.loader = false;
          this.carriers = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
