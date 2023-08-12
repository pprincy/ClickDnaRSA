<template>
  <v-col class="mx-4">
    <v-row>
      <v-col cols="12" md="6" sm="6" xs="12">
        <p class="body-1 font-weight-bold">Trigger</p>
        <p class="body-2 ma-0">
          How many hours before the flight's ETA or ETD should the manifest be
          sent to the carrier.
        </p>
        <v-radio-group class="mt-2" v-model="manifestObj.trigger_type">
          <v-radio
            v-for="(n, i) in triggerOptions"
            :key="i"
            :label="n.text"
            :value="n.value"
          ></v-radio>
        </v-radio-group>
        <p class="body-1 mt-2 font-weight-bold">Hours</p>
        <p class="body-2 ma-0">
          Enter the number of hours before the ETA or after ETD when the
          manifest is released to the carrier.
        </p>
        <v-text-field
          class="centered-input"
          v-model="manifestObj.hours"
          readonly
        >
          <v-icon
            slot="prepend-inner"
            color="green"
            :disabled="manifestObj.hours === 1"
            @click="decreseHours()"
          >
            mdi-minus
          </v-icon>
          <v-icon slot="append" color="red" @click="increaseHours()">
            mdi-plus
          </v-icon>
        </v-text-field>
        <v-radio-group class="mt-0" v-model="manifestObj.trigger_hours">
          <v-radio
            v-for="(n, i) in hoursOptions"
            :key="i"
            :label="n.text"
            :value="n.value"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" md="6" sm="6" xs="12">
        <p class="body-1 font-weight-bold pt-4">Format</p>
        <p class="body-2 ma-0">
          These fields will appear in the header section of Excel file.
        </p>

        <v-radio-group class="mt-2" v-model="manifestObj.format">
          <v-radio
            v-for="(n, i) in formatOptions"
            :key="i"
            :label="n.text"
            :value="n.value"
          ></v-radio>
        </v-radio-group>
        <p class="body-1 font-weight-bold pt-4">Alternative Email Address</p>
        <p class="body-2 ma-0">
          In case the carrier profile email address is not to be used please
          enter an alternative email address to send to manifest to
        </p>
        <v-text-field v-model="manifestObj.alternate_email"> </v-text-field>
        <br />
        <v-btn color="primary" @click="download()" :loading="downloader">
          <v-icon left dark> mdi-cloud-download </v-icon>
          Download Sample Layout
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["manifestObj"]),
  },
  data() {
    return {
      trigger: null,
      triggerOptions: [
        {
          text: "Use Estimated Time of Arrival (ETA)",
          value: "ETA",
        },
        {
          text: "Use Estimated Time of Depature (ETD)",
          value: "ETD",
        },
        {
          text: "Immediately on client submission",
          value: "client_submission",
        },
        {
          text: "Immediately on origin agent submission",
          value: "agent_submission",
        },
      ],
      hoursOptions: [
        {
          text: "Before ETA/ETD",
          value: "before",
        },
        {
          text: "After ETA/ETD",
          value: "after",
        },
      ],
      formatOptions: [
        {
          text: "Excel",
          value: "excel",
        },
        {
          text: "PDF",
          value: "pdf",
        },
      ],
      downloader: false,
    };
  },
  methods: {
    ...mapActions(["downloadSampleManifest"]),
    download() {
      this.downloader = true;
      this.downloadSampleManifest(this.manifestObj.user_id)
        .then((res) => {
          this.fileDownload(res);
          this.downloader = false;
        })
        .catch(() => {
          this.downloader = false;
        });
    },
    increaseHours() {
      +this.manifestObj.hours++;
    },
    decreseHours() {
      +this.manifestObj.hours--;
    },
  },
};
</script>
<style scoped>
.centered-input {
  width: 150px;
}
</style>
