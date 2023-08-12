<!-- #34 -->
<template>
  <v-col class="mx-4">
    <v-progress-linear
      color="primary accent-4"
      indeterminate
      rounded
      height="4"
      :active="pageLoader"
    ></v-progress-linear>
    <v-row>
      <v-col class="pb-0 my-4">
        <v-btn icon :to="{ name: 'BagsList' }" class="mt-n1" text>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="text-h6 ml-2">Edit A Bag</span>
        <v-btn class="primary float-right" @click="save()" :loading="pageLoader"
          >Save</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card :loading="pageLoader">
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title>Bag Definition</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-autocomplete
              label="Origin Airport"
              :items="airportCodes"
              item-key="id"
              item-text="name"
              item-value="id"
              :rules="[(v) => !!v || 'Origin Airport is required.']"
              v-model="bagDetails.origin_airport_id"
              @change="searchAllPackages()"
              :filter="filterAirportCodes"
            >
              <template v-slot:prepend>
                <v-img
                  src="/images/Take Off.svg"
                  max-height="28"
                  max-width="28"
                ></v-img>
              </template>
              <template v-slot:item="{ item }">
                {{ item.name }} ({{ item.city_code }})
              </template>
            </v-autocomplete>
            <v-autocomplete
              label="Destination Airport"
              :items="airportCodes"
              item-key="id"
              item-text="name"
              item-value="id"
              :rules="[(v) => !!v || 'Destination Airport is required.']"
              v-model="bagDetails.destination_airport_id"
              @change="searchAllPackages()"
              :filter="filterAirportCodes"
            >
              <template v-slot:prepend>
                <v-img
                  src="/images/Landing.svg"
                  max-height="28"
                  max-width="28"
                ></v-img>
              </template>
              <template v-slot:item="{ item }">
                {{ item.name }} ({{ item.city_code }})
              </template>
            </v-autocomplete>
            <v-autocomplete
              label="Bag Type"
              :items="bagTypes"
              item-key="id"
              item-text="name"
              item-value="id"
              :rules="[(v) => !!v || 'Bag Type is required.']"
              v-model="bagDetails.bag_type_id"
            >
              <template v-slot:prepend>
                <v-img
                  src="/images/Bag.svg"
                  max-height="28"
                  max-width="28"
                ></v-img>
              </template>
            </v-autocomplete>
            <v-autocomplete
              label="Bag Mix"
              :items="bagMixes"
              item-key="id"
              item-text="name"
              item-value="id"
              :rules="[(v) => !!v || 'Bag Mix is required.']"
              v-model="bagDetails.bag_mixture_id"
            >
              <template v-slot:prepend>
                <v-img
                  src="/images/Bag Mix.svg"
                  max-height="28"
                  max-width="28"
                ></v-img>
              </template>
            </v-autocomplete>
            <v-autocomplete
              label="Service Code"
              :rules="[(v) => !!v || 'Service Code is required.']"
              :items="serviceCodes"
              item-key="id"
              item-text="name"
              item-value="id"
              v-model="bagDetails.service_code"
              @change="searchAllPackages()"
            >
              <template v-slot:prepend>
                <v-img
                  src="/images/Service.svg"
                  max-height="28"
                  max-width="28"
                ></v-img>
              </template>
            </v-autocomplete>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title>Packages In a Bag</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-autocomplete
              label="Select Packages"
              v-model="bagDetails.packages"
              clearable
              multiple
              small-chips
              deletable-chips
              outlined
              :items="allPackages"
              item-key="id"
              item-value="id"
              item-text="name"
              :loading="searchLoader"
            ></v-autocomplete>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "systemTypes",
      "bagTypes",
      "bagMixes",
      "serviceCodes",
      "airportCodes",
    ]),
  },
  data() {
    return {
      allPackages: [],
      packages: [],
      bagDetails: {},
      pageLoader: false,
      searchLoader: false,
    };
  },
  created() {
    this.getTrackingRangeSystemType();
    this.getTrackingRangeBagType();
    this.getBagMixes();
    this.getServiceCodes();
    this.getAirportCodes();
    this.fetchBagDetails();
  },
  methods: {
    ...mapActions([
      "snackBar",
      "createTrackingRange",
      "getTrackingRangeSystemType",
      "getTrackingRangeBagType",
      "getServiceCodes",
      "getAirportCodes",
      "getBagMixes",
      "getBagDetails",
      "findAllPackages",
      "updateBagDetails",
    ]),

    filterAirportCodes(item, queryText) {
      const name = item.name?.toLowerCase();
      const code = item.city_code?.toLowerCase();
      const searchText = queryText?.toLowerCase();
      return name?.indexOf(searchText) > -1 || code?.indexOf(searchText) > -1;
    },

    fetchBagDetails() {
      this.pageLoader = true;
      this.getBagDetails(this.$route.params.id)
        .then((res) => {
          this.pageLoader = false;
          this.bagDetails = res.data;
          this.searchAllPackages();
        })
        .catch(() => {
          this.pageLoader = false;
        });
    },

    searchAllPackages() {
      if (
        !this.bagDetails.origin_airport_id ||
        !this.bagDetails.destination_airport_id ||
        !this.bagDetails.service_code
      ) {
        return;
      }
      this.searchLoader = true;
      this.findAllPackages({
        origin_airport_id: this.bagDetails.origin_airport_id,
        destination_airport_id: this.bagDetails.destination_airport_id,
        service_code: this.bagDetails.service_code,
        bag_id: this.$route.params.id,
      })
        .then((res) => {
          this.searchLoader = false;
          this.allPackages = res.data;
        })
        .catch(() => {
          this.searchLoader = false;
        });
    },

    save() {
      this.pageLoader = true;
      this.updateBagDetails({
        id: this.$route.params.id,
        data: this.bagDetails,
      })
        .then((res) => {
          this.pageLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.pageLoader = false;
        });
    },
  },
};
</script>
