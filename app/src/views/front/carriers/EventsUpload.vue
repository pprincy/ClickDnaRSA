<!-- #87 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="eventsUpload"
      :loading="loader"
      :options.sync="options"
      :server-items-length="total"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="12"
            md="8"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              Events Upload
            </v-toolbar-title>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-end pt-0">
            <div class="d-flex">
              <v-dialog
                v-model="dialog"
                max-width="550px"
                @keydown.esc="dialog = false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    :loading="fileLoader"
                    small
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2"
                    >Upload</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Events Upload</span>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="form" lazy-validation>
                      <v-row>
                        <v-col>
                          <v-file-input
                            v-model="file"
                            counter
                            show-size
                            accept=".xlsx"
                            label="Select your Excel file"
                            :rules="[(v) => !!v || 'Please select Excel File']"
                          >
                          </v-file-input>
                          <v-btn
                            color="primary"
                            dark
                            class="mt-3"
                            :loading="fileLoader"
                            @click="uploadEventsDetails"
                          >
                            Upload
                          </v-btn>
                          <v-btn
                            color="info"
                            class="mt-3 ml-3"
                            :loading="downloader"
                            @click="downloadEventsDetails()"
                            >Download template</v-btn
                          >
                          <v-btn class="mt-3 ml-3" @click="dialog = false">
                            Cancel
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-dialog>
              <v-btn
                color="info"
                small
                :loading="downloader"
                @click="downloadEventsDetails()"
                class="mr-4"
                >Download</v-btn
              >
            </div>
            <v-select
              v-model="selectedCarriedId"
              label="Carriers"
              :rules="[(v) => !!v || 'Carriers is required.']"
              class="required pt-0"
              item-text="name"
              item-value="id"
              :items="activeCarriersListTypes"
              @change="carrierTypeList()"
            ></v-select>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.is_final_event`]="{ item }">
        <div v-if="item.is_final_event === false">No</div>
        <div v-else>Yes</div>
      </template>
    </v-data-table>
    <BulkErrors
      :dialog="uploadResDialog"
      :data="uploadRes"
      @close="uploadResDialog = false"
    />
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import BulkErrors from "@/components/front/common/BulkErrors";

export default {
  components: {
    BulkErrors,
  },
  computed: {
    ...mapGetters(["activeCarriersListTypes"]),
  },
  data: () => ({
    headers: [
      {
        text: "Event Name",
        value: "event_name",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Event Code",
        value: "event_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Event Status",
        value: "event_status",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Is Final Event",
        value: "is_final_event",
        class: "body-1 font-weight-bold",
      },
      { text: "Summary", value: "summary", class: "body-1 font-weight-bold" },
      {
        text: "RSA Event",
        value: "rsa_event",
        align: "center",
        class: "body-1 font-weight-bold",
      },
    ],
    formData: {},
    eventsUpload: [],
    loader: false,
    dialog: false,
    file: null,
    fileLoader: false,
    downloader: false,
    uploadRes: {},
    uploadResDialog: false,
    selectedCarriedId: {
      name: null,
      id: null,
    },
    total: 0,
    options: {},
  }),

  watch: {
    options: {
      handler() {
        this.fetchEventsList();
      },
      deep: true,
    },
  },

  created() {
    this.selectedCarriedId.name = this.$route.params.name;
    this.selectedCarriedId.id = this.$route.params.id;
    this.fetchEventsList();
    this.getActiveCarriersListTypes();
  },

  methods: {
    ...mapActions([
      "getEvents",
      "uploadEvents",
      "downloadEvents",
      "getActiveCarriersListTypes",
    ]),
    fetchEventsList() {
      this.loader = true;
      this.getEvents({
        carrier_id: this.$route.query.carrier_id,
        params: {
          ...this.options,
        },
      })
        .then((res) => {
          this.loader = false;
          this.eventsUpload = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    uploadEventsDetails() {
      if (!this.$refs.form.validate()) return;
      this.fileLoader = true;
      const payload = new FormData();
      payload.append("data_file", this.file);
      payload.append("carrier_id", this.$route.query.carrier_id);
      this.uploadEvents(payload)
        .then((res) => {
          this.fileLoader = false;
          this.dialog = false;
          this.uploadRes = res.data;
          this.uploadResDialog = true;
          this.fetchEventsList();
        })
        .catch(() => {
          this.fileLoader = false;
        });
    },
    downloadEventsDetails() {
      this.downloader = true;
      const payload = new FormData();
      payload.append("carrier_id", this.$route.query.carrier_id);
      this.downloadEvents(payload)
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },
    carrierTypeList() {
      this.$router.replace({
        params: {
          id: this.$route.params.id,
          name: this.$route.params.name,
        },
        query: { carrier_id: this.selectedCarriedId },
      });
      this.fetchEventsList();
    },
  },
};
</script>
