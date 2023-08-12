<!-- #76 -->
<template>
  <v-col class="mx-4">
    <template>
      <v-toolbar flat>
        <v-toolbar-title>Commercial Invoice XML</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="12" md="5" sm="12" xs="12">
            <v-file-input
              v-model="xmlFile"
              counter
              show-size
              accept=".xml"
              label="Select XML File"
              :rules="[
                (v) => !!v || 'XML File is required.',
                (v) =>
                  !v ||
                  v.size < 16777216 ||
                  `File size should be less than 16 MB!`,
                (v) => !v || ['application/xml, text/xml'],
              ]"
            >
            </v-file-input>
          </v-col>
          <v-col cols="12" md="2" sm="12" xs="12">
            <v-btn color="primary" dark :loading="fileLoader" @click="upload">
              Upload
            </v-btn>
          </v-col>
          <v-col cols="12" md="2" sm="12" xs="12">
            <router-link
              style="height: 40px; width: 175px"
              :to="{ name: 'CommercialInvoiceXML' }"
            >
              <v-btn color="primary" dark :loading="fileLoaderRsa">
                Listing
              </v-btn>
            </router-link>
          </v-col>
        </v-row>
      </v-form>
    </template>
    <v-divider class="my-5"></v-divider>
    <template>
      <v-toolbar flat>
        <v-toolbar-title>Manifest XML</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template>
      <v-form ref="formRsa" lazy-validation>
        <v-row>
          <v-col cols="12" md="5" sm="12" xs="12">
            <v-file-input
              v-model="rsaXmlFile"
              counter
              show-size
              accept=".xml"
              label="Select XML File"
              :rules="[
                (v) => !!v || 'XML File is required.',
                (v) =>
                  !v ||
                  v.size < 16777216 ||
                  `File size should be less than 16 MB!`,
                (v) => !v || ['application/xml, text/xml'],
              ]"
            >
            </v-file-input>
          </v-col>
          <v-col cols="12" md="2" sm="12" xs="12">
            <v-btn
              color="primary"
              dark
              :loading="fileLoaderRsa"
              @click="uploadRsa"
            >
              Upload
            </v-btn>
          </v-col>
          <v-col cols="12" md="2" sm="12" xs="12">
            <router-link
              style="height: 40px; width: 175px"
              :to="{ name: 'ManifestXML' }"
            >
              <v-btn color="primary" dark :loading="fileLoaderRsa">
                Listing
              </v-btn>
            </router-link>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    xmlFile: null,
    fileLoader: false,
    rsaXmlFile: null,
    fileLoaderRsa: false,
  }),

  methods: {
    ...mapActions(["uploadXML", "uploadRSAXML", "snackBar"]),
    upload() {
      if (!this.$refs.form.validate()) return;
      this.fileLoader = true;
      const payload = new FormData();
      payload.append("xml_file", this.xmlFile, this.xmlFile.name);
      this.uploadXML(payload)
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
    uploadRsa() {
      if (!this.$refs.formRsa.validate()) return;
      this.fileLoaderRsa = true;
      const payload = new FormData();
      payload.append("rsa_xml_file", this.rsaXmlFile, this.rsaXmlFile.name);
      this.uploadRSAXML(payload)
        .then((res) => {
          this.fileLoaderRsa = false;
          this.snackBar({
            color: "success",
            message: res.message,
          });
        })
        .catch(() => {
          this.fileLoaderRsa = false;
        });
    },
  },
};
</script>
