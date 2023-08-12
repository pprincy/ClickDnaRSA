<!-- #62 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="reports"
      :options.sync="options"
      :server-items-length="total"
      :search="search"
      :loading="reportsLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="12"
            md="8"
            sm="6"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              Dashboard / Reports
            </v-toolbar-title>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-btn
              color="primary"
              dark
              class="mr-4 float-right"
              @click="goToDetails(0)"
              v-if="userRole.code === 'AD'"
            >
              Create
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" sm="12" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              :items="searchItems"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.active`]="{ item }">
        <v-switch
          v-model="item.active"
          @change="confirmStatusChange(item)"
          disabled
        ></v-switch>
      </template>
      <template v-slot:[`item.type`]="{ item }">
        {{ getType(item.type) }}
      </template>
      <template v-slot:[`item.tool`]="{ item }">
        {{ getTool(item.tool) }}
      </template>
      <template v-slot:[`item.visible_to_client`]="{ item }">
        {{ item.visible_to_client ? "Yes" : "No" }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              @click="goToPreview(item.tile_id, item.name)"
              icon
            >
              <v-icon small> mdi-eye </v-icon>
            </v-btn>
          </template>
          <span>Preview</span>
        </v-tooltip>
        <v-tooltip v-if="userRole.code === 'AD'" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click="goToDetails(item.id)" icon>
              <v-icon small> mdi-pencil </v-icon>
            </v-btn>
          </template>
          <span>Edit</span>
        </v-tooltip>
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
import { mapActions, mapGetters } from "vuex";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";
import Search from "@/components/front/common/Search";
import { reportTypes, reportTools } from "@/config/data";

export default {
  components: {
    Search,
    ConfirmDialog,
  },

  computed: {
    ...mapGetters(["userRole"]),
    searchItems() {
      return this.searchType === "tool" ? reportTools : reportTypes;
    },
  },

  data: () => ({
    dialogConfirm: false,
    search: "",
    searchType: "name",
    searchOptions: [
      {
        text: "Client Name",
        value: "client_name",
      },
      {
        text: "Type",
        value: "type",
      },
      {
        text: "Dashboard / Report Name",
        value: "name",
      },
      {
        text: "Tool",
        value: "tool",
      },
    ],
    headers: [
      {
        text: "Type of Client",
        value: "client_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Client Name",
        value: "client_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Type",
        value: "type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Dashboard / Report Name",
        value: "name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Tool",
        value: "tool",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Visible to Client",
        value: "visible_to_client",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Status",
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
      type: null,
      name: null,
      description: null,
      active: null,
    },
    defaultItem: null,
    reports: [],
    options: {},
    total: 0,
    reportsLoader: false,
    statusLoader: false,
  }),

  watch: {
    options: {
      handler() {
        this.fetchDReports();
      },
      deep: true,
    },
    search() {
      this.fetchDReports();
    },
    searchType() {
      if (this.search) this.fetchDReports();
    },
  },

  methods: {
    ...mapActions(["getDReports", "snackBar"]),

    getType(type) {
      return reportTypes.find((i) => i.value === type).text;
    },

    getTool(tool) {
      return reportTools.find((i) => i.value === tool).text;
    },

    fetchDReports() {
      this.reports = [];
      this.reportsLoader = true;
      this.getDReports({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.reportsLoader = false;
          this.reports = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.reportsLoader = false;
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
      this.reports[this.editedIndex].active =
        !this.reports[this.editedIndex].active;
      this.reset();
    },

    confirmStatusChange(item) {
      this.editedIndex = this.reports.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogConfirm = true;
    },

    changeStatus() {
      this.statusLoader = true;
      this.updateDReport({
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
        name: "DashBoardsReportsDetails",
        params: {
          id,
        },
      });
    },

    goToPreview(id, name) {
      this.$router.push({
        name: "DashBoardsReportsPreview",
        params: {
          id,
        },
        query: {
          name,
        },
      });
    },
  },
};
</script>
