<!-- #73 -->
<template>
  <v-col class="mx-4">
    <v-row>
      <v-col md="6" sm="12">
        <v-card>
          <v-toolbar color="primary" dense dark flat>
            <v-toolbar-title> Lookup HS Code </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" lazy-validation @submit.prevent>
              <div class="text-center py-0">
                <ul class="text-left">
                  <li>
                    You will be able to search only 10 HS Code via excel mode
                  </li>
                </ul>
                <v-text-field
                  label="Enter HS Code"
                  v-model="hsCodeInput"
                  @keyup.enter="submit()"
                >
                </v-text-field>
                <p class="font-weight-bold">OR</p>
                <v-file-input
                  v-model="hsCodeExcel"
                  counter
                  show-size
                  accept=".xlsx"
                  label="Select HS Code Excel"
                  :rules="[
                    (v) =>
                      !v ||
                      v.size < 5242880 ||
                      `File size should be less than 5 MB!`,
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
                <div class="d-flex justify-end pt-2">
                  <v-btn
                    color="primary"
                    class="mr-2"
                    small
                    :loading="downloader"
                    @click="downloadTemplateHS()"
                    >Download template</v-btn
                  >
                  <v-btn
                    color="primary"
                    :loading="fileLoader"
                    @click="submit"
                    small
                    >Submit</v-btn
                  >
                </div>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    hsCodeInput: null,
    hsCodeExcel: null,
    fileLoader: false,
    downloader: false,
  }),

  methods: {
    ...mapActions(["uploadCode", "downloadTemplateHSCode", "snackBar"]),
    submit() {
      if (!this.$refs.form.validate()) return;
      if (this.hsCodeInput == null && this.hsCodeExcel == null) {
        this.snackBar({
          color: "error",
          message: "Please Provide Input code or Upload Excel File",
        });
      } else {
        this.fileLoader = true;
        const payload = new FormData();
        if (this.hsCodeInput != null) {
          payload.append("hs_code_input", this.hsCodeInput);
        }
        if (this.hsCodeExcel != null) {
          payload.append(
            "hs_code_excel",
            this.hsCodeExcel,
            this.hsCodeExcel.name
          );
        }
        this.uploadCode(payload)
          .then((res) => {
            this.fileLoader = false;
            if (res[0].message) {
              this.snackBar({
                color: "error",
                message: "Please Provide Only 10 Hs Codes.",
              });
            } else {
              this.$router.push({
                name: "HSCodeList",
                params: {
                  data: res,
                },
              });
            }
          })
          .catch(() => {
            this.fileLoader = false;
          });
      }
    },
    downloadTemplateHS() {
      this.downloader = true;
      this.downloadTemplateHSCode()
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
