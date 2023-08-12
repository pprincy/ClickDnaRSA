<template>
  <v-dialog
    v-model="localDialog"
    max-width="800px"
    @keydown.esc="$emit('close', false)"
    persistent
  >
    <v-card>
      <v-card-title>
        <v-progress-linear v-if="loader" indeterminate></v-progress-linear>
        <span class="text-h6">
          Request for Freight Quote by RSA
          <i class="caption red--text ml-4"> * required field</i>
        </span>
      </v-card-title>
      <v-card-text class="pt-8">
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12 pt-0">
              <v-card
                class="d-flex align-center justify-space-between elevation-0"
                v-for="(item, i) in formData.dimensions"
                :key="i"
              >
                <strong class="text-no-wrap mr-3">Box {{ i + 1 }}</strong>
                <v-text-field
                  type="number"
                  label="Length"
                  suffix="cm"
                  v-model.number="item.length"
                  class="required"
                  :rules="[
                    (v) => (v !== '' && v !== undefined) || 'Field is required',
                    (v) => v > 0 || 'Number should be greater than 0',
                  ]"
                ></v-text-field>
                <v-icon class="mx-6">mdi-close</v-icon>
                <v-text-field
                  type="number"
                  label="Width"
                  suffix="cm"
                  v-model.number="item.width"
                  class="required"
                  :rules="[
                    (v) => (v !== '' && v !== undefined) || 'Field is required',
                    (v) => v > 0 || 'Number should be greater than 0',
                  ]"
                ></v-text-field>
                <v-icon class="mx-6">mdi-close</v-icon>
                <v-text-field
                  type="number"
                  label="Depth"
                  suffix="cm"
                  v-model.number="item.depth"
                  class="required"
                  :rules="[
                    (v) => (v !== '' && v !== undefined) || 'Field is required',
                    (v) => v > 0 || 'Number should be greater than 0',
                  ]"
                ></v-text-field>
                <div class="mx-4">&nbsp;</div>
                <v-text-field
                  type="number"
                  label="Quantity"
                  v-model.number="item.quantity"
                  class="required"
                  :rules="[
                    (v) => (v !== '' && v !== undefined) || 'Field is required',
                    (v) => v > 0 || 'Number should be greater than 0',
                    (v) => /^\d+$/.test(v) || 'Quantity must be valid',
                  ]"
                ></v-text-field>
                <v-btn
                  @click="addDimension()"
                  color="primary"
                  v-if="i === formData.dimensions.length - 1"
                  fab
                  x-small
                  class="ml-2"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn
                  @click="removeDimension(i)"
                  color="error"
                  v-else
                  fab
                  x-small
                  class="ml-2"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6">
              <v-text-field
                type="number"
                label="Total Gross Weight"
                v-model="formData.total_gross_weight"
                class="required"
                append-icon="KG"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6">
              <v-select
                v-model="formData.type"
                label="Type of Freight"
                :items="freightTypesItems"
                class="required"
                :rules="[(v) => v >= 0 || 'Please select an option']"
                @change="refreshDropdown()"
              ></v-select>
            </v-col>
            <v-col md="6" v-if="formData.type !== 1">
              <v-select
                v-model="formData.sea_shipping_type"
                label="Type of Shipping"
                :items="seaShippingTypesItems"
                class="required"
                :rules="[(v) => v >= 0 || 'Please select an option']"
              ></v-select>
            </v-col>
          </v-row>
          <template v-if="[0, 1].includes(formData.type)">
            <v-row>
              <v-col md="6">
                <v-autocomplete
                  label="Origin Country"
                  :items="allCountries"
                  v-model="formData.origin_country_id"
                  :rules="[(v) => !!v || 'Please select an option']"
                  autocomplete="off"
                  class="required"
                  @change="
                    fetchCountryPortsAirPorts(
                      formData.origin_country_id,
                      'origin'
                    )
                  "
                ></v-autocomplete>
              </v-col>
              <v-col md="6" v-if="formData.type === 1">
                <v-autocomplete
                  label="Origin Airport"
                  :items="originCountryAirPorts"
                  item-key="id"
                  item-text="name"
                  item-value="id"
                  v-model="formData.origin_airport_id"
                  :filter="filterAirportCodes"
                >
                  <template v-slot:item="{ item }">
                    {{ item.name }} ({{ item.code }})
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col md="6" v-if="formData.type !== 1">
                <v-autocomplete
                  label="Origin Port"
                  :items="originCountryPorts"
                  item-key="id"
                  item-text="name"
                  item-value="id"
                  v-model="formData.origin_port_id"
                  :filter="filterPortCodes"
                >
                  <template v-slot:item="{ item }">
                    {{ item.name }} ({{ item.code }})
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col md="6">
                <v-autocomplete
                  label="Destination Country"
                  :items="[
                    {
                      text: 'United Arab Emirates',
                      value: 'AE',
                    },
                  ]"
                  v-model="formData.destination_country_id"
                  :rules="[(v) => !!v || 'Please select an option']"
                  autocomplete="off"
                  class="required"
                  @change="
                    fetchCountryPortsAirPorts(
                      formData.destination_country_id,
                      'destination'
                    )
                  "
                ></v-autocomplete>
              </v-col>
              <v-col md="6" v-if="formData.type === 1">
                <v-autocomplete
                  label="Destination Airport"
                  :items="destinationCountryAirPorts"
                  item-key="id"
                  item-text="name"
                  item-value="id"
                  v-model="formData.destination_airport_id"
                  :filter="filterAirportCodes"
                >
                  <template v-slot:item="{ item }">
                    {{ item.name }} ({{ item.code }})
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col md="6" v-if="formData.type !== 1">
                <v-autocomplete
                  label="Destination Port"
                  :items="destinationCountryPorts"
                  item-key="id"
                  item-text="name"
                  item-value="id"
                  v-model="formData.destination_port_id"
                  :filter="filterPortCodes"
                >
                  <template v-slot:item="{ item }">
                    {{ item.name }} ({{ item.code }})
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </template>

          <v-row>
            <v-col md="6">
              <v-select
                v-model="formData.pickup_drop"
                label="PickUp Or Drop"
                :items="pickupDropItems"
                class="required"
                :rules="[(v) => v >= 0 || 'Please select an option']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="12">
              <v-textarea
                v-model="formData.address"
                :label="
                  ![0, 1].includes(formData.pickup_drop)
                    ? 'Address'
                    : formData.pickup_drop === 0
                    ? 'Pick Up Address'
                    : 'Drop Location'
                "
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="12">
              <v-text-field
                v-model="formData.comments"
                label="Comments"
                class="required"
                :rules="[(v) => !!v || 'Field is required']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('close', false)">
          close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="save"
          :loading="saveLoader"
          v-if="!freightId"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";
