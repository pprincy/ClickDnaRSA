<!-- #75 -->
<template>
  <v-col class="mx-4">
    <v-row>
      <v-col class="mx-auto" md="6" sm="12">
        <v-card>
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title> Seller Onboarding Status </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <div class="text-center py-0">
                <ul class="text-left">
                  <li>
                    Update Seller's Onboarding status via Bulk upload (Client
                    Status)
                  </li>
                  <li>
                    When status = "Onboarding Complete", Merchant ID and
                    Merchant ID Unencrypted are mandatory
                  </li>
                  <li>When status = "Reject", reject reason is mandatory</li>
                </ul>
                <v-autocomplete
                  v-if="userRole.code === 'AD'"
                  v-model="clientId"
                  :items="clients"
                  :loading="clientLoader"
                  hide-no-data
                  item-text="name"
                  item-value="id"
                  label="Select client"
                  placeholder="Start typing to Search"
                  prepend-icon="mdi-database-search"
                  :rules="[(v) => !!v || 'Please select a client.']"
                  class="required"
                  ref="clientId"
                ></v-autocomplete>
                <v-file-input
                  v-model="file"
                  ref="file"
                  counter
                  show-size
                  accept=".xlsx"
                  label="Select your sellers excel file"
                  :rules="[
                    (v) => !!v || 'Sellers excel is required.',
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
                  class="required"
                >
                </v-file-input>
                <v-btn
                  color="info"
                  @click="download()"
                  class="mt-2"
                  :loading="downloader"
                >
                  Download Pending List
                </v-btn>
                <v-btn
                  color="primary"
                  class="mt-2 ml-4"
                  :loading="uploader"
                  @click="upload()"
                  >Update Status</v-btn
                >
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="uploadRes.seller_data && uploadRes.seller_data.length">
      <v-col>
        <v-card>
          <v-toolbar
            :color="uploadRes.fail_count ? 'error' : 'success'"
            dense
            dark
            flat
          >
            <v-toolbar-title>
              Data Processed. {{ uploadRes.success_count }} Success and
              {{ uploadRes.fail_count }} Error.</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="uploadRes.seller_data"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:[`item.name`]="{ item }">
                {{ item.name }}<br />(L-{{ item.legal_name }})
              </template>
              <template v-slot:[`item.signatory_name`]="{ item }">
                {{ item.signatory_name }}<br />({{ item.job_title }})
              </template>
              <template v-slot:[`item.update_status`]="{ item }">
                <v-chip
                  :color="
                    item.update_status === 'Success' ? 'success' : 'error'
                  "
                >
                  <strong>
                    {{ item.update_status }}
                  </strong>
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userRole"]),
  },
  data() {
    return {
      file: null,
      downloader: false,
      uploader: false,
      clientLoader: false,
      clients: [],
      clientId: null,
      headers: [
        {
          text: "Seller Name",
          value: "name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Signatory Name",
          value: "signatory_name",
          class: "body-1 font-weight-bold",
          sortable: false,
        },
        {
          text: "Email",
          value: "email",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Country",
          value: "country_id",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Client Status",
          value: "client_status",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Client Merchant ID",
          value: "client_merchant_id",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Amazon Merchant ID",
          value: "amazon_merchant_id",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Client Reason",
          value: "client_reason",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Status",
          value: "update_status",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Failed Reason",
          value: "update_status_reason",
          class: "body-1 font-weight-bold",
        },
      ],
      uploadRes: {},
    };
  },
  watch: {
    userRole(val) {
      if (val && this.clients.length === 0 && this.userRole.code === "AD") {
        this.fetchClientList();
      }
    },
  },
  mounted() {
    if (this.clients.length === 0 && this.userRole.code === "AD") {
      this.fetchClientList();
    }
  },
  methods: {
    ...mapActions([
      "downloadSellerOnboardStatus",
      "uploadSellerOnboardStatus",
      "getClients",
      "snackBar",
    ]),
    fetchClientList() {
      this.clientLoader = true;
      this.getClients({
        fields: "id,name",
        pagination: 0,
        service: "ior",
      })
        .then((res) => {
          this.clientLoader = false;
          this.clients = res.data;
        })
        .catch(() => {
          this.clientLoader = false;
        });
    },
    download() {
      this.$refs.file.resetValidation();
      if (this.userRole.code === "AD" && !this.$refs.clientId.validate(true))
        return;
      this.downloader = true;
      const payload = {};
      if (this.userRole.code === "AD") {
        payload.client_id = this.clientId;
      }
      this.downloadSellerOnboardStatus(payload)
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },
    upload() {
      if (!this.$refs.form.validate()) return;
      this.uploader = true;
      const payload = new FormData();
      payload.append("data_file", this.file, this.file.name);
      if (this.userRole.code === "AD") {
        payload.append("client_id", this.clientId);
      }
      this.uploadSellerOnboardStatus(payload)
        .then((res) => {
          this.uploader = false;
          this.uploadRes = res.data.data;
        })
        .catch(() => {
          this.uploader = false;
        });
    },
  },
};
</script>
