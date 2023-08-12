<!-- #43 -->
<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="packages"
      :search="search"
      :options.sync="options"
      :server-items-length="total"
      :loading="packagesLoader"
    >
      <template v-slot:top>
        <v-row>
          <v-col>
            <p class="text-h6 ml-4">Package Upload History</p>
          </v-col>
        </v-row>
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
              Upload package file with the help of explain template
            </p>
            <div class="d-flex">
              <v-btn
                color="primary"
                class="mr-2"
                small
                target="_blank"
                href="/test.xlsx"
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
                    >Bulk Upload</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Bulk Upload</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-file-input
                          v-model="file"
                          counter
                          show-size
                          accept=".xlsx"
                          label="Click here to upload packages"
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
                          href="/test.xlsx"
                          >Download template</v-btn
                        >
                        <v-btn
                          color="info"
                          class="mt-3 ml-3"
                          :to="{
                            name: 'LMScanUploadTemplate',
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
      packages: [
        {
          name: "DHL",
        },
      ],
      headers: [
        {
          text: "Tracking Number",
          value: "tracking_number",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Location",
          value: "location",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Scan Code",
          value: "scan_code",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Scan Name",
          value: "scan_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Date",
          value: "date",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Time",
          value: "time",
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
          text: "Track #",
          value: "tracking_number",
        },
        {
          text: "Scan Code",
          value: "scan_code",
        },
        {
          text: "Scan Sub Category",
          value: "scan_sub_category",
        },
      ],
      total: 1,
      packagesLoader: false,
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
      // this.packages = [];
      //   this.packagesLoader = true;
      //   this.getAllManifests({
      //     ...this.options,
      //     search: this.search,
      //     type: this.searchType,
      //     status: this.orderStatus,
      //   })
      //     .then((res) => {
      //       this.packagesLoader = false;
      //       this.packages = res.data.data;
      //       this.total = res.data.total;
      //     })
      //     .catch(() => {
      //       this.packagesLoader = false;
      //     });
    },
    editItem(item) {
      this.editedIndex = this.packages.indexOf(item);
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
            Object.assign(this.packages[this.editedIndex], this.editedItem);
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
          ...this.packages.map((pm) => {
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
