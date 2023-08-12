<!-- #11 -->
<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="manifests"
      :search="search"
      :options.sync="options"
      :server-items-length="total"
      :loading="manifestsLoader"
    >
      <template v-slot:top>
        <v-row class="pb-6">
          <v-col cols="12" md="6" sm="12" xs="12" class="py-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
            xs="12"
            class="d-flex flex-column align-center justify-center"
          >
            <p class="border-bottom px-4 pb-2 mb-4">
              Upload manifest with the help of explain template
            </p>
            <div class="d-flex">
              <v-btn
                color="primary"
                class="mr-2"
                small
                target="_blank"
                href="/Plant Masters.xlsx"
                >Download template</v-btn
              >
              <v-dialog
                v-model="dialog"
                max-width="550px"
                @keydown.esc="dialog = false"
                persistent
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    :loading="fileLoader"
                    small
                    v-bind="attrs"
                    v-on="on"
                    >Upload manifest</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Upload manifest</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="6">
                        <v-radio-group row>
                          <v-radio
                            v-for="n in ['Bag', 'Parcel']"
                            :key="n"
                            :label="n"
                            :value="n"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="6">
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
                              :value="getFormattedDate(date)"
                              placeholder="ddd DD MMM, YYYY"
                              v-model="date"
                              label="Pickup Ready Date"
                              :rules="[
                                (v) => !!v || 'Pickup ready date is required',
                              ]"
                              append-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date"
                            @input="dateMenu = false"
                            :min="new Date().toISOString()"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col>
                        <v-file-input
                          v-model="file"
                          counter
                          show-size
                          accept=".xlsx"
                          label="Click here to upload manifest"
                        >
                        </v-file-input>
                        <v-btn
                          color="primary"
                          dark
                          class="mt-3"
                          :loading="fileLoader"
                          @click="upload"
                        >
                          Upload
                        </v-btn>
                        <v-btn
                          color="info"
                          class="mt-3 ml-3"
                          target="_blank"
                          href="/BOA Bulk order placement.xlsx"
                          >Download template</v-btn
                        >
                        <v-btn
                          color="info"
                          class="mt-3 ml-3"
                          :to="{
                            name: 'ManifestsTemplate',
                          }"
                          ><v-icon>mdi-information</v-icon></v-btn
                        >
                        <v-btn class="mt-3 ml-3" @click="dialog = false">
                          Cancel
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </template>
      <template v-slot:item.actions="{}">
        <v-icon class="mr-2" small> mdi-download </v-icon>
        <v-icon small> mdi-pencil </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import XLSX from "xlsx";
