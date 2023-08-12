<!-- #74 -->
<template>
  <v-col class="mx-4">
    <v-data-table :headers="headers" :items="pgList" class="elevation-1">
      <template>
        <v-toolbar flat>
          <v-toolbar-title>HS Code</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:[`item.category`]="{ item }">
        <label>
          <strong>Category:</strong> {{ item.category }} <br />
          <strong>Sub Category:</strong> {{ item.subcategory }} <br />
          <strong>Heading:</strong> {{ item.heading }}
        </label>
      </template>
      <template v-slot:[`item.ior`]="{ item }">
        <strong class="green--text" v-if="item.ior == true">Applicable</strong>
        <strong class="red--text" v-else>Not Applicable</strong>
      </template>
    </v-data-table>
  </v-col>
</template>
<script>
export default {
  data: () => ({
    headers: [
      {
        text: "HS Code",
        value: "hs_code",
        class: "body-1 font-weight-bold",
        align: "left",
      },
      {
        text: "Category / Sub Category / Heading",
        value: "category",
        class: "body-1 font-weight-bold",
        align: "left",
      },
      {
        text: "Description",
        value: "description",
        class: "body-1 font-weight-bold",
        align: "left",
      },
      {
        text: "IOR",
        value: "ior",
        class: "body-1 font-weight-bold",
        align: "left",
      },
      {
        text: "Country",
        value: "country_id",
        class: "body-1 font-weight-bold",
        align: "left",
      },
      {
        text: "Unit Of Measure",
        value: "unit_of_measure",
        class: "body-1 font-weight-bold",
        align: "left",
      },
      {
        text: "Duty",
        value: "duty",
        class: "body-1 font-weight-bold",
        align: "right",
      },
    ],
    pgList: [],
  }),

  created() {
    this.uploadList();
  },

  methods: {
    uploadList() {
      var code = this.$route.params.data;
      this.pgList = code;
    },
  },
};
</script>
