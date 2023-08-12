<!-- #25 -->
<template>
  <v-col class="mx-4">
    <v-card>
      <v-card-title class="pl-4 text-h6"
        >Subscribe to tracking, pod or label events</v-card-title
      >
      <v-tabs dark grow background-color="primary accent-4" v-model="activeTab">
        <v-tab href="#Tracking"> Tracking </v-tab>
        <v-tab href="#Label"> Label </v-tab>
        <v-tab href="#POD"> POD </v-tab>
        <v-tab-item value="Tracking">
          <Tracking />
        </v-tab-item>
        <v-tab-item value="Label">
          <Label />
        </v-tab-item>
        <v-tab-item value="POD">
          <POD />
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-col>
</template>
<script>
import Tracking from "@/components/front/tracking-subscription/Tracking.vue";
import Label from "@/components/front/tracking-subscription/Label.vue";
import POD from "@/components/front/tracking-subscription/POD.vue";
export default {
  components: {
    Tracking,
    Label,
    POD,
  },
  data() {
    return {
      activeTab: "Tracking",
    };
  },
};
</script>