import { mapActions, mapGetters } from "vuex";
import Search from "@/components/front/common/Search";
export default {
  components: {
    Search,
  },
  data() {
    return {
      manifests: [
        {
          name: "DHL",
        },
      ],
      headers: [
        {
          text: "Manifest Number",
          value: "manifest_number",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Origin",
          value: "origin",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Destination",
          value: "destination",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Wgt",
          value: "wgt",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Qty",
          value: "qty",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Value (USD)",
          value: "value",
          class: "body-1 font-weight-bold",
        },
        {
          text: "HS Code",
          value: "hscode",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Status",
          value: "status",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Actions",
          value: "actions",
          class: "body-1 font-weight-bold",
          width: "170px",
        },
      ],
      searchOptions: [
        {
          text: "Manifest #",
          value: "manifest_num",
        },
        {
          text: "O.Country",
          value: "origin",
        },
        {
          text: "D.country",
          value: "destination",
        },
      ],
      total: 1,
      manifestsLoader: false,
      search: null,
      options: {},
      searchType: null,
      editedIndex: -1,
      editedItem: {},
      defaultItem: null,
      file: null,
      fileLoader: false,
      dialog: false,
      date: null,
      dateMenu: false,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    options: {
      handler() {
        this.fetchManifest();
      },
      deep: true,
    },
    search() {
      this.fetchManifest();
    },
    searchType() {
      if (this.search) this.fetchManifest();
    },
  },
  computed: {
    ...mapGetters(["optionsOfDM"]),
    formTitle() {
      return this.editedIndex === -1 ? "New Plant" : "Edit Plant";
    },
  },
  created() {
    this.defaultItem = this.editItem;
  },
  methods: {
    ...mapActions(["getAllManifests", "snackBar"]),
    displayOption(item, key) {
      if (this.optionsOfDM) {
        return this.optionsOfDM[key]?.find((i) => i.id === item[key])?.text;
      }
    },
    fetchManifest() {
      // this.manifests = [];
      //   this.manifestsLoader = true;
      //   this.getAllManifests({
      //     ...this.options,
      //     search: this.search,
      //     type: this.searchType,
      //     status: this.orderStatus,
      //   })
      //     .then((res) => {
      //       this.manifestsLoader = false;
      //       this.manifests = res.data.data;
      //       this.total = res.data.total;
      //     })
      //     .catch(() => {
      //       this.manifestsLoader = false;
      //     });
    },
    editItem(item) {
      this.editedIndex = this.manifests.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    reset() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.$refs.form?.reset();
      });
    },

    close() {
      this.dialog = false;
      this.reset();
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      if (this.editedIndex !== -1) {
        this.editedItem.active = this.editedItem.active ? 1 : 0;
      }
      this.savePlannedMaster(this.editedItem)
        .then((res) => {
          this.saveLoader = false;
          this.snackBar({
            color: "success",
            message: res.message,
          });
          if (this.editedIndex === -1) {
            this.fetchManifest();
          } else {
            Object.assign(this.manifests[this.editedIndex], this.editedItem);
          }
          this.close();
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
    download() {
      this.downloadXLSX(
        [
          [
            "Plant Code",
            "Plant Name",
            "Email",
            "Mob",
            "Mob2",
            "Address1",
            "Address2",
            "City",
            "Country",
            "Latitude",
            "Longitude",
            "Delivery Schedule",
            "Delivery Frequency",
            "Delivery Days",
            "Delivery From Time",
            "Delivery To Time",
            "Pass Type",
            "Status",
          ],
          ...this.manifests.map((pm) => {
            return [
              pm.plant_code,
              pm.plant_name,
              pm.email_id,
              pm.mobile_no_1,
              pm.mobile_no_2,
              pm.address_1,
              pm.address_2,
              pm.city,
              pm.country,
              pm.latitude,
              pm.longitude,
              pm.delivery_schedule,
              pm.delivery_frequency,
              pm.delivery_days,
              pm.std_delivery_from_time,
              pm.std_delivery_to_time,
              pm.pass_type,
              0,
            ];
          }),
        ],
        "Plant Masters"
      );
    },
    goToDetails(item) {
      this.$router.push({
        name: "BODeliverySchedule",
        params: {
          sno: item.sno,
          code: item.plant_code,
          name: item.plant_name,
        },
      });
    },
    upload(e) {
      if (!e.target.files) return;
      const reader = new FileReader();
      const $v = this;
      reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(first_worksheet);
        if (data.length === 0) return;
        $v.fileLoader = true;
        $v.bulkUploadPlannedMaster(
          data.map((i) => {
            return {
              plant_code: i["Plant Code"],
              plant_name: i["Plant Name"],
              city: i["City"],
              country: i["Country"],
              mobile_no_1: i["Mob"],
              mobile_no_2: i["Mob2"],
              latitude: i["Latitude"],
              longitude: i["Longitude"],
              address_1: i["Address1"],
              address_2: i["Address2"],
              pass_type: i["Pass Type"],
              std_delivery_from_time: i["Delivery From Time"],
              std_delivery_to_time: i["Delivery To Time"],
              delivery_frequency: i["Delivery Frequency"],
              delivery_days: i["Delivery Days"].toLowercase(),
              delivery_schedule: i["Delivery Schedule"],
              email_id: i["Email"],
              active: i["Status"],
            };
          })
        )
          .then((res) => {
            $v.fileLoader = false;
            $v.snackBar({
              color: "success",
              message: res.message,
            });
            $v.fetchManifest();
          })
          .catch(() => {
            $v.fileLoader = false;
          });
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    },
    openFileDialog() {
      this.$refs.file.click();
    },
  },
};
</script>
