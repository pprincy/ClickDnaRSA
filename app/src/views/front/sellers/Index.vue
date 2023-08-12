<template>
  <v-col class="mx-4 py-0">
    <v-tabs color="primary" right>
      <p class="text-h6 mr-auto mt-2 ml-2">Upload Seller List</p>
      <v-tab :to="{ name: 'SellersList' }">Upload Seller List</v-tab>
      <v-tab :to="{ name: 'SellersTemplate' }">Explain Template</v-tab>
    </v-tabs>
    <div class="py-4">
      <router-view></router-view>
    </div>
  </v-col>
</template>
