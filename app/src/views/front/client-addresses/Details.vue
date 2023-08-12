<!-- #24 -->
<template>
  <v-col class="ma-4">
    <v-toolbar flat>
      <p class="text-h6">Client Address</p>
      <v-spacer></v-spacer>
      <v-btn class="primary" :loading="saveLoader" @click="save()">Save</v-btn>
    </v-toolbar>
    <p>
      Please create or update your physical address that you wish RSA to collect
      the considation from.
    </p>
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" md="3">
          <v-card :loading="pageLoader">
            <v-toolbar color="primary" dense dark flat>
              <v-toolbar-title>General Details</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-text-field
                label="Contact Person or Dept."
                v-model="addressDetails.contact_person_dept"
                hide-details
              ></v-text-field>
              <v-text-field
                label="Company Name"
                v-model="addressDetails.company_name"
                hide-details
              ></v-text-field>
              <v-text-field
                label="Area Name"
                v-model="addressDetails.area_name"
                hide-details
              ></v-text-field>
              <v-text-field
                label="Landmark"
                v-model="addressDetails.landmark"
                hide-details
              ></v-text-field>
              <v-text-field
                label="Address Line 1"
                v-model="addressDetails.street_address"
                hide-details
              ></v-text-field>
              <v-text-field
                label="Address Line 2"
                v-model="addressDetails.address_area"
                hide-details
              ></v-text-field>
              <v-text-field
                label="City"
                v-model="addressDetails.city_name"
                hide-details
              ></v-text-field>
              <v-text-field
                label="Postal Code"
                v-model="addressDetails.zip_code"
                hide-details
              ></v-text-field>
              <v-text-field
                label="Telephone Number 1"
                v-model="addressDetails.phone_number"
                hide-details
              ></v-text-field>
              <v-text-field
                label="Telephone Number 2"
                v-model="addressDetails.alternate_phone"
                hide-details
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card :loading="pageLoader" class="fill-height" flat>
            <v-toolbar flat dense floating>
              <gmap-autocomplete @place_changed="initMarker">
                <template v-slot:input="slotProps">
                  <v-text-field
                    placeholder="Search Location"
                    ref="input"
                    v-on:listeners="slotProps.listeners"
                    v-on:attrs="slotProps.attrs"
                    hide-details
                    prepend-icon="mdi-magnify"
                    single-line
                  >
                  </v-text-field>
                </template>
              </gmap-autocomplete>
              <v-list>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo"> mdi-map-marker </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Building Marker</v-list-item-title>
                    <v-list-item-subtitle
                      >Drag and drop on map</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-toolbar>
            <v-card-text>
              <gmap-map
                :zoom="7"
                :center="center"
                style="width: 100%; height: 100%"
              >
                <gmap-marker
                  v-for="(m, index) in locationMarkers"
                  :key="index"
                  :position="m.position"
                  :clickable="true"
                  :draggable="true"
                  @click="center = m.position"
                ></gmap-marker>
              </gmap-map>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card>
            <v-toolbar color="primary" dense dark flat>
              <v-toolbar-title>Business Details</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-text-field
                label="Address Nick Name"
                v-model="addressDetails.address_nick_name"
                hide-details
              ></v-text-field>
              <v-autocomplete
                label="Country"
                :items="allCountries"
                v-model="addressDetails.country_code"
              ></v-autocomplete>
              <v-text-field
                v-model="addressDetails.start_time"
                :rules="[
                  (v) =>
                    /^([01]\d|2[0-3]):([0-5]\d)$/.test(v) ||
                    'Time format must be valid',
                ]"
                placeholder="HH:MM"
                label="Opening From Time"
                append-icon="mdi-clock-time-four-outline"
                @input="timeInput(addressDetails, 'start_time')"
              ></v-text-field>
              <v-text-field
                v-model="addressDetails.end_time"
                :rules="[
                  (v) =>
                    /^([01]\d|2[0-3]):([0-5]\d)$/.test(v) ||
                    'Time format must be valid',
                ]"
                placeholder="HH:MM"
                label="Opening To Time"
                append-icon="mdi-clock-time-four-outline"
                @input="timeInput(addressDetails, 'end_time')"
              ></v-text-field>
              <v-text-field
                label="Building Identity"
                v-model="addressDetails.building_name"
                hide-details
              ></v-text-field>
              <v-text-field
                label="VAT Number"
                v-model="addressDetails.vat_number"
                hide-details
              ></v-text-field>
              <v-text-field
                label="Email Address"
                :rules="[
                  (v) => (v && !!v.trim()) || 'E-mail is required',
                  (v) => /.+@.+/.test(v) || 'E-mail must be valid',
                ]"
                class="required"
                v-model="addressDetails.email"
                hide-details
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>
<script>
import { countries } from "@/config/data";
import { mapActions } from "vuex";
export default {
  computed: {
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
      center: {
        lat: 10.0,
        lng: 10.0,
      },
      locationMarkers: [
        {
          position: {
            lat: 10.0,
            lng: 10.0,
          },
        },
      ],
      locPlaces: [],
      existingPlace: null,
      addressDetails: {
        start_time: null,
        end_time: null,
      },
      pageLoader: false,
      saveLoader: false,
    };
  },
  mounted() {
    this.locateGeoLocation();
    if (+this.$route.params.id) {
      this.fetchAddressDetails();
    }
  },
  methods: {
    ...mapActions([
      "getClientAddress",
      "createClientAddress",
      "updateClientAddress",
      "snackBar",
    ]),
    fetchAddressDetails() {
      this.pageLoader = true;
      this.getClientAddress(this.$route.params.id)
        .then((res) => {
          this.pageLoader = false;
          this.addressDetails = res.data;
        })
        .catch(() => {
          this.pageLoader = false;
        });
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      if (+this.$route.params.id) {
        this.updateClientAddress({
          id: this.$route.params.id,
          data: this.addressDetails,
        })
          .then((res) => {
            this.saveLoader = false;
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
          })
          .catch(() => {
            this.saveLoader = false;
          });
      } else {
        this.createClientAddress(this.addressDetails)
          .then((res) => {
            this.saveLoader = false;
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
            this.$router.replace({
              name: "ClientAddresses",
            });
          })
          .catch(() => {
            this.saveLoader = false;
          });
      }
    },
    initMarker(loc) {
      this.existingPlace = loc;
    },
    addLocationMarker() {
      if (this.existingPlace) {
        const marker = {
          lat: this.existingPlace.geometry.location.lat(),
          lng: this.existingPlace.geometry.location.lng(),
        };
        this.locationMarkers.push({ position: marker });
        this.locPlaces.push(this.existingPlace);
        this.center = marker;
        this.existingPlace = null;
      }
    },
    locateGeoLocation: function () {
      navigator.geolocation.getCurrentPosition((res) => {
        this.center = {
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        };
      });
    },
  },
};
</script>
