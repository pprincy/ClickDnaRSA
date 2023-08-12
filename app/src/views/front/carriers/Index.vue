<!-- #3 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="carriers"
      :loading="loader"
      :search="search"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Carriers</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-row class="justify-center">
          <v-col cols="10" class="mb-2">
            <v-text-field
              v-model="search"
              label="Search"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.carrier_logo="{ item }">
        <img
          :src="item.carrier_logo | assetURL"
          :alt="item.name"
          class="ma-3 carrier-logo"
        />
      </template>
      <template v-slot:item.website="{ item }">
        <a
          :href="item.website"
          target="_blank"
          rel="noopener noreferrer"
          v-if="item.website"
          >{{ item.website }}</a
        >
      </template>
      <template v-slot:item.active="{ item }">
        <v-switch
          v-model="item.active"
          @change="confirmStatusChange(item)"
        ></v-switch>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editCarrier(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          small
          class="mr-2"
          @click="uploadCarrier(item)"
          v-if="item.active"
        >
          mdi-upload
        </v-icon>
      </template>
    </v-data-table>
    <ConfirmDialog
      :dialog="dialogConfirm"
      text="Are you sure want to change status?"
      :loader="statusLoader"
      @confirm="changeStatus"
      @close="closeConfirm"
    />
    <RemoveLinehaul
      :dialog="remvLinehaul"
      :carrierId="carrierId"
      @close="remvLinehaul = false"
    />
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";
import RemoveLinehaul from "@/views/front/carriers/RemoveLinehaul";

export default {
  components: {
    ConfirmDialog,
    RemoveLinehaul,
  },
  data: () => ({
    headers: [
      {
        text: "Company",
        value: "name",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Email",
        value: "contact_email",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Contact",
        value: "phone_number",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Website",
        value: "website",
        class: "body-1 font-weight-bold",
      },
      { text: "API", value: "service_url", class: "body-1 font-weight-bold" },
      {
        text: "Logo",
        value: "carrier_logo",
        align: "center",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Environment",
        value: "service_mode",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Active?",
        value: "active",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
      },
    ],
    carriers: [],
    editedIndex: -1,
    editedItem: {
      name: null,
      active: true,
    },
    search: null,
    dialogConfirm: false,
    loader: false,
    statusLoader: false,
    remvLinehaul: false,
    carrierId: null,
  }),

  created() {
    this.fetchCarriers();
  },

  methods: {
    ...mapActions(["getCarriers", "changeCarrierStatus", "snackBar"]),

    fetchCarriers() {
      this.loader = true;
      this.getCarriers({
        pagination: 0,
      })
        .then((res) => {
          this.loader = false;
          this.carriers = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },

    closeConfirm() {
      this.dialogConfirm = false;
      this.carriers[this.editedIndex].active =
        !this.carriers[this.editedIndex].active;
    },

    confirmStatusChange(item) {
      this.carrierId = item.id;
      this.editedIndex = this.carriers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogConfirm = true;
    },

    changeStatus() {
      this.statusLoader = true;
      this.changeCarrierStatus({
        id: this.editedItem.id,
        state: this.editedItem.active ? "active" : "inactive",
      })
        .then((res) => {
          this.statusLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.remvLinehaul = true;

          this.dialogConfirm = false;
        })
        .catch(() => {
          this.remvLinehaul = true;
          this.statusLoader = false;
          this.closeConfirm();
        });
    },

    editCarrier(item) {
      this.$router.push({
        name: "CarrierEdit",
        params: {
          id: item.id,
        },
      });
    },

    uploadCarrier(item) {
      this.$router.push({
        name: "CarrierEventsUpload",
        params: {
          id: item.id,
          name: item.name,
        },
        query: { carrier_id: item.id },
      });
    },
  },
};
</script>
<style scoped>
.carrier-logo {
  max-width: 100px;
  height: 25px;
}
</style>
