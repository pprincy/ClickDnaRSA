<!-- #42 -->
<template>
  <v-col class="mx-4">
    <v-progress-linear
      :active="saveLoader"
      :indeterminate="saveLoader"
    ></v-progress-linear>
    <v-form ref="form" lazy-validation>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="pb-0 d-flex justify-space-between">
              <div>
                <span class="text-h6">Apply Scan</span>
                <p>
                  Upload a list of tracking number. Once complete you can apply
                  one or more scans to the package group. Due to your login
                  role, Only certain scan are allow primarily for the
                  destination.
                </p>
              </div>
              <v-btn
                color="primary"
                dark
                class="mb-2 float-right"
                :loading="saveLoader"
                @click="applyScan()"
              >
                Apply Scan
              </v-btn>
            </v-col>
            <v-col cols="12" md="4" sm="6" class="align-self-center">
              <div class="text-center py-0">
                <v-file-input
                  v-model="trackFile"
                  accept=".xlsx"
                  label="Upload Tracking Numbers"
                  :rules="[
                    (v) => !!v || 'Please choose the file',
                    (v) =>
                      !v ||
                      v.size < 2097152 ||
                      `File size should be less than 2 MB!`,
                    (v) =>
                      !v ||
                      [
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      ].includes(v.type) ||
                      `Excel file is required`,
                  ]"
                  class="w-90 required"
                  clearable
                  single-line
                >
                </v-file-input>
                <v-btn
                  color="info"
                  target="_blank"
                  href="/Tracking-Numbers.xlsx"
                  class="mt-2"
                  >Download upload template</v-btn
                >
              </div>
            </v-col>
            <!-- <v-col cols="12" md="4" sm="6">
              <v-select
                label="Scan Category"
                :items="['Transit', 'Destination']"
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                label="Scan Sub Category"
                :items="[
                  'Regulatory',
                  'Customs',
                  'Last Mile Carrier',
                  'Broker',
                ]"
              >
              </v-select>
            </v-col> -->
            <v-col cols="12" md="4" sm="6">
              <v-autocomplete
                label="Scan Code or Name"
                :rules="[(v) => !!v || 'Scan Code or Name is required']"
                v-model="formData.scan_type"
                :items="scans"
                item-text="name"
                item-value="id"
                placeholder="Start typing to Search"
                class="required"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4" sm="6" class="px-0">
              <div class="d-flex">
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="getFormattedDate(formData.scan_date)"
                      label="Scan Date"
                      :rules="[
                        (v) => (v && !!v.trim()) || 'Scan date is required',
                      ]"
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      class="ml-4 required"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="formData.scan_date"
                    @input="dateMenu = false"
                    :min="new Date().toISOString()"
                  ></v-date-picker>
                </v-menu>
                <v-text-field
                  v-model="formData.scan_time"
                  :rules="[
                    (v) =>
                      /^([01]\d|2[0-3]):([0-5]\d)$/.test(v) ||
                      'Time format must be valid',
                  ]"
                  placeholder="HH:MM"
                  label="Scan Time"
                  append-icon="mdi-clock-time-four-outline"
                  @input="timeInput(formData, 'scan_time')"
                  class="ml-4 required"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="scans"
                class="elevation-1"
                hide-default-footer
                disable-pagination
              >
                <template v-slot:top>
                  <p class="body-1 font-weight-bold pt-4 pl-4">
                    Scan Code Details
                  </p>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      saveLoader: false,
      dateMenu: false,
      trackFile: null,
      trackNos: [],
      formData: {
        scan_type: null,
        scan_date: "",
        scan_time: "",
      },
      headers: [
        {
          text: "Scan Code",
          value: "name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Description",
          value: "description",
          class: "body-1 font-weight-bold",
        },
      ],
      scans: [],
    };
  },
  created() {
    this.fetchEntityScans();
  },
  methods: {
    ...mapActions(["getEntityScans", "saveApplyScan", "snackBar"]),
    fetchEntityScans() {
      this.getEntityScans({
        fields: "id,name",
        pagination: 0,
      }).then((res) => {
        this.scans = res.data;
      });
    },
    applyScan() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const payload = new FormData();
      for (const field in this.formData) {
        payload.append(
          field,
          this.formData[field] === null ? "" : this.formData[field]
        );
      }
      if (this.trackFile) payload.append("data_file", this.trackFile || "");
      this.saveLoader = true;
      this.saveApplyScan(payload)
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
    },
  },
};
</script>
