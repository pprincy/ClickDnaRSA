<template>
  <v-container>
    <!-- <v-row v-if="!selectedCarrier && poolCarriers && poolCarriers.length">
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
    </v-row> -->
    <template v-if="selectedCarrier">
      <!-- <v-btn
        class="pl-0 mr-5"
        text
        @click="resetSelectedCarrier()"
        v-if="poolCarriers.length"
      >
        <v-icon dark left> mdi-arrow-left </v-icon> Back
      </v-btn>
      <strong class="text-h6"
        >Address Setup for {{ selectedCarrier.name }}</strong
      > -->
      <v-tabs v-model="lblTabs" color="cyan" centered>
        <!-- <v-tab href="#label">Label(s) To Print</v-tab> -->
        <v-tab href="#address">Address of {{ selectedCarrier.name }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="lblTabs">
        <!-- <v-tab-item value="label">
          <v-progress-linear
            :active="allLabelTypes.length === 0"
            :indeterminate="allLabelTypes.length === 0"
          ></v-progress-linear>
          <v-form ref="lblForm">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left body-1 font-weight-bold" width="80px">
                      Active
                    </th>
                    <th class="text-center body-1 font-weight-bold">
                      Label Format
                    </th>
                    <th class="text-center body-1 font-weight-bold">
                      Label Qty
                    </th>
                    <th class="text-center body-1 font-weight-bold">
                      Label type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(l, i) in allLabelTypes">
                    <tr :key="i" v-if="!isAllocated(l)">
                      <td>
                        <v-checkbox
                          v-model="l.selected"
                          :disabled="validateSelection(l)"
                        ></v-checkbox>
                      </td>
                      <td class="text-center">
                        <v-select
                          :items="paperFormats"
                          item-value="id"
                          item-text="name"
                          v-model="l.format"
                          :rules="
                            l.selected ? [(v) => (v && !!v.trim()) || 'Item is required'] : []
                          "
                        ></v-select>
                      </td>
                      <td class="text-center">
                        <v-text-field
                          class="centered-input"
                          v-model="l.qty"
                          readonly
                        >
                          <v-icon
                            slot="prepend-inner"
                            color="green"
                            :disabled="l.qty === 1"
                            @click="decreseQty(l)"
                          >
                            mdi-minus
                          </v-icon>
                          <v-icon
                            slot="append"
                            color="red"
                            @click="increaseQty(l)"
                          >
                            mdi-plus
                          </v-icon>
                        </v-text-field>
                      </td>
                      <td class="lbl-td">
                        <v-img class="lbl-img" :src="l.icon | assetURL"></v-img>
                        <span>{{ l.name }}</span>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </template>
            </v-simple-table>
          </v-form>
        </v-tab-item> -->
        <v-tab-item value="address">
          <v-form ref="addressForm" v-model="validAddressForm" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  label="Select Carrier"
                  :items="transitPartners"
                  v-model="addressForm.carrier_id"
                  :rules="[(v) => !!v || 'Carrier is required.']"
                  item-text="name"
                  item-value="id"
                  class="required"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Facility Name"
                  v-model="addressForm.name"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Facility Name is required.',
                  ]"
                  class="required"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Facility Code"
                  v-model="addressForm.facility_code"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Address 1"
                  v-model="addressForm.street"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Address 1 is required.',
                  ]"
                  class="required"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Address 2"
                  v-model="addressForm.street2"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Address 2 is required.',
                  ]"
                  class="required"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Phone"
                  v-model="addressForm.phone"
                  :rules="[(v) => (v && !!v.trim()) || 'Phone is required.']"
                  class="required"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Email"
                  v-model="addressForm.email"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Email address is required',
                    (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                  ]"
                  class="required"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="addressForm.city"
                  :rules="[(v) => !!v || 'City is required.']"
                  :items="cities"
                  :loading="cityLoader"
                  :search-input.sync="searchCity"
                  hide-no-data
                  item-text="name"
                  item-value="id"
                  label="Select city"
                  placeholder="Start typing to Search"
                  return-object
                  class="required"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="addressForm.is_import_export_hub"
                  label="Is import export hub"
                ></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
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
    nodes: {
      type: Array,
      default: () => [],
    },
    origin: {
      type: Object,
      default: null,
    },
    destination: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["paperFormats", "labelTypes", "transitPartners"]),
    // allLabelTypes() {
    //   return this.labelTypes.map((i) => {
    //     const selected = this.selectedLblTypes.find((slt) => slt.id === i.id);
    //     this.$set(i, "qty", selected?.qty || 1);
    //     this.$set(i, "format", selected?.format || null);
    //     this.$set(i, "selected", !!selected);
    //     return i;
    //   });
    // },
  },
  data() {
    return {
      selectedCarrier: null,
      selectedLblTypes: [],
      lblTabs: "address",
      addressList: [],
      labelAddresses: [],
      validAddressForm: true,
      cityLoader: false,
      searchCity: null,
      cities: [],
      addressForm: {
        name: null,
        facility_code: null,
        street: null,
        street2: null,
        city: null,
        phone: null,
        email: null,
      },
    };
  },
  watch: {
    dialog(val) {
      if (val) {
        this.changeSelectedCarrier();
        this.fetchCityList();
      }
    },
    searchCity(val) {
      val && val !== this.addressForm.city?.name && this.fetchCityList();
    },
  },
  mounted() {
    this.changeSelectedCarrier();
    // this.getPaperFormats();
    // this.getLabelTypes();
    this.fetchLabelLogic();
    this.fetchCityList();
    this.getTransitPartners({
      params: {
        pagination: 0,
        fields: "id,name",
        service_type: "transit",
      },
    });
  },
  methods: {
    ...mapActions([
      "snackBar",
      // "getPaperFormats",
      // "getLabelTypes",
      "getCities",
      "getTransitPartners",
    ]),
    fetchLabelLogic() {
      if (!this.$route.params.id || !this.selectedCarrier) return;
      const settings = this.node?.carrier_settings[0];
      // this.selectedLblTypes =
      //   settings?.label_logic?.map((i) => {
      //     return {
      //       id: i.label_type_id,
      //       qty: i.quantity,
      //       format: i.paper_format_id,
      //     };
      //   }) || [];
      this.addressForm = settings?.address || {};
      this.addressForm.city = {
        id: settings?.address?.city_id,
        name: settings?.address?.city_name,
      };
    },
    setSelectedCarrier(c) {
      this.selectedCarrier = c;
      this.fetchLabelLogic();
    },
    resetSelectedCarrier() {
      this.selectedCarrier = null;
      this.selectedLblTypes = [];
    },
    changeSelectedCarrier() {
      if (["origin_agent", "transit_partner"].includes(this.node.type)) {
        this.selectedCarrier = Object.assign(this.node.data, {
          id: this.node.id,
        });
      } else {
        this.selectedCarrier = null;
      }
      this.fetchLabelLogic();
    },
    // increaseQty(item) {
    //   item.qty++;
    // },
    // decreseQty(item) {
    //   item.qty--;
    // },
    // isAllocated(lType) {
    //   let labelOccupied = false;
    //   if (
    //     this.destination.code === this.node.countryCode &&
    //     (lType.code === "firstmile_partner" ||
    //       lType.code === "firstmile_hybrid")
    //   ) {
    //     labelOccupied = true;
    //   }
    //   if (this.nodes.length) {
    //     this.nodes.forEach((node) => {
    //       node.carrier_settings?.forEach((cs) => {
    //         if (
    //           cs.label_logic?.findIndex(
    //             (lt) => lt.label_type_id === lType.id
    //           ) !== -1 &&
    //           this.node.id !== node.id &&
    //           lType.code === "rsa"
    //         ) {
    //           labelOccupied = true;
    //         }
    //       });
    //     });
    //   }
    //   return labelOccupied;
    // },
    // validateSelection(lType) {
    //   let isDisable = false;
    //   if (
    //     lType.code === "firstmile_partner" &&
    //     this.allLabelTypes.findIndex(
    //       (l) => l.code === "firstmile_hybrid" && l.selected
    //     ) !== -1
    //   ) {
    //     isDisable = true;
    //   }
    //   if (
    //     lType.code === "firstmile_hybrid" &&
    //     this.allLabelTypes.findIndex(
    //       (l) => l.code === "firstmile_partner" && l.selected
    //     ) !== -1
    //   ) {
    //     isDisable = true;
    //   }
    //   if (
    //     lType.code === "lastmile_partner" &&
    //     this.allLabelTypes.findIndex(
    //       (l) => l.code === "lastmile_hybrid" && l.selected
    //     ) !== -1
    //   ) {
    //     isDisable = true;
    //   }
    //   if (
    //     lType.code === "lastmile_hybrid" &&
    //     this.allLabelTypes.findIndex(
    //       (l) => l.code === "lastmile_partner" && l.selected
    //     ) !== -1
    //   ) {
    //     isDisable = true;
    //   }
    //   return isDisable;
    // },
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
          const settings = this.node?.carrier_settings?.find(
            (cs) => cs.entity_id === this.selectedCarrier?.id
          );
          if (
            settings?.address?.city_id &&
            this.cities.findIndex((c) => c.id === settings.address.city_id) ===
              -1
          ) {
            this.cities.unshift({
              id: settings.address.city_id,
              name: settings.address.city_name,
            });
          }
        })
        .catch(() => {
          this.cityLoader = false;
        });
    },
  },
};
</script>
<style scoped>
.carrier-logo {
  max-width: 100%;
  max-height: 20px;
}
.lbl-td {
  display: inline-flex;
  align-items: center;
  height: auto !important;
  padding: 10px !important;
}
.lbl-img {
  width: 50px !important;
  margin-right: 5px;
}
</style>
