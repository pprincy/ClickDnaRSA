<!-- #8 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="splitCodes"
      :options.sync="options"
      :server-items-length="total"
      :search="search"
      :loading="splitCodesLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Split Codes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            v-if="can('app_service_label_splitcode_create')"
            dark
            class="mb-2"
            @click="goToDetails(0)"
          >
            Create
          </v-btn>
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
      <template v-slot:[`item.active`]="{ item }">
        <v-switch
          v-model="item.active"
          @change="confirmStatusChange(item)"
        ></v-switch>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="goToDetails(item.id)">
          mdi-pencil
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
    dialogConfirm: false,
    headers: [
      {
        text: "Code",
        value: "code",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Code Name",
        value: "name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Description",
        value: "description",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Code Status",
        value: "active",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
        align: "center",
      },
    ],
    editedIndex: -1,
    editedItem: {
      code: null,
      name: null,
      description: null,
      active: null,
    },
    defaultItem: null,
    splitCodes: [],
    options: {},
    total: 0,
    splitCodesLoader: false,
    search: null,
    statusLoader: false,
    _timerId: null,
  }),

  watch: {
    options: {
      handler() {
        this.fetchSplitCodes();
      },
      deep: true,
    },
    search() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.fetchSplitCodes();
      }, 300);
    },
  },

  methods: {
    ...mapActions(["getSplitCodes", "updateSplitCode", "snackBar"]),
    fetchSplitCodes() {
      this.splitCodes = [];
      this.splitCodesLoader = true;
      this.getSplitCodes({
        ...this.options,
        search: this.search,
      })
        .then((res) => {
          this.splitCodesLoader = false;
          this.splitCodes = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.splitCodesLoader = false;
        });
    },
    reset() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeConfirm() {
      this.dialogConfirm = false;
      this.splitCodes[this.editedIndex].active =
        !this.splitCodes[this.editedIndex].active;
      this.reset();
    },
    confirmStatusChange(item) {
      this.editedIndex = this.splitCodes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogConfirm = true;
    },
    changeStatus() {
      this.statusLoader = true;
      this.updateSplitCode({
        id: this.editedItem.id,
        data: this.editedItem,
      })
        .then((res) => {
          this.statusLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.dialogConfirm = false;
          this.reset();
        })
        .catch(() => {
          this.statusLoader = false;
          this.closeConfirm();
        });
    },
    goToDetails(id) {
      this.$router.push({
        name: "SplitCodeDetails",
        params: {
          id,
        },
      });
    },
  },
};
</script>
