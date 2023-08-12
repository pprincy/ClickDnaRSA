<template>
  <v-col class="pa-0">
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="12">
          <v-progress-linear
            :active="loader"
            :indeterminate="loader"
            color="primary"
          ></v-progress-linear>
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-card>
            <v-row>
              <v-col cols="12">
                <p class="body-1 font-weight-bold">
                  Company Details
                  <i class="caption red--text ml-4"> * required field</i>
                </p>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="formData.name"
                  label="Name"
                  :rules="[(v) => (v && !!v.trim()) || 'Name is required']"
                  class="required"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-file-input
                  v-model="fileInput"
                  accept="image/png, image/jpeg"
                  placeholder="Pick a logo"
                  label="Logo"
                  class="required"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-autocomplete
                  label="Country"
                  :items="allCountries"
                  v-model="formData.country_code"
                  :rules="[(v) => !!v || 'Country is required']"
                  class="required"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="formData.website"
                  type="url"
                  label="Website"
                  placeholder="https://"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-select
                  v-model="formData.service_mode"
                  label="Environment"
                  :items="allServiceModes"
                  :rules="[(v) => !!v || 'Service code is required']"
                  class="required"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-select
                  v-model="formData.service_type"
                  label="Service Types"
                  :items="allServiceTypes"
                  :rules="[(v) => !!v || 'Service type is required']"
                  class="required"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-select
                  v-model="formData.tracking_service_mode"
                  label="Tracking Service Mode"
                  :items="allTrackingServiceModes"
                  :rules="[(v) => !!v || 'Tracking service mode is required']"
                  class="required"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-switch
                  v-model="formData.active"
                  :label="formData.active ? 'Active' : 'Inactive'"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" sm="6" class="pt-0">
          <v-expansion-panels :value="[0, 1, 2]" multiple>
            <v-expansion-panel>
              <v-expansion-panel-header class="body-1 font-weight-bold"
                >IT Contact</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      label="Name"
                      v-model="formData.contact_name"
                      :rules="[(v) => (v && !!v.trim()) || 'Name is required']"
                      class="required"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      label="Mobile"
                      type="tel"
                      v-model="formData.phone_number"
                      :rules="[
                        (v) => (v && !!v.trim()) || 'Mobile number is required',
                      ]"
                      class="required"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      label="Email"
                      type="email"
                      v-model="formData.contact_email"
                      :rules="[
                        (v) => (v && !!v.trim()) || 'Email address is required',
                        (v) =>
                          /.+@.+\..+/.test(v) || 'E-mail address must be valid',
                      ]"
                      class="required"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      label="LandLine"
                      v-model="formData.alternate_phone"
                      type="tel"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-form>
    <v-btn
      class="float-right ma-6"
      color="primary"
      :loading="loader"
      @click="save()"
    >
      Save & Continue <v-icon dark right> mdi-arrow-right </v-icon>
    </v-btn>
  </v-col>
</template>
<script>
import {
  countries,
  serviceTypes,
  serviceModes,
  trackingServiceModes,
} from "@/config/data";
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
    allServiceTypes() {
      return Object.keys(serviceTypes).map((i) => {
        return {
          text: serviceTypes[i],
          value: i,
        };
      });
    },
    allServiceModes() {
      return Object.keys(serviceModes).map((i) => {
        return {
          text: serviceModes[i],
          value: i,
        };
      });
    },
    allTrackingServiceModes() {
      return Object.keys(trackingServiceModes).map((i) => {
        return {
          text: trackingServiceModes[i],
          value: i,
        };
      });
    },
  },
  data() {
    return {
      panel: 0,
      formData: {
        name: null,
        logo: null,
        website: null,
        service_mode: "sandbox",
        service_type: "lastmile",
        tracking_service_mode: "webhook",
      },
      fileInput: null,
      loader: false,
    };
  },

  created() {
    this.fetchCarrierDetails();
  },

  methods: {
    ...mapActions(["snackBar", "getCarrierDetails", "updateCarrierDetails"]),

    fetchCarrierDetails() {
      this.loader = true;
      this.getCarrierDetails(this.$route.params.id)
        .then((res) => {
          this.loader = false;
          this.formData = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },

    collectFormData() {
      const payload = new FormData();
      for (const field in this.formData) {
        if (field === "logo") continue;
        payload.append(
          field,
          this.formData[field] === null ? "" : this.formData[field]
        );
      }
      if (this.fileInput) {
        payload.append("logo", this.fileInput);
        this.formData.logo = URL.createObjectURL(this.fileInput);
      }
      return payload;
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loader = true;
      this.updateCarrierDetails({
        id: this.$route.params.id,
        data: this.collectFormData(),
      })
        .then((res) => {
          this.loader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.$emit("continue");
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
