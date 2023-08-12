<template>
  <v-navigation-drawer
    class="primary accent-4 fill-height"
    dark
    v-model="drawer"
    mobile-breakpoint="960"
    :mini-variant.sync="mini"
    v-click-outside="onClickOutside"
    app
  >
    <v-list-item class="py-1 px-2">
      <v-list-item-avatar>
        <v-avatar color="rgb(218 27 49)" size="38">RS</v-avatar>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>Rakesh Sojitra</v-list-item-title>
      </v-list-item-content>

      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>
    <v-divider></v-divider>
    <v-list nav dense>
      <v-list-item :to="{ name: 'Customers' }" link>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-icon v-bind="attrs" v-on="on">
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
          </template>
          <span>My Files</span>
        </v-tooltip>
        <v-list-item-title>Customers</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isOpen() {
      this.drawer = this.isOpen;
      this.mini = false;
    },
    drawer() {
      this.$emit("update:isOpen", this.drawer);
    },
  },
  data() {
    return {
      mini: true,
      drawer: true,
    };
  },
  methods: {
    onClickOutside() {
      if (!this.$vuetify.breakpoint.smAndDown) {
        this.mini = true;
      }
    },
  },
};
</script>
