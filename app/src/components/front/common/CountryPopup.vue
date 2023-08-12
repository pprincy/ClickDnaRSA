<template>
  <v-dialog
    v-model="localDialog"
    max-width="320"
    @keydown.esc="$emit('close', false)"
    persistent
  >
    <v-card>
      <v-card-title class="text-h6"> Countries </v-card-title>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr v-for="(item, i) in countries" :key="i">
                <td>{{ item.code }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <img
                    :src="item.flag | assetURL"
                    :alt="item.name"
                    class="ma-3 country-logo"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('close', false)">
          close
        </v-btn>
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
    countries: {
      type: Array,
      default: () => [],
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
