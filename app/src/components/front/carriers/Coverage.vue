<template>
  <v-card elevation="0" class="mb-4">
    <v-card-title>
      Country/City Coverage
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="carrierCoverages"
      :options.sync="options"
      :server-items-length="total"
      :loading="loader"
      class="elevation-1"
    >
      <template v-slot:item.city_id="{ item }">
        <v-autocomplete
          v-model="item.city_id"
          :items="cities[item.country_code]"
          :loading="cityLoader"
          hide-no-data
          item-text="name"
          item-value="id"
          placeholder="Start typing to Search"
          @change="updateCity(item)"
        ></v-autocomplete>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="openCapacity(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Edit Capacity</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog
      v-model="capDialog"
      max-width="700px"
      @keydown.esc="capDialog = false"
      persistent
    >
      <v-card>
        <v-card-title class="text-h6"> Carrier Capacities </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="capHeaders"
            :items="carrierCapacities"
            :loading="capLoader"
            hide-default-footer
            disable-pagination
            class="elevation-0"
          >
            <template v-slot:item.no_of_vehicle="{ item }">
              <v-text-field
                type="number"
                v-model="item.no_of_vehicle"
              ></v-text-field>
            </template>
            <template v-slot:item.no_of_dpd="{ item }">
              <v-text-field
                type="number"
                v-model="item.no_of_dpd"
              ></v-text-field>
            </template>
            <template v-slot:item.utilization_percentage="{ item }">
              <v-text-field
                type="number"
                max="100"
                v-model="item.utilization_percentage"
              ></v-text-field>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="capDialog = false"> close </v-btn>
          <v-btn
            color="green darken-1"
            :loading="capLoader"
            text
            @click="saveCapacities()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      search: null,
      headers: [
        {
          text: "Country",
          value: "country_code",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Carrier City Name",
          value: "carrier_city_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Mapped City",
          value: "city_id",
          class: "body-1 font-weight-bold",
        },
        {
          text: "State",
          value: "state_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "body-1 font-weight-bold",
        },
      ],
      carrierCoverages: [],
      loader: false,
      total: 0,
      options: {},
      editedItem: {},
      cityLoader: false,
      searchCity: null,
      cities: {},
      capDialog: false,
      capHeaders: [
        {
          text: "Working Day",
          value: "working_day_label",
          class: "body-1 font-weight-bold",
        },
        {
          text: "No. Of Vehicles",
          value: "no_of_vehicle",
          class: "body-1 font-weight-bold",
        },
        {
          text: "No. Of Delivery Per Day",
          value: "no_of_dpd",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Utilization(%)",
          value: "utilization_percentage",
          class: "body-1 font-weight-bold",
        },
        {
          text: "No Of Packs Per Day",
          value: "no_of_packs_per_day",
          class: "body-1 font-weight-bold",
        },
      ],
      carrierCapacities: [],
      capLoader: false,
    };
  },

  watch: {
    options: {
      handler() {
        this.fetchCarrierCoverage();
      },
      deep: true,
    },
    search() {
      this.fetchCarrierCoverage();
    },
    capDialog(val) {
      if (!val) return;
      this.fetchCarrierCoverageCapacities();
    },
  },

  created() {
    this.fetchCityList();
  },

  methods: {
    ...mapActions([
      "updateCityCoverage",
      "getCarrierCoverage",
      "getCarrierCoverageCapacities",
      "updateCarrierCoverageCapacities",
      "getCities",
      "snackBar",
    ]),

    fetchCarrierCoverageCapacities() {
      this.capLoader = true;
      this.carrierCapacities = [];
      this.getCarrierCoverageCapacities({
        carrierId: this.$route.params.id,
        coverageId: this.editedItem.id,
      })
        .then((res) => {
          this.capLoader = false;
          this.carrierCapacities = res.data;
        })
        .catch(() => {
          this.capLoader = false;
        });
    },

    saveCapacities() {
      this.capLoader = true;
      this.updateCarrierCoverageCapacities({
        carrierId: this.$route.params.id,
        coverageId: this.editedItem.id,
        data: this.carrierCapacities,
      })
        .then((res) => {
          this.capLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.capDialog = false;
        })
        .catch(() => {
          this.capLoader = false;
        });
    },

    openCapacity(item) {
      this.editedItem = Object.assign({}, item);
      this.capDialog = true;
    },

    updateCity(item) {
      this.loader = true;
      this.updateCityCoverage({
        carrierId: this.$route.params.id,
        coverageId: item.id,
        data: {
          city_id: item.city_id,
        },
      })
        .then((res) => {
          this.loader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.loader = false;
        });
    },

    fetchCityList(countryCode) {
      if (!countryCode || this.cities[countryCode]) return;
      this.cities[countryCode] = [];
      this.cityLoader = true;
      this.getCities({
        countryCode: countryCode.toLowerCase(),
        params: {
          pagination: 0,
          fields: "id,name",
        },
      })
        .then((res) => {
          this.cityLoader = false;
          this.cities[countryCode] = res.data;
          this.$forceUpdate();
        })
        .catch(() => {
          this.cityLoader = false;
        });
    },

    fetchCarrierCoverage() {
      this.loader = true;
      this.carrierCoverages = [];
      this.getCarrierCoverage({
        carrierId: this.$route.params.id,
        params: {
          ...this.options,
          search: this.search,
        },
      })
        .then((res) => {
          this.loader = false;
          this.carrierCoverages = res.data.records;
          this.carrierCoverages.forEach((i) => {
            this.fetchCityList(i.country_code);
          });
          this.total = res.data.total;
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
