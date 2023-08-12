<template>
  <v-container>
    <v-row v-if="!selectedCarrier && poolCarriers && poolCarriers.length">
      <v-col cols="12">
        <p class="text-h6">Select carrier to continue</p>
      </v-col>
      <template v-for="(c, i) in carriers">
        <v-col
          cols="2"
          :key="i"
          v-if="poolCarriers && poolCarriers.includes(c.id)"
        >
          <img
            :src="c.carrier_logo | assetURL"
            :alt="c.code"
            class="carrier-logo"
            @click="setSelectedCarrier(c)"
          />
        </v-col>
      </template>
    </v-row>
    <template v-if="selectedCarrier">
      <v-btn
        class="pl-0 mr-5"
        text
        @click="resetSelectedCarrier()"
        v-if="poolCarriers.length"
      >
        <v-icon dark left> mdi-arrow-left </v-icon> Back
      </v-btn>
      <strong class="text-h6"
        >Restriction for {{ selectedCarrier.name }}
        <i class="caption red--text ml-4"> * required field</i>
      </strong>
      <v-tabs v-model="restTabs" color="cyan" centered>
        <v-tab>Customers</v-tab>
        <v-tab>City/Postal</v-tab>
        <v-tab>Weight</v-tab>
        <v-tab>Size</v-tab>
      </v-tabs>
      <v-tabs-items v-model="restTabs">
        <v-tab-item>
          <v-form ref="ctmrForm">
            <v-row>
              <v-col cols="10">
                <v-autocomplete
                  v-model="selectedCtmr"
                  :items="customers"
                  :loading="ctmrLoader"
                  :search-input.sync="searchCtmr"
                  hide-no-data
                  item-text="name"
                  item-value="id"
                  label="Select customers"
                  placeholder="Start typing to Search"
                  prepend-icon="mdi-database-search"
                  class="mt-10 required"
                  :rules="[(v) => !!v || 'Please select a customer.']"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="2" class="text-right">
                <v-btn color="primary" class="mt-10" @click="addCtmr()"
                  >Add</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
          <v-row no-gutters>
            <v-col>
              <v-data-table
                hide-default-footer
                disable-pagination
                dense
                :headers="ctmrHeaders"
                :items="selectedCustomers"
              >
                <template v-slot:top>
                  <p class="text-h6 pa-0 pt-10">Customers</p>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="deleteCtmr(item)"> mdi-delete </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-form ref="cityForm">
            <v-row>
              <v-col cols="5">
                <v-autocomplete
                  v-model="cityForm.city"
                  :rules="[(v) => !!v || 'City is required.']"
                  :items="cities"
                  :loading="cityLoader"
                  :search-input.sync="searchCity"
                  hide-no-data
                  item-text="name"
                  item-value="id"
                  label="Select city"
                  placeholder="Start typing to Search"
                  class="mt-10 required"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="5">
                <v-radio-group
                  class="mt-13"
                  v-model="cityForm.restriction_type"
                  row
                >
                  <v-radio label="Include" value="Include"></v-radio>
                  <v-radio label="Exclude" value="Exclude"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  label="Postal Code Start"
                  v-model="cityForm.postal_start"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  label="Postal Code End"
                  v-model="cityForm.postal_end"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="text-right">
                <v-btn color="primary" @click="addCity()">Add</v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-row no-gutters>
            <v-col>
              <v-data-table
                hide-default-footer
                disable-pagination
                dense
                :headers="cityHeaders"
                :items="selectedCities"
              >
                <template v-slot:top>
                  <p class="text-h6 pa-0 pt-10">City/Postal Ranges</p>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="deleteCity(item)"> mdi-delete </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-form ref="weightForm">
            <v-row>
              <v-col cols="5">
                <v-text-field
                  label="Min. Weight"
                  v-model="weightForm.min_weight"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Min. Weight is required.',
                  ]"
                  suffix="Kgs"
                  class="mt-10 required"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  label="Max. Weight"
                  v-model="weightForm.max_weight"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Max. Weight is required.',
                  ]"
                  suffix="Kgs"
                  class="mt-10 required"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="text-right">
                <v-btn color="primary" class="mt-10" @click="addWeight()"
                  >Add</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
          <v-row no-gutters>
            <v-col>
              <v-data-table
                hide-default-footer
                disable-pagination
                dense
                :headers="weightHeaders"
                :items="selectedWeights"
              >
                <template v-slot:top>
                  <p class="text-h6 pa-0 pt-10">Weight Ranges</p>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="deleteWeight(item)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-form ref="dimentionForm">
            <v-row>
              <v-col cols="3"
                ><v-text-field
                  label="Width"
                  v-model="dimentionForm.width"
                  :rules="[(v) => (v && !!v.trim()) || 'Width is required.']"
                  suffix="cm"
                  class="mt-10 required"
                ></v-text-field
              ></v-col>
              <v-col cols="3"
                ><v-text-field
                  label="Height"
                  v-model="dimentionForm.height"
                  :rules="[(v) => (v && !!v.trim()) || 'Height is required.']"
                  suffix="cm"
                  class="mt-10 required"
                ></v-text-field
              ></v-col>
              <v-col cols="3">
                <v-text-field
                  label="Length"
                  v-model="dimentionForm.length"
                  :rules="[(v) => (v && !!v.trim()) || 'Length is required.']"
                  suffix="cm"
                  class="mt-10 required"
                ></v-text-field>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-btn color="primary" class="mt-10" @click="addDimention()"
                  >Add</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
          <v-row no-gutters>
            <v-col>
              <v-data-table
                hide-default-footer
                disable-pagination
                dense
                :headers="dimHeaders"
                :items="selectedDimentions"
              >
                <template v-slot:top>
                  <p class="text-h6 pa-0 pt-10">Dimentions</p>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="deleteDimention(item)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: {
    poolCarriers: {
      type: Array,
      default: () => [],
    },
    carriers: {
      type: Array,
      default: () => [],
    },
    node: {
      type: Object,
      default: () => ({}),
    },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedCarrier: null,
      restTabs: 0,
      selectedCtmr: null,
      selectedCustomers: [],
      ctmrLoader: false,
      searchCtmr: null,
      customers: [],
      ctmrHeaders: [
        {
          text: "Customer",
          value: "name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "body-1 font-weight-bold",
        },
      ],
      weightHeaders: [
        {
          text: "Min. Weight(Kgs)",
          value: "min_weight",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Max. Weight(Kgs)",
          value: "max_weight",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "body-1 font-weight-bold",
        },
      ],
      weightForm: {},
      selectedWeights: [],
      dimHeaders: [
        {
          text: "Height(cm)",
          value: "height",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Width(cm)",
          value: "width",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Length(cm)",
          value: "length",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "body-1 font-weight-bold",
        },
      ],
      selectedDimentions: [],
      dimentionForm: {},
      cityForm: {
        restriction_type: "Include",
      },
      selectedCities: [],
      cityLoader: false,
      searchCity: null,
      cities: [],
      cityHeaders: [
        {
          text: "City",
          value: "name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Postal Code Start",
          value: "postal_start",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Postal Code End",
          value: "postal_end",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Include/Exclude",
          value: "restriction_type",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "body-1 font-weight-bold",
        },
      ],
    };
  },
  watch: {
    searchCtmr(val) {
      val && val !== this.selectedCtmr?.name && this.fetchClientList();
    },
    searchCity(val) {
      val && val !== this.cityForm.city?.name && this.fetchCityList();
    },
    dialog(val) {
      if (val) {
        this.changeSelectedCarrier();
        this.fetchCityList();
      }
    },
  },
  mounted() {
    this.changeSelectedCarrier();
    this.fetchClientList();
    this.fetchCityList();
  },
  methods: {
    ...mapActions(["snackBar", "getClients", "getCities"]),
    fetchCarrierRestrictions() {
      if (!this.$route.params.id || !this.selectedCarrier) return;
      const settings = this.node?.carrier_settings?.find(
        (cs) => cs.entity_id === this.selectedCarrier?.id
      );
      this.selectedCustomers = settings?.restrictions?.customers || [];
      this.selectedCities = settings?.restrictions?.city_postals || [];
      this.selectedWeights = settings?.restrictions?.weight_ranges || [];
      this.selectedDimentions = settings?.restrictions?.dimensions || [];
    },
    fetchClientList() {
      this.ctmrLoader = true;
      this.getClients({
        fields: "id,name",
        search: this.searchCtmr,
      })
        .then((res) => {
          this.ctmrLoader = false;
          this.customers = res.data.records;
        })
        .catch(() => {
          this.ctmrLoader = false;
        });
    },
    fetchCityList() {
      this.cityLoader = true;
      this.getCities({
        countryCode: this.node.countryCode,
        params: {
          search: this.searchCity,
        },
      })
        .then((res) => {
          this.cityLoader = false;
          this.cities = res.data.records;
        })
        .catch(() => {
          this.cityLoader = false;
        });
    },
    setSelectedCarrier(c) {
      this.selectedCarrier = c;
      this.fetchCarrierRestrictions();
    },
    resetSelectedCarrier() {
      this.selectedCarrier = null;
      this.selectedCustomers = [];
      this.selectedCities = [];
      this.selectedWeights = [];
      this.selectedDimentions = [];
    },
    changeSelectedCarrier() {
      if (this.poolCarriers.length) {
        this.selectedCarrier = this.carriers.find(
          (c) => c.id === this.poolCarriers[0]
        );
      } else {
        this.selectedCarrier = null;
      }
      this.fetchCarrierRestrictions();
    },
    addCtmr() {
      if (!this.$refs.ctmrForm.validate()) {
        return;
      }
      if (
        this.selectedCustomers.findIndex(
          (i) => i.id === this.selectedCtmr.id
        ) !== -1
      )
        return this.snackBar({
          color: "error",
          message: "Data is already added.",
        });
      this.selectedCustomers.push({
        id: this.selectedCtmr.id,
        name: this.selectedCtmr.name,
      });
      this.$refs.ctmrForm.reset();
    },
    addWeight() {
      if (!this.$refs.weightForm.validate()) {
        return;
      }
      if (
        this.selectedWeights.findIndex(
          (i) =>
            i.min_weight === this.weightForm.min_weight &&
            i.max_weight === this.weightForm.max_weight
        ) !== -1
      )
        return this.snackBar({
          color: "error",
          message: "Data is already added.",
        });
      this.selectedWeights.push({
        min_weight: this.weightForm.min_weight,
        max_weight: this.weightForm.max_weight,
      });
      this.$refs.weightForm.reset();
    },
    addCity() {
      if (!this.$refs.cityForm.validate()) {
        return;
      }
      if (
        this.selectedCities.findIndex(
          (i) =>
            i.postal_start === this.cityForm.postal_start &&
            i.postal_end === this.cityForm.postal_end &&
            i.city_id === this.cityForm.city.id &&
            i.restriction_type === this.cityForm.restriction_type
        ) !== -1
      )
        return this.snackBar({
          color: "error",
          message: "Data is already added.",
        });
      this.selectedCities.push({
        name: this.cityForm.city.name,
        postal_start: this.cityForm.postal_start,
        postal_end: this.cityForm.postal_end,
        city_id: this.cityForm.city.id,
        restriction_type: this.cityForm.restriction_type,
      });
      this.$refs.cityForm.reset();
      this.$nextTick(() => {
        this.cityForm.restriction_type = "Include";
      });
    },
    addDimention() {
      if (!this.$refs.dimentionForm.validate()) {
        return;
      }
      if (
        this.selectedDimentions.findIndex(
          (i) =>
            i.width === this.dimentionForm.width &&
            i.height === this.dimentionForm.height &&
            i.length === this.dimentionForm.length
        ) !== -1
      )
        return this.snackBar({
          color: "error",
          message: "Data is already added.",
        });
      this.selectedDimentions.push({
        width: this.dimentionForm.width,
        height: this.dimentionForm.height,
        length: this.dimentionForm.length,
      });
      this.$refs.dimentionForm.reset();
    },
    deleteCtmr(item) {
      this.selectedCustomers.splice(
        this.selectedCustomers.findIndex((i) => i.id === item.id),
        1
      );
    },
    deleteWeight(item) {
      const index = this.selectedWeights.findIndex(
        (i) =>
          i.min_weight === item.min_weight && i.max_weight === item.max_weight
      );
      this.selectedWeights.splice(index, 1);
    },
    deleteCity(item) {
      const index = this.selectedCities.findIndex(
        (i) =>
          i.postal_start === item.postal_start &&
          i.postal_end === item.postal_end &&
          i.city_id === item.city_id &&
          i.restriction_type === item.restriction_type
      );
      this.selectedCities.splice(index, 1);
    },
    deleteDimention(item) {
      const index = this.selectedDimentions.findIndex(
        (i) =>
          i.width === item.width &&
          i.height === item.height &&
          i.length === item.length
      );
      this.selectedDimentions.splice(index, 1);
    },
  },
};
</script>
<style scoped>
.carrier-logo {
  max-width: 100%;
  max-height: 20px;
}
.carrier-logo:hover {
  opacity: 0.7;
  cursor: pointer;
}
</style>
