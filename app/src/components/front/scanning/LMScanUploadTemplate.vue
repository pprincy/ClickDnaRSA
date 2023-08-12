<!-- #44 -->
<template>
  <v-card>
    <v-card color="primary lighten-1" dark>
      <v-card-title class="text-h5"> Template Guide </v-card-title>
      <v-card-subtitle
        >Please download the template, fill up the details and upload your
        orders. For template field details you can refer below documentation.
      </v-card-subtitle>
      <v-card-actions>
        <v-btn target="_blank" href="/test.xlsx" text>Download template</v-btn>
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
export default {
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
    };
  },
  created() {
    this.fetchTemplateDetails();
  },
  methods: {
    ...mapActions([""]),
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
      //   this.loader = true;
      //   this.getPlantMasterExplainTemplate()
      //     .then((res) => {
      //       this.loader = false;
      //       this.templateFields = res.data;
      //     })
      //     .catch(() => {
      //       this.loader = false;
      //     });
    },
  },
};
</script>