import {
  freightTypes,
  pickupDrop,
  countries,
  seaShippingTypes,
} from "@/config/data";
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    invId: {
      type: Number,
      default: 0,
    },
    freightId: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    allCountries() {
      return Object.keys(countries).map((i) => {
        return {
          text: countries[i],
          value: i,
        };
      });
    },
    freightTypesItems() {
      return freightTypes;
    },
    pickupDropItems() {
      return pickupDrop;
    },
    seaShippingTypesItems() {
      return seaShippingTypes;
    },
  },
  data() {
    return {
      saveLoader: false,
      formData: {
        destination_country_id: "AE",
        dimensions: [
          {
            length: null,
            width: null,
            depth: null,
            quantity: null,
          },
        ],
      },
      localDialog: false,
      loader: false,
      originCountryPorts: [],
      destinationCountryPorts: [],
      originCountryAirPorts: [],
      destinationCountryAirPorts: [],
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
      if (newVal && this.freightId) {
        this.$refs.form?.reset();
        this.fetchQuoteDetails();
      }
    },
  },
  methods: {
    ...mapActions([
      "createQuote",
      "getQuoteDetails",
      "getCountryAirPorts",
      "getCountryPorts",
      "snackBar",
    ]),
    fetchCountryPortsAirPorts(code, type = "origin") {
      if (!code) return;
      if (this.formData.type === 1 && type === "origin") {
        this.getCountryAirPorts(code).then((res) => {
          this.originCountryAirPorts = res.data;
        });
      } else if (this.formData.type === 1 && type === "destination") {
        this.getCountryAirPorts(code).then((res) => {
          this.destinationCountryAirPorts = res.data;
        });
      } else if (this.formData.type === 0 && type === "origin") {
        this.getCountryPorts(code).then((res) => {
          this.originCountryPorts = res.data;
        });
      } else if (this.formData.type === 0 && type === "destination") {
        this.getCountryPorts(code).then((res) => {
          this.destinationCountryPorts = res.data;
        });
      }
    },
    filterAirportCodes(item, queryText) {
      const name = item.name?.toLowerCase();
      const code = item.code?.toLowerCase();
      const searchText = queryText?.toLowerCase();
      return name?.indexOf(searchText) > -1 || code?.indexOf(searchText) > -1;
    },
    filterPortCodes(item, queryText) {
      const name = item.name?.toLowerCase();
      const code = item.code?.toLowerCase();
      const searchText = queryText?.toLowerCase();
      return name?.indexOf(searchText) > -1 || code?.indexOf(searchText) > -1;
    },
    refreshDropdown() {
      this.fetchCountryPortsAirPorts(this.formData.origin_country_id, "origin");
      this.fetchCountryPortsAirPorts(
        this.formData.destination_country_id,
        "destination"
      );
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      Object.assign(this.formData, { invoice_id: this.invId });
      this.createQuote(this.formData)
        .then((res) => {
          this.saveLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.$emit("close", false);
          this.$emit("created", res.data.record_id);
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
    fetchQuoteDetails() {
      this.loader = true;
      this.getQuoteDetails(this.freightId)
        .then((res) => {
          this.loader = false;
          this.formData = res.data;
          this.refreshDropdown();
        })
        .catch(() => {
          this.loader = false;
        });
    },
    addDimension() {
      this.formData.dimensions.push({
        length: null,
        width: null,
        depth: null,
        quantity: null,
      });
    },
    removeDimension(i) {
      this.formData.dimensions.splice(i, 1);
    },
  },
};
</script>

<style lang="scss">
.v-icon.v-icon {
  font-size: 20px;
}
</style>
