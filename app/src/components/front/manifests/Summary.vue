<template>
  <v-col cols="12" sm="12" xs="12" md="12">
    <v-row>
      <v-col cols="12" md="4" sm="4" xs="12">
        <v-card @click="statusType = null">
          <v-card-title class="headline">
            Total
            <v-spacer></v-spacer>
            <v-icon x-large>mdi-database</v-icon>
          </v-card-title>
          <v-card-text class="font-weight-black text-center">
            <p class="text-h4 info--text">0</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="4" xs="12">
        <v-card @click="statusType = 'Success'">
          <v-card-title class="headline">
            Success
            <v-spacer></v-spacer>
            <v-icon color="green" x-large>mdi-database-arrow-left</v-icon>
          </v-card-title>
          <v-card-text class="font-weight-black text-center green--text">
            <p class="text-h4">0</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="4" xs="12">
        <v-card @click="statusType = 'Failed'">
          <v-card-title class="headline">
            Failed
            <v-spacer></v-spacer>
            <v-icon color="red" x-large>mdi-database-remove-outline</v-icon>
          </v-card-title>
          <v-card-text class="font-weight-black text-center red--text">
            <p class="text-h4">0</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
export default {
  data() {
    return {
      statusType: "",
    };
  },
};
</script>
