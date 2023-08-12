<template>
  <v-dialog
    v-model="localDialog"
    max-width="600px"
    @keydown.esc="$emit('close', false)"
    persistent
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ message }}
        <p>Click here to Remove Carrier from Linehaul</p>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('close', false)">
          close
        </v-btn>
        <v-btn color="blue darken-1" text :loading="loader" @click="editItem"
          >OK</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    carrierId: {
      type: Number,
      default: () => {},
    },
  },
  data() {
    return {
      localDialog: false,
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
    },
  },

  methods: {
    editItem() {
      this.$router.push({
        name: "Linehaul",
        params: {
          id: this.carrierId,
        },
        query: {
          carrier_id: this.carrierId,
        },
      });
    },
  },
};
</script>
