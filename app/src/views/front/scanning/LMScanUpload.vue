<template>
  <v-col class="mx-4 py-0">
    <span class="text-h6 mr-auto mt-2 ml-2">Bulk Upload</span>
    <p class="mr-auto mt-2 ml-2">
      Bulk scan upload allows you upload a list of packages along with upto 5
      scans. As with the apply scan screen only certain scan are allowed for
      your role.
    </p>
    <v-tabs color="primary" right>
      <v-tab :to="{ name: 'LMScanUploadList' }">Bulk Scan Upload</v-tab>
      <v-tab :to="{ name: 'LMScanUploadTemplate' }">Explain Template</v-tab>
    </v-tabs>
    <div class="py-4">
      <router-view></router-view>
    </div>
  </v-col>
</template>
