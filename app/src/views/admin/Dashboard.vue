<template>
  <v-row>
    <v-col cols="12" sm="12" xs="12" md="12">
      <v-row>
        <v-col cols="12" md="3" sm="3" xs="12">
          <v-card>
            <v-card-title class="headline">
              Total
              <v-spacer></v-spacer>
              <v-icon x-large>mdi-account-multiple</v-icon>
            </v-card-title>
            <v-card-text class="font-weight-black text-center">
              <p class="text-h4 info--text">10</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="3" xs="12">
          <v-card>
            <v-card-title class="headline">
              Approved
              <v-spacer></v-spacer>
              <v-icon color="green" x-large>mdi-account-multiple</v-icon>
            </v-card-title>
            <v-card-text class="font-weight-black text-center green--text">
              <p class="text-h4">5</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="3" xs="12">
          <v-card>
            <v-card-title class="headline">
              Pending
              <v-spacer></v-spacer>
              <v-icon color="orange" x-large>mdi-account-multiple</v-icon>
            </v-card-title>
            <v-card-text class="font-weight-black text-center orange--text">
              <p class="text-h4">3</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="3" xs="12">
          <v-card>
            <v-card-title class="headline">
              Rejected
              <v-spacer></v-spacer>
              <v-icon color="red" x-large>mdi-account-multiple</v-icon>
            </v-card-title>
            <v-card-text class="font-weight-black text-center red--text">
              <p class="text-h4">2</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
