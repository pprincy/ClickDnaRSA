<!-- #1 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="linehaul"
      :options.sync="options"
      :server-items-length="total"
      :search="search"
      :loading="linehaulLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Linehaul</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="addLinehaul()">
            Add Linehaul
          </v-btn>
          <ConfirmDialog
            :dialog="dialogDelete"
            text="Are you sure you want to delete this item?"
            :loader="deleteLoader"
            @confirm="deleteItemConfirm"
            @close="closeDelete"
          />
        </v-toolbar>
        <v-row class="justify-center">
          <v-col cols="10" class="mb-2">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search country name or code"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.client`]="{ item }">
        {{ item.client.name }}
      </template>
      <template v-slot:[`item.carrier`]="{ item }">
        <label
          ><strong>Last Mile:</strong>
          <span v-if="item.carrier.name.length == 0"> - </span>
          <span v-else>{{ item.carrier.name.toString() }}</span>
        </label>
        <br />
        <label
          ><strong>Transit Partner:</strong>
          <span v-if="item.transit_partner.name.length == 0"> - </span>
          <span v-else>{{ item.transit_partner.name.toString() }}</span>
        </label>
      </template>
      <template v-slot:[`item.origin_country`]="{ item }">
        <div class="d-flex align-center">
          <v-tooltip left class="d-flex align-center">
            <template v-slot:activator="{ on, attrs }">
              <img
                v-on="on"
                v-bind="attrs"
                :src="item.origin_country.flag_url | assetURL"
                :alt="item.origin_country.name"
                class="ma-3 country-logo"
              />
            </template>
            <span>{{ item.origin_country.name }}</span>
          </v-tooltip>
          <span class="text-uppercase">{{ item.origin_country.code }}</span>
        </div>
      </template>
      <template v-slot:[`item.destination_country`]="{ item }">
        <div class="d-flex align-center">
          <v-tooltip left class="d-flex align-center">
            <template v-slot:activator="{ on, attrs }">
              <img
                v-on="on"
                v-bind="attrs"
                :src="item.destination_country.flag_url | assetURL"
                :alt="item.destination_country.name"
                class="ma-3 country-logo"
              />
            </template>
            <span>{{ item.destination_country.name }}</span>
          </v-tooltip>
          <span class="text-uppercase">{{
            item.destination_country.code
          }}</span>
        </div>
      </template>
      <template v-slot:[`item.create_date`]="{ item }">
        {{ item.create_date | moment("DD MMM, YYYY hh:mm A") }}
      </template>
      <template v-slot:[`item.write_date`]="{ item }">
        {{ item.write_date | moment("DD MMM, YYYY hh:mm A") }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editLinehaul(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";

export default {
  components: {
    ConfirmDialog,
  },
  data: () => ({
    dialogDelete: false,
    headers: [
      {
        text: "Client Name",
        value: "client",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Carrier",
        value: "carrier",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Origin",
        value: "origin_country",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Destination",
        value: "destination_country",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
      {
        text: "Created At",
        value: "create_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Updated At",
        value: "write_date",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
      },
    ],
    linehaul: [],
    options: {},
    total: 1,
    linehaulLoader: false,
    editedIndex: -1,
    search: null,
    deleteLoader: false,
    _timerId: null,
  }),

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler() {
        this.fetchLineHaulList();
      },
      deep: true,
    },
    search() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.fetchLineHaulList();
      }, 300);
    },
  },
  methods: {
    ...mapActions(["getLinehaulList", "deleteLinehaulUIData", "snackBar"]),
    fetchLineHaulList() {
      this.linehaul = [];
      this.linehaulLoader = true;
      this.getLinehaulList({
        ...this.options,
        search: this.search,
      })
        .then((res) => {
          this.linehaulLoader = false;
          this.linehaul = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.linehaulLoader = false;
        });
    },
    addLinehaul() {
      this.$router.push({
        name: "LinehaulEdit",
        params: {
          id: 0,
        },
      });
    },

    editLinehaul(item) {
      this.$router.push({
        name: "LinehaulEdit",
        params: {
          id: item.id,
        },
      });
    },

    deleteItem(item) {
      this.editedIndex = this.linehaul.indexOf(item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteLoader = true;
      this.deleteLinehaulUIData(this.linehaul[this.editedIndex].id)
        .then((res) => {
          this.deleteLoader = false;
          this.linehaul.splice(this.editedIndex, 1);
          this.closeDelete();
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.deleteLoader = false;
        });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
    },
  },
};
</script>
