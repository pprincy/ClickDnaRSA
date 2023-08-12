<template>
  <v-breadcrumbs v-if="canDisplay" :items="items"></v-breadcrumbs>
</template>
<script>
export default {
  computed: {
    canDisplay() {
      return this.$route.name !== "Dashboard";
    },
  },
  data() {
    return {
      items: [
        {
          text: "Dashboard",
          disabled: false,
          exact: true,
          to: {
            name: "Dashboard",
          },
        },
        {
          text: "Customers",
          disabled: true,
          exact: true,
          to: {
            name: "Customers",
          },
        },
      ],
    };
  },
};
</script>
