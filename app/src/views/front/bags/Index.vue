<template>
  <v-col class="mx-4 py-0">
    <Summary />
    <v-tabs color="primary" right>
      <!-- <p class="text-h6 mr-auto mt-2 ml-2">Bags</p> -->
      <v-tab :to="{ name: 'BagsList' }">Bags</v-tab>
      <v-tab :to="{ name: 'BagsTemplate' }">Explain</v-tab>
    </v-tabs>
    <div class="py-4">
      <router-view></router-view>
    </div>
  </v-col>
</template>
<script>
import Summary from "@/components/front/bags/Summary.vue";
export default {
  components: {
    Summary,
  },
};
</script>
