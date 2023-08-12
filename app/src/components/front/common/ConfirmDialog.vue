<template>
  <v-dialog
    v-model="localDialog"
    max-width="550px"
    @keydown.esc="$emit('close', false)"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 text-wrap">{{ text }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('close', false)"
          >Cancel</v-btn
        >
        <v-btn
          color="blue darken-1"
          text
          @click="$emit('confirm', true)"
          :loading="loader"
          >OK</v-btn
        >
        <v-spacer></v-spacer>
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
    text: {
      type: String,
      default: "Are you sure you want to delete this item?",
    },
    loader: {
      type: Boolean,
      default: false,
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
};
</script>
<style lang="scss" scoped>
.v-card__title {
  word-break: break-word !important;
}
</style>
