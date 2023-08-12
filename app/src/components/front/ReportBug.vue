<template>
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        color="error"
        class="mx-2"
        v-on="on"
        v-bind="attrs"
        @click="takeScreenshot()"
        >mdi-bug</v-icon
      >
    </template>
    <span>Report Bug</span>
    <v-dialog v-model="dialog" width="600" @keydown.esc="close()" persistent>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Report Bug</v-toolbar-title>
          <i class="caption red--text ml-4"> * required field</i>
          <v-spacer></v-spacer>
          <v-icon>mdi-bug</v-icon>
        </v-toolbar>
        <v-card-text class="pa-4">
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="12" md="6" sm="6" xs="12">
                <img :src="imgURL" alt="Issue Image" class="bug-preview" />
              </v-col>
              <v-divider vertical></v-divider>
              <v-col cols="12" md="6" sm="6" xs="12">
                <p v-if="ref">
                  Screen: <strong>{{ ref }}</strong>
                </p>
                <p>
                  URL: <strong>{{ formData.url }}</strong>
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  label="Description"
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Description is required.',
                  ]"
                  class="required"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Close </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :loading="saveLoader"
            @click="submitIssue"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-tooltip>
</template>
<script>
import ScreenShort from "js-web-screen-shot";
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userRole"]),
    ref() {
      return this.userRole.code + " - " + this.$route.meta?.ref;
    },
  },
  data() {
    return {
      imgURL: null,
      dialog: false,
      saveLoader: false,
      formData: {},
    };
  },
  methods: {
    ...mapActions(["reportBug", "snackBar"]),
    reset() {
      this.formData = {
        screen_id: null,
        description: null,
        url: null,
        screenshot: null,
      };
    },
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    takeScreenshot() {
      this.reset();
      new ScreenShort({
        enableWebRtc: false,
        completeCallback: (base64) => {
          this.imgURL = base64;
          this.formData.screenshot = this.dataURLtoFile(
            base64,
            +new Date() + ".png"
          );
          this.dialog = true;
          this.formData.url = window.location.href;
          this.formData.screen_id = this.ref;
        },
        closeCallback: (close) => {
          console.log(close);
        },
      });
    },
    close() {
      this.imgURL = null;
      this.dialog = false;
      this.reset();
    },
    submitIssue() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      const payload = new FormData();
      for (const field in this.formData) {
        payload.append(
          field,
          this.formData[field] === null ? "" : this.formData[field]
        );
      }
      this.reportBug(payload)
        .then((res) => {
          this.saveLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.close();
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
  },
};
</script>

<style>
#toolPanel {
  height: 45px !important;
}
#optionPanel {
  height: 40px !important;
}
#screenShotContainer,
#textInputPanel {
  z-index: 999 !important;
}
.bug-preview {
  max-height: 150px;
  max-width: 100%;
}
</style>
