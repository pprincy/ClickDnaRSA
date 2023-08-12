<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-breadcrumbs :items="items"></v-breadcrumbs>
      </v-col>
      <v-col>
        <Summary />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Summary from "@/components/front/tracking/Summary.vue";
export default {
  components: {
    Summary,
  },
  data() {
    return {
      items: [
        {
          text: "Home",
          disabled: false,
          to: "/",
        },
        {
          text: "Tracking Summary",
          disabled: true,
        },
      ],
    };
  },
};
</script>
