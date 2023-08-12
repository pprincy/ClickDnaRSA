<template>
  <v-col class="mx-4 py-0">
    <Summary />
    <v-tabs color="primary accent-4" v-model="tab" right>
      <p class="text-h6 mr-auto mt-2 ml-3">Create users</p>
      <v-tab :to="{ name: 'UsersList' }">Users</v-tab>
      <v-tab :to="{ name: 'GroupsList' }">Groups</v-tab>
      <v-tab :to="{ name: 'UserCategoryScreen' }">Screens</v-tab>
    </v-tabs>
    <div class="py-4">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </v-col>
</template>
<script>
export default {
  data() {
    return {
      tab: null,
    };
  },
  created() {
    if (this.$route.name === "GroupCreate") {
      this.tab = "/client/access-control/groups/list";
    }
  },
};
</script>
