<!-- #55 -->
<template>
  <v-col class="mx-4">
    <v-row>
      <v-col class="pb-0 my-4">
        <v-btn icon :to="{ name: 'Clients' }" class="mt-n1" text>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="text-h6 ml-2">
          Product Code and HS Code mapping - {{ $route.query.name }}
        </span>
        <v-btn
          class="primary float-right"
          @click="downloadAll()"
          :loading="downloader"
          >Download all products</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title>
              Verify Client Product ID - HS Code Mapping Present
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form1">
              <div class="text-center py-0">
                <ul class="text-left">
                  <li>
                    <strong>CLIENT_PRODUCT_ID</strong> <br />
                    - Insert client product IDs in the sample excel template
                    column and upload to verify client product ID and HS Code
                    mapping is present or not.
                    <br /><br /><br />
                  </li>
                </ul>
                <v-file-input
                  v-model="filePVerify"
                  accept=".xlsx"
                  label="Upload Product IDs"
                  class="w-90"
                  clearable
                  hide-details
                  single-line
                >
                </v-file-input>
                <v-btn
                  color="info"
                  @click="getProductHSCodeVerifyTemplate()"
                  class="mt-2"
                  :loading="downloaderPVerify"
                >
                  Download template
                </v-btn>
                <v-btn
                  color="primary"
                  class="mt-2 ml-4"
                  :loading="uploaderPVerify"
                  @click="prouctsVerify()"
                  >Submit</v-btn
                >
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="userRole.code === 'AD'">
        <v-card>
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title>
              Upload Mapping for Client Product IDs to HS Codes
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form2">
              <div class="text-center py-0">
                <ul class="text-left">
                  <li>
                    <strong>COUNTRY</strong> - Short country code is required.
                    <br />
                    You can find all country codes in the sample excel
                    template's sheet named as Country.
                  </li>
                  <li>
                    <strong>TYPE_OF_UPDATE</strong> - Given are the type of
                    update available <br />
                    &nbsp; <strong>new</strong> - to add new product & hs code
                    mapping entry <br />
                    &nbsp; <strong>update</strong> - the existing product & hs
                    code mapping
                  </li>
                </ul>
                <v-file-input
                  v-model="filePUpload"
                  accept=".csv"
                  label="Upload Product IDs - HS Codes"
                  :rules="[
                    (v) => !!v || 'CSV File is required.',
                    (v) =>
                      !v ||
                      v.size < 2097152 ||
                      `File size should be less than 2 MB!`,
                    (v) => !v || ['text/csv'],
                  ]"
                  class="w-90"
                  clearable
                  hide-details
                  single-line
                >
                </v-file-input>
                <v-btn
                  color="info"
                  @click="getProductHSCodeTemplate()"
                  class="mt-2"
                  :loading="downloaderPUpload"
                  >Download Pending List</v-btn
                >
                <v-btn
                  color="primary"
                  class="mt-2 ml-4"
                  :loading="uploaderPUpload"
                  @click="prouctsUpload()"
                  >Submit</v-btn
                >
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <BulkErrors
      :dialog="uploadResDialog"
      :data="uploadRes"
      @close="uploadResDialog = false"
      file-name="HS-Product-Errorlist"
      :other="other"
    />
  </v-col>
</template>
<script>
import BulkErrors from "@/components/front/common/BulkErrors";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    BulkErrors,
  },
  computed: {
    ...mapGetters(["user", "userRole"]),
  },
  data() {
    return {
      pageLoader: false,
      uploadResDialog: false,
      uploadRes: {},
      downloaderPVerify: false,
      downloaderPUpload: false,
      uploaderPVerify: false,
      uploaderPUpload: false,
      downloader: false,
      filePVerify: null,
      filePUpload: null,
      other: "verify",
    };
  },
  methods: {
    ...mapActions([
      "downloadProductHSCodeVerifyTemplate",
      "downloadProductHSCodeTemplate",
      "uploadProductHSCodeVerify",
      "uploadProductHSCode",
      "downloadClientProducts",
      "snackBar",
    ]),
    downloadAll() {
      this.downloader = true;
      const id = this.$route.params.id || this.user.id;
      this.downloadClientProducts(id)
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },
    getProductHSCodeVerifyTemplate() {
      this.downloaderPVerify = true;
      this.downloadProductHSCodeVerifyTemplate()
        .then((res) => {
          this.fileDownload(res);
          this.downloaderPVerify = false;
        })
        .catch(() => {
          this.downloaderPVerify = false;
        });
    },
    getProductHSCodeTemplate() {
      this.downloaderPUpload = true;
      this.downloadProductHSCodeTemplate(this.$route.params.id)
        .then((res) => {
          // this.fileDownload(res);
          this.fileCSVDownload(res);
          this.downloaderPUpload = false;
        })
        .catch(() => {
          this.downloaderPUpload = false;
        });
    },
    prouctsVerify() {
      if (!this.filePVerify) return;
      this.uploaderPVerify = true;
      const payload = new FormData();
      payload.append("data_file", this.filePVerify, this.filePVerify.name);
      payload.append("client_id", this.$route.params.id || this.user.id);
      this.uploadProductHSCodeVerify(payload)
        .then((res) => {
          this.uploaderPVerify = false;
          this.uploadRes = res.data;
          this.other = "verify";
          this.uploadResDialog = true;
        })
        .catch(() => {
          this.uploaderPVerify = false;
        });
    },
    prouctsUpload() {
      if (!this.filePUpload) return;
      this.uploaderPUpload = true;
      const payload = new FormData();
      payload.append("data_file", this.filePUpload, this.filePUpload.name);
      payload.append("client_id", this.$route.params.id);
      this.uploadProductHSCode(payload)
        .then((res) => {
          this.uploaderPUpload = false;
          this.uploadRes = res.data;
          this.other = "";
          this.uploadResDialog = true;
        })
        .catch(() => {
          this.uploaderPUpload = false;
        });
    },
  },
};
</script>
