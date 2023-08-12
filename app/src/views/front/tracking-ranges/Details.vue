<template>
  <v-col cols="2">
    <v-dialog
      v-model="dialog"
      max-width="750px"
      @keydown.esc="close"
      persistent
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          class="mr-4 float-right"
          v-bind="attrs"
          v-on="on"
        >
          Create
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5"
            >{{ formTitle }}
            <i class="caption red--text ml-4"> * required field</i></span
          >
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="12">
                <v-radio-group
                  v-model="editedItem.package_type"
                  label="Label Range For"
                  :rules="[(v) => !!v || 'Type is required.']"
                  row
                >
                  <v-radio
                    v-for="n in ['parcel', 'bag']"
                    :key="n"
                    :label="n | ucfirst"
                    :value="n"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" v-if="userCategory.user_category === 3">
                <v-autocomplete
                  v-model="editedItem.client_id"
                  :items="clients"
                  :loading="clientsLoader"
                  hide-no-data
                  item-text="name"
                  item-value="id"
                  label="Select client"
                  placeholder="Search"
                  :rules="[(v) => !!v || 'Please select a client.']"
                  class="required"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="editedItem.name"
                  label="Range Name"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Range name is required.',
                  ]"
                  class="required"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Quantity"
                  class="centered-input required"
                  v-model="editedItem.quantity"
                  :rules="[(v) => (v && !!v.trim()) || 'Quantity is required.']"
                >
                  <v-icon
                    slot="prepend-inner"
                    color="green"
                    :disabled="editedItem.quantity === 1"
                    @click="decreseQty(editedItem)"
                  >
                    mdi-minus
                  </v-icon>
                  <v-icon
                    slot="append"
                    color="red"
                    @click="increaseQty(editedItem)"
                  >
                    mdi-plus
                  </v-icon>
                </v-text-field>
              </v-col>
              <template v-if="editedItem.package_type === 'bag'">
                <v-col cols="12">
                  <v-autocomplete
                    label="Origin Airport"
                    :items="airportCodes"
                    item-key="id"
                    item-text="name"
                    item-value="id"
                    v-model="editedItem.origin_airport_id"
                    :rules="[(v) => !!v || 'Origin Airport is required.']"
                    :filter="filterAirportCodes"
                    class="required"
                  >
                    <template v-slot:item="{ item }">
                      {{ item.name }} ({{ item.city_code }})
                    </template>
                  </v-autocomplete>
                </v-col>
              </template>
              <template v-if="editedItem.package_type === 'bag'">
                <v-col cols="6">
                  <v-select
                    label="Bag Type"
                    :items="bagTypes"
                    v-model="editedItem.bag_type"
                    item-key="id"
                    item-text="name"
                    item-value="id"
                    :rules="[(v) => !!v || 'Bag Type is required.']"
                    class="required"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    label="Bag Mix"
                    :items="bagMixes"
                    v-model="editedItem.bag_mixture_id"
                    item-key="id"
                    item-text="name"
                    item-value="id"
                    :rules="[(v) => !!v || 'Bag Mix is required.']"
                    class="required"
                  ></v-select>
                </v-col>
              </template>
              <v-col cols="6">
                <v-autocomplete
                  label="Destination Country"
                  :items="allCountries"
                  v-model="editedItem.destination_country_id"
                  :rules="[(v) => !!v || 'Destination Country is required.']"
                  class="required"
                ></v-autocomplete>
              </v-col>
              <template v-if="editedItem.package_type === 'bag'">
                <v-col cols="6">
                  <v-autocomplete
                    label="Destination Airport"
                    :items="airportCodes"
                    item-key="id"
                    item-text="name"
                    item-value="id"
                    v-model="editedItem.destination_airport_id"
                    :rules="[(v) => !!v || 'Destination Airport is required.']"
                    :filter="filterAirportCodes"
                    class="required"
                  >
                    <template v-slot:item="{ item }">
                      {{ item.name }} ({{ item.city_code }})
                    </template>
                  </v-autocomplete>
                </v-col>
              </template>
              <!-- <v-col cols="6">
                <v-select
                  label="System Type"
                  :items="systemTypes"
                  v-model="editedItem.system_type"
                  :rules="[(v) => !!v || 'System type is required.']"
                  item-key="id"
                  item-value="id"
                  item-text="name"
                  class="required"
                ></v-select>
              </v-col> -->

              <v-col cols="6">
                <v-select
                  label="Service Code"
                  v-model="editedItem.service_code"
                  :rules="[(v) => !!v || 'Service Code is required.']"
                  :items="serviceCodes"
                  item-key="id"
                  item-text="name"
                  item-value="id"
                  class="required"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Validity"
                  :value="validity"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save" :loading="saveLoader">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { countries } from "@/config/data";
export default {
  props: {
    addItem: {
      type: Object,
      default: () => {},
    },
    defaultItem: {
      type: Object,
      default: () => {},
    },
    editedIndex: {
      type: Number,
      default: -1,
    },
    formTitle: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapGetters([
      "systemTypes",
      "bagTypes",
      "bagMixes",
      "serviceCodes",
      "airportCodes",
      "userRole",
      "userCategory",
    ]),
    allCountries() {
      return Object.keys(countries).map((i) => {
        return {
          text: countries[i],
          value: i,
        };
      });
    },
    validity() {
      return this.$moment().add(1, "years").format("DD, MMM YYYY");
    },
  },
  data() {
    return {
      dialog: false,
      editedItem: {},
      saveLoader: false,
      clients: [],
      clientsLoader: false,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
      this.editedItem = Object.assign({}, this.defaultItem);
      this.fetchClients();
    },
  },
  created() {
    this.getTrackingRangeSystemType();
    this.getTrackingRangeBagType();
    this.getBagMixes();
    this.getServiceCodes();
    this.getAirportCodes();
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
      "getClients",
    ]),
    fetchClients() {
      if (this.clients.length) return;
      this.clientLoader = true;
      if (this.clients.length === 0 && this.userCategory.user_category === 3)
        this.getClients({
          pagination: 0,
          fields: "id,name",
        })
          .then((res) => {
            this.clientsLoader = false;
            this.clients = res.data;
          })
          .catch(() => {
            this.clientsLoader = false;
          });
    },
    filterAirportCodes(item, queryText) {
      const name = item.name?.toLowerCase();
      const code = item.city_code?.toLowerCase();
      const searchText = queryText?.toLowerCase();
      return name?.indexOf(searchText) > -1 || code?.indexOf(searchText) > -1;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      this.createTrackingRange(this.editedItem)
        .then((res) => {
          this.saveLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.$emit("refreshData");
          this.close();
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
    increaseQty(item) {
      item.quantity++;
    },
    decreseQty(item) {
      item.quantity--;
    },
  },
};
</script>
