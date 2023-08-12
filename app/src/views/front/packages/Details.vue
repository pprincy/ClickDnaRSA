<!-- #33 -->
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
        <v-btn icon :to="{ name: 'PackagesList' }" class="mt-n1" text>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="text-h6 ml-2">Edit A Package</span>
        <v-btn class="primary float-right" @click="save" :loading="pageLoader"
          >Save</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card :loading="pageLoader">
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title>Consignor</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" sm="12">
                <strong class="body-1 font-weight-black"
                  >Contact Person Information</strong
                >
                <v-sheet elevation="2" class="mb-4">
                  <v-card-text>
                    <v-text-field
                      label="Individual Name"
                      v-model="packageDetails.consignor.name"
                    ></v-text-field>
                    <v-text-field
                      label="Primary Phone Number"
                      v-model="packageDetails.consignor.phone_number"
                    ></v-text-field>
                    <v-text-field
                      label="Secondary Phone Number"
                      v-model="packageDetails.consignor.alternate_phone"
                    ></v-text-field>
                    <v-text-field
                      label="Email"
                      v-model="packageDetails.consignor.email"
                    ></v-text-field>
                    <v-text-field
                      label="VAT Number"
                      v-model="packageDetails.consignor.vat_number"
                    ></v-text-field>
                  </v-card-text>
                </v-sheet>
                <strong class="body-1 font-weight-black"
                  >Address Information</strong
                >
                <v-sheet elevation="2">
                  <v-card-text>
                    <v-text-field
                      label="Street Name"
                      v-model="packageDetails.consignor.street_address"
                    ></v-text-field>
                    <v-text-field
                      label="Address Line 1"
                      v-model="packageDetails.consignor.address_line1"
                    ></v-text-field>
                    <v-text-field
                      label="Address Line 2"
                      v-model="packageDetails.consignor.address_line2"
                    ></v-text-field>
                  </v-card-text>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="6" sm="12">
                <strong class="body-1 font-weight-black"
                  >Building Information</strong
                >
                <v-sheet elevation="2" class="mb-4">
                  <v-card-text>
                    <v-text-field
                      label="Building Identity"
                      v-model="packageDetails.consignor.building_name"
                    ></v-text-field>
                    <v-text-field
                      label="Address Area"
                      v-model="packageDetails.consignor.address_area"
                    ></v-text-field>
                  </v-card-text>
                </v-sheet>
                <strong class="body-1 font-weight-black"
                  >Geographic Location</strong
                >
                <v-sheet elevation="2">
                  <v-card-text>
                    <v-autocomplete
                      label="Country Assigned"
                      :items="allCountries"
                      v-model="packageDetails.consignor.country_code"
                    ></v-autocomplete>
                    <v-text-field
                      label="Zip Code"
                      v-model="packageDetails.consignor.zip_code"
                    ></v-text-field>
                    <v-text-field
                      label="City Name"
                      v-model="packageDetails.consignor.city_name"
                    ></v-text-field>
                    <v-text-field
                      label="Geo Coordinate North Decimal"
                      v-model="packageDetails.consignor.latitude"
                    ></v-text-field>
                    <v-text-field
                      label="Geo Coordinate East Decimal"
                      v-model="packageDetails.consignor.longitude"
                    ></v-text-field>
                    <div class="text-center">
                      <v-icon>mdi-map-marker</v-icon>
                      <a
                        @click="
                          viewMap(
                            packageDetails.consignor.latitude,
                            packageDetails.consignor.longitude
                          )
                        "
                        >Show On Map</a
                      >
                    </div>
                  </v-card-text>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card :loading="pageLoader">
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title>Consignee</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" sm="12">
                <strong class="body-1 font-weight-black"
                  >Contact Person Information</strong
                >
                <v-sheet elevation="2" class="mb-4">
                  <v-card-text>
                    <v-text-field
                      label="Individual Name"
                      v-model="packageDetails.consignee.name"
                    ></v-text-field>
                    <v-text-field
                      label="Primary Phone Number"
                      v-model="packageDetails.consignee.phone_number"
                    ></v-text-field>
                    <v-text-field
                      label="Secondary Phone Number"
                      v-model="packageDetails.consignee.alternate_phone"
                    ></v-text-field>
                    <v-text-field
                      label="Email"
                      v-model="packageDetails.consignee.email"
                    ></v-text-field>
                    <v-text-field
                      label="VAT Number"
                      v-model="packageDetails.consignee.vat_number"
                    ></v-text-field>
                  </v-card-text>
                </v-sheet>
                <strong class="body-1 font-weight-black"
                  >Address Information</strong
                >
                <v-sheet elevation="2">
                  <v-card-text>
                    <v-text-field
                      label="Street Name"
                      v-model="packageDetails.consignee.street_address"
                    ></v-text-field>
                    <v-text-field
                      label="Address Line 1"
                      v-model="packageDetails.consignee.address_line1"
                    ></v-text-field>
                    <v-text-field
                      label="Address Line 2"
                      v-model="packageDetails.consignee.address_line2"
                    ></v-text-field>
                  </v-card-text>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="6" sm="12">
                <strong class="body-1 font-weight-black"
                  >Building Information</strong
                >
                <v-sheet elevation="2" class="mb-4">
                  <v-card-text>
                    <v-text-field
                      label="Building Identity"
                      v-model="packageDetails.consignee.building_name"
                    ></v-text-field>
                    <v-text-field
                      label="Address Area"
                      v-model="packageDetails.consignee.address_area"
                    ></v-text-field>
                  </v-card-text>
                </v-sheet>
                <strong class="body-1 font-weight-black"
                  >Geographic Location</strong
                >
                <v-sheet elevation="2">
                  <v-card-text>
                    <v-autocomplete
                      label="Country Assigned"
                      :items="allCountries"
                      v-model="packageDetails.consignee.country_code"
                    ></v-autocomplete>
                    <v-text-field
                      label="Zip Code"
                      v-model="packageDetails.consignee.zip_code"
                    ></v-text-field>
                    <v-text-field
                      label="City Name"
                      v-model="packageDetails.consignee.city_name"
                    ></v-text-field>
                    <v-text-field
                      label="Geo Coordinate North Decimal"
                      v-model="packageDetails.consignee.latitude"
                    ></v-text-field>
                    <v-text-field
                      label="Geo Coordinate East Decimal"
                      v-model="packageDetails.consignee.longitude"
                    ></v-text-field>
                    <div class="text-center">
                      <v-icon>mdi-map-marker</v-icon>
                      <a
                        @click="
                          viewMap(
                            packageDetails.consignee.latitude,
                            packageDetails.consignee.longitude
                          )
                        "
                        >Show On Map</a
                      >
                    </div>
                  </v-card-text>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card :loading="pageLoader">
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title>Packaging</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col class="pb-0" cols="12" md="6" sm="12">
                <v-text-field
                  v-model="searchPackage"
                  prepend-inner-icon="mdi-magnify"
                  append-icon="mdi-plus"
                  label="Search..."
                  @click:append="addPackage()"
                  hide-details
                ></v-text-field>
                <v-list
                  class="elevation-2 body-1 font-weight-bold overflow-y-auto"
                  height="210px"
                  dense
                >
                  <v-list-item-group
                    v-model.number="selectedPIndex"
                    color="primary"
                    mandatory
                  >
                    <template v-for="(item, i) in packageDetails.packages">
                      <div
                        v-if="
                          selectedPIndex === i ||
                          (item.package_name &&
                            item.package_name
                              .toLowerCase()
                              .includes(searchPackage.toLowerCase()))
                        "
                        :key="'p' + i"
                      >
                        <v-list-item :key="i" :value="i">
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.package_name"
                            ></v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-icon
                            v-if="packageDetails.packages.length > 1"
                            @click="removePackaging(i)"
                          >
                            <v-icon color="error">mdi-close</v-icon>
                          </v-list-item-icon>
                        </v-list-item>
                        <v-divider></v-divider>
                      </div>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-col class="pb-0" cols="12" md="6" sm="12">
                <v-text-field
                  label="Name"
                  v-model="packageDetails.packages[selectedPIndex].package_name"
                >
                  <template v-slot:prepend>
                    <v-chip color="primary"> {{ selectedPIndex + 1 }} </v-chip>
                  </template>
                </v-text-field>
                <v-autocomplete
                  label="Package Type"
                  :items="packageTypes"
                  v-model="packageDetails.packages[selectedPIndex].package_type"
                  item-key="id"
                  item-value="id"
                  item-text="name"
                ></v-autocomplete>
                <v-text-field
                  label="Customer Barcode String"
                  v-model="
                    packageDetails.packages[selectedPIndex].overlabel_barcode
                  "
                ></v-text-field>
                <v-autocomplete
                  label="Special Handling"
                  :items="handlingCodeList"
                  v-model="
                    packageDetails.packages[selectedPIndex].handling_codes
                  "
                  item-key="id"
                  item-value="id"
                  item-text="name"
                  multiple
                ></v-autocomplete>
              </v-col>
              <v-col cols="12 pt-0 d-flex align-center justify-space-between">
                <v-text-field
                  label="Height"
                  suffix="cm"
                  v-model.number="
                    packageDetails.packages[selectedPIndex].height
                  "
                ></v-text-field>
                <v-icon class="mx-8">mdi-close</v-icon>
                <v-text-field
                  label="Width"
                  suffix="cm"
                  v-model.number="packageDetails.packages[selectedPIndex].width"
                ></v-text-field>
                <v-icon class="mx-8">mdi-close</v-icon>
                <v-text-field
                  label="Length"
                  suffix="cm"
                  v-model.number="
                    packageDetails.packages[selectedPIndex].length
                  "
                ></v-text-field>
                <span class="mx-12">&nbsp;</span>
                <v-text-field
                  label="Weight"
                  suffix="kgs"
                  v-model.number="
                    packageDetails.packages[selectedPIndex].weight
                  "
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card :loading="pageLoader">
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title>Commodity Inside Package</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col class="pb-0" cols="12" md="6" sm="12">
                <v-text-field
                  v-model="searchCommodity"
                  prepend-inner-icon="mdi-magnify"
                  append-icon="mdi-plus"
                  label="Search..."
                  @click:append="addCommodity()"
                  hide-details
                ></v-text-field>
                <v-list
                  class="elevation-2 body-1 font-weight-bold overflow-y-auto"
                  height="210px"
                  dense
                >
                  <v-list-item-group
                    v-model="selectedCIndex"
                    mandatory
                    color="primary"
                  >
                    <template v-for="(item, i) in packageDetails.commodities">
                      <div
                        v-if="
                          selectedCIndex === i ||
                          (item.description &&
                            item.description
                              .toLowerCase()
                              .includes(searchCommodity.toLowerCase()))
                        "
                        :key="'c' + i"
                      >
                        <v-list-item :key="i" :value="i">
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.description"
                            ></v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-icon
                            v-if="packageDetails.commodities.length > 1"
                            @click="removeCommodity(i)"
                          >
                            <v-icon color="error">mdi-close</v-icon>
                          </v-list-item-icon>
                        </v-list-item>
                        <v-divider></v-divider>
                      </div>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-col class="pb-0" cols="12" md="6" sm="12">
                <v-text-field
                  label="Description"
                  v-model="
                    packageDetails.commodities[selectedCIndex].description
                  "
                >
                  <template v-slot:prepend>
                    <v-chip color="primary"> {{ selectedCIndex + 1 }} </v-chip>
                  </template>
                </v-text-field>
                <v-text-field
                  label="SKU Number"
                  v-model="packageDetails.commodities[selectedCIndex].sku"
                ></v-text-field>
                <v-text-field
                  label="HS Code"
                  v-model="packageDetails.commodities[selectedCIndex].hs_code"
                ></v-text-field>
                <v-autocomplete
                  label="Country of Origin"
                  :items="allCountries"
                  v-model="
                    packageDetails.commodities[selectedCIndex]
                      .country_of_origin_code
                  "
                ></v-autocomplete>
              </v-col>
              <v-col cols="12 pt-0 d-flex align-center justify-space-between">
                <v-text-field
                  label="Item Value"
                  v-model.number="
                    packageDetails.commodities[selectedCIndex].value_per_unit
                  "
                ></v-text-field>
                <span class="mx-2">&nbsp;</span>
                <v-autocomplete
                  label="Currency"
                  :items="currencyList"
                  v-model="
                    packageDetails.commodities[selectedCIndex].currency_code
                  "
                  item-key="id"
                  item-value="name"
                  item-text="name"
                ></v-autocomplete>
                <span class="mx-2">&nbsp;</span>
                <v-text-field
                  label="Item Weight"
                  suffix="kgs"
                  v-model.number="
                    packageDetails.commodities[selectedCIndex].weight
                  "
                ></v-text-field>
                <span class="mx-2">&nbsp;</span>
                <v-text-field
                  type="number"
                  class="centered-input"
                  label="Quantity"
                  min="1"
                  v-model.number="
                    packageDetails.commodities[selectedCIndex].quantity
                  "
                >
                  <v-icon
                    slot="prepend-inner"
                    color="green"
                    @click="
                      decreseQty(packageDetails.commodities[selectedCIndex])
                    "
                  >
                    mdi-minus
                  </v-icon>
                  <v-icon
                    slot="append"
                    color="red"
                    @click="
                      increaseQty(packageDetails.commodities[selectedCIndex])
                    "
                  >
                    mdi-plus
                  </v-icon>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { countries } from "@/config/data";
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["currencyList", "handlingCodeList", "packageTypes"]),
    allCountries() {
      return Object.keys(countries).map((i) => {
        return {
          text: countries[i],
          value: i,
        };
      });
    },
  },
  data() {
    return {
      selectedPIndex: 0,
      selectedCIndex: 0,
      searchPackage: "",
      searchCommodity: "",
      pageLoader: false,
      packageDetails: {
        consignor: {},
        consignee: {},
        commodities: [{}],
        packages: [{}],
      },
    };
  },
  created() {
    this.getCurrencyList();
    this.getHandlingCodeList();
    this.getHSCodeList();
    this.getPackageTypes();
    if (+this.$route.params.id) {
      this.pageLoader = true;
      this.getPackageDetails(this.$route.params.id)
        .then((res) => {
          this.pageLoader = false;
          this.packageDetails = res.data;
        })
        .catch(() => {
          this.pageLoader = false;
        });
    }
  },
  methods: {
    ...mapActions([
      "getCurrencyList",
      "getHandlingCodeList",
      "getHSCodeList",
      "getPackageDetails",
      "getPackageTypes",
      "updatePackageDetails",
      "snackBar",
    ]),
    addPackage() {
      this.packageDetails.packages.push({
        package_name: "New" + this.packageDetails.packages.length,
        measure: "CM",
        weight_measure: "KG",
      });
    },
    addCommodity() {
      this.packageDetails.commodities.push({
        description: "New" + this.packageDetails.commodities.length,
        quantity: 1,
        unit_of_measure: "KG",
      });
    },
    increaseQty(item) {
      item.quantity++;
    },
    decreseQty(item) {
      item.quantity--;
    },
    removePackaging(i) {
      this.selectedPIndex = 0;
      this.packageDetails.packages.splice(i, 1);
    },
    removeCommodity(i) {
      this.selectedCIndex = 0;
      this.packageDetails.commodities.splice(i, 1);
    },
    save() {
      this.pageLoader = true;
      this.updatePackageDetails({
        id: this.$route.params.id,
        data: this.packageDetails,
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
    viewMap(lat, lng) {
      window.open(
        `http://maps.google.com/maps?z=12&t=m&q=loc:${lat}+${lng}`,
        "_blank"
      );
    },
  },
};
</script>
