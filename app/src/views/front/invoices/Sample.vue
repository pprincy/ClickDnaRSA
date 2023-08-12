<template>
  <div>
    <v-icon left> mdi-paperclip </v-icon>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
      </template>
      I'm a tooltip
    </v-tooltip>
    <v-btn
      color="info"
      class="ml-2 clickable"
      :loading="loader"
      @click="download()"
      small
    >
      Download Pre-filled Invoice
    </v-btn>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: {
    invId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loader: false,
    };
  },
  methods: {
    ...mapActions(["downloadSampleInvPDF"]),
    download() {
      this.loader = true;
      this.downloadSampleInvPDF(this.invId)
        .then((res) => {
          this.fileDownload(res);
          this.loader = false;
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
