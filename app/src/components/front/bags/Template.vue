<!-- #17 -->
<template>
  <v-card>
    <v-row class="mb-4">
      <v-col md="12" sm="12" xs="12">
        <v-card color="primary lighten-1" dark>
          <v-card-title class="text-h5"> Status Legend </v-card-title>
        </v-card>
        <v-card>
          <v-card-text>
            <Legends />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card color="primary lighten-1" dark>
      <v-card-title class="text-h5"> Status Guide </v-card-title>

      <v-card-subtitle
        >Please download the template, fill up the details and upload your bags
        data. For template field details you can refer below documentation.
      </v-card-subtitle>

      <v-card-actions>
        <v-btn :loading="downloader" @click="downloadTemplate()" text
          >Download template</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search Column"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="templateFields"
      :search="search"
      :loading="loader"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:item.url="{ item }">
        <v-img
          v-if="item.type === 'image'"
          class="ma-3"
          :src="item.url"
          max-width="300"
          max-height="300"
        ></v-img>
        <iframe
          v-if="item.type === 'video'"
          class="ma-3"
          width="560"
          height="315"
          frameborder="0"
          allowfullscreen
          :src="getId(item.url)"
        >
        </iframe>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
import Legends from "@/components/front/common/Legends";

export default {
  components: {
    Legends,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Filed name",
          align: "start",
          value: "field_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Description",
          value: "desc",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Why it is important​",
          value: "why_important",
          class: "body-1 font-weight-bold",
        },
        { text: "Image/Video", value: "url", class: "body-1 font-weight-bold" },
      ],
      templateFields: [],
      loader: false,
      downloader: false,
    };
  },
  created() {
    this.fetchTemplateDetails();
  },
  methods: {
    ...mapActions(["getBagDataTemplate", "downloadBagDataTemplate"]),
    getId(url) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      return (
        "//www.youtube.com/embed/" +
        (match && match[2].length === 11 ? match[2] : null)
      );
    },
    fetchTemplateDetails() {
      this.templateFields = [];
      this.loader = true;
      this.getBagDataTemplate()
        .then((res) => {
          this.loader = false;
          this.templateFields = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    downloadTemplate() {
      this.downloader = true;
      this.downloadBagDataTemplate()
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
