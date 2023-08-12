<!-- #71 -->
<template>
  <v-row>
    <v-col class="mx-4">
      <template>
        <v-toolbar flat>
          <v-toolbar-title>Upload Outbound Files</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12" md="5" sm="12" xs="12">
              <v-file-input
                v-model="excelFile"
                counter
                show-size
                accept=".xlsx"
                label="Select Excel File"
                :rules="[
                  (v) => !!v || 'Excel is required.',
                  (v) =>
                    !v ||
                    v.size < 26214400 ||
                    `File size should be less than 25 MB!`,
                  (v) =>
                    !v ||
                    [
                      'application/vnd.ms-excel',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    ].includes(v.type) ||
                    `Excel File is required`,
                ]"
              >
              </v-file-input>
            </v-col>
            <!--
            <v-col cols="12" md="5" sm="12" xs="12">
              <v-file-input
                v-model="excelMonthFile"
                counter
                show-size
                accept=".xlsx"
                label="Select Excel Month File"
                :rules="[
                  (v) => !!v || 'Excel is required.',
                  (v) =>
                    !v ||
                    v.size < 26214400 ||
                    `File size should be less than 25 MB!`,
                  (v) =>
                    !v ||
                    [
                      'application/vnd.ms-excel',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    ].includes(v.type) ||
                    `Excel Month File is required`,
                ]"
              >
              </v-file-input>
            </v-col>

-->
            <v-col cols="12" md="2" sm="12" xs="12">
              <v-btn color="primary" dark :loading="fileLoader" @click="upload">
                Upload
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template>
        <v-toolbar flat>
          <v-toolbar-title>Upload Gatepass Data</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template>
        <v-form ref="form1" lazy-validation>
          <v-row>
            <v-col cols="12" md="5" sm="12" xs="12">
              <v-file-input
                v-model="dataFile"
                counter
                show-size
                accept=".xlsx"
                label="Select Excel File"
                :rules="[
                  (v) => !!v || 'Excel is required.',
                  (v) =>
                    !v ||
                    v.size < 26214400 ||
                    `File size should be less than 25 MB!`,
                  (v) =>
                    !v ||
                    [
                      'application/vnd.ms-excel',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    ].includes(v.type) ||
                    `Excel File is required`,
                ]"
              >
              </v-file-input>
            </v-col>
            <v-col cols="12" md="5" sm="12" xs="12">
              <v-btn
                color="primary"
                dark
                :loading="fileLoader1"
                @click="uploadDataFile"
              >
                Upload
              </v-btn>
              <v-btn
                color="primary"
                class="ml-3"
                :loading="downloader"
                @click="downloadTemplate()"
                >Download template</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </template>
    </v-col>
    <BulkErrors
      :dialog="uploadResDialog"
      :data="uploadRes"
      @close="uploadResDialog = false"
    />
  </v-row>
</template>
<script>
import { mapActions } from "vuex";
import BulkErrors from "@/components/front/common/BulkErrors";

export default {
  components: {
    BulkErrors,
  },
  data: () => ({
    excelFile: null,
    excelMonthFile: null,
    fileLoader: false,
    dataFile: null,
    fileLoader1: false,
    downloader: false,
    uploadRes: {},
    uploadResDialog: false,
  }),

  methods: {
    ...mapActions([
      "uploadExcel",
      "uploadDataFileExcel",
      "downloadDataFileTemplate",
      "snackBar",
    ]),
    upload() {
      if (!this.$refs.form.validate()) return;
      this.fileLoader = true;
      const payload = new FormData();
      payload.append("excel_file", this.excelFile, this.excelFile.name);

      // payload.append("excel_month_file",  this.excelMonthFile, this.excelMonthFile.name);

      this.uploadExcel(payload)
        .then((res) => {
          this.fileLoader = false;
          this.snackBar({
            color: "success",
            message: res.message,
          });
        })
        .catch(() => {
          this.fileLoader = false;
        });
    },
    uploadDataFile() {
      if (!this.$refs.form1.validate()) return;
      this.fileLoader1 = true;
      const payload = new FormData();
      payload.append("data_file", this.dataFile, this.dataFile.name);
      this.uploadDataFileExcel(payload)
        .then((res) => {
          this.fileLoader1 = false;
          this.uploadRes = res.data;
          this.uploadResDialog = true;
        })
        .catch(() => {
          this.fileLoader1 = false;
        });
    },
    downloadTemplate() {
      this.downloader = true;
      this.downloadDataFileTemplate()
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },
  },
};
</script>
