<!-- #85 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="docList"
      :options.sync="options"
      :server-items-length="total"
      :loading="pgImportExportDocLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="6"
            md="6"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6">
              Logistics Docs
            </v-toolbar-title>
          </v-col>
          <v-col cols="6" md="6" class="d-flex justify-end pt-0">
            <v-btn
              color="primary"
              :loading="pgImportExportDocLoader"
              @click="downloadImportExportDocDetails()"
              >Download</v-btn
            >
            <v-dialog
              v-model="dialog"
              max-width="650px"
              @keydown.esc="close"
              persistent
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2 mx-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="fetchClientList()"
                >
                  Create
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Upload Logistic Doc</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-form ref="form">
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-autocomplete
                            v-model="selectedClient"
                            :items="clients"
                            :loading="clientLoader"
                            hide-no-data
                            hide-details
                            item-text="name"
                            item-value="id"
                            label="Select Client"
                            placeholder="Start typing to Search"
                            class="required"
                            :rules="[(v) => !!v || 'Please select client']"
                            return-object
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-autocomplete
                            v-model="editedItem.country_code"
                            :items="allCountries"
                            label="Select Country"
                            placeholder="Start typing to Search"
                            :rules="[(v) => !!v || 'Country is required.']"
                            class="required"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-file-input
                            v-model="file_name"
                            counter
                            show-size
                            accept=".doc"
                            label="Select your Doc file"
                            :rules="[
                              (v) => !!v || 'Doc file is required.',
                              (v) =>
                                !v ||
                                v.size < 2097152 ||
                                `File size should be less than 2 MB!`,
                              (v) =>
                                !v ||
                                [
                                  'application/msword',
                                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                ].includes(v.type) ||
                                `Doc file is required`,
                            ]"
                            class="required"
                          >
                          </v-file-input>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            v-model="doc_type"
                            label="Doc Type"
                            :items="docTypeList"
                            class="required"
                            :rules="[
                              (v) => v >= 0 || 'Please select an option',
                            ]"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                    :loading="saveLoader"
                  >
                    {{ editedIndex === -1 ? "Create" : "Update" }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              :items="statusDocItems"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <span v-if="item.created_at">{{
          item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.modified_at`]="{ item }">
        <span v-if="item.modified_at">{{
          item.modified_at | localMoment | moment("DD MMM, YYYY hh:mm A")
        }}</span>
      </template>
      <template v-slot:[`item.doc_status`]="{ item }">
        <v-switch
          v-model="item.doc_status"
          @change="confirmStatusChange(item)"
        ></v-switch>
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
import Search from "@/components/front/common/Search";
import { countries, docType, docStatuses } from "@/config/data";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";

export default {
  components: {
    Search,
    ConfirmDialog,
  },
  computed: {
    ...mapGetters(["userCategory"]),
    allCountries() {
      return Object.keys(countries).map((i) => {
        return {
          text: countries[i],
          value: i,
        };
      });
    },
    docTypeList() {
      return Object.keys(docType).map((i) => {
        return {
          text: docType[i],
          value: i,
        };
      });
    },
    statusDocItems() {
      return this.searchType === "doc_type"
        ? Object.keys(docType).map((i) => {
            return {
              text: docType[i],
              value: i,
            };
          })
        : Object.keys(docStatuses).map((i) => {
            return {
              text: docStatuses[i],
              value: i,
            };
          });
    },
  },

  data: () => ({
    search: null,
    searchType: null,
    statusType: null,
    file_name: null,
    selectedClient: null,
    editedIndex: -1,
    saveLoader: false,
    clients: [],
    searchOptions: [
      {
        text: "Country",
        value: "country",
      },
      {
        text: "Client Name",
        value: "rsa_client",
      },
      {
        text: "Status",
        value: "doc_status",
      },
      {
        text: "Doc Type",
        value: "doc_type",
      },
    ],
    headers: [
      {
        text: "Client Name",
        value: "rsa_client",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Country",
        value: "country",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Doc Type",
        value: "doc_type",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Status",
        value: "doc_status",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Created At ",
        value: "created_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Created By ",
        value: "created_by",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Modified At",
        value: "modified_at",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Modified By",
        value: "modified_by",
        class: "body-1 font-weight-bold",
      },
    ],
    editedItem: {
      country_code: "",
      doc_status: null,
      id: null,
    },
    docList: [],
    options: {},
    total: 0,
    pgImportExportDocLoader: false,
    statusLoader: false,
    dialog: false,
    dialogConfirm: false,
    clientLoader: false,
  }),

  watch: {
    options: {
      handler() {
        this.fetchImportExportDocList();
      },
      deep: true,
    },
    search() {
      this.fetchImportExportDocList();
    },
    searchType() {
      if (this.search) this.fetchImportExportDocList();
    },
  },

  methods: {
    ...mapActions([
      "getImportExportDocList",
      "downloadImportExportDoc",
      "changeDocListStatus",
      "uploadDocList",
      "getClients",
      "snackBar",
    ]),
    fetchImportExportDocList() {
      this.docList = [];
      this.pgImportExportDocLoader = true;
      this.getImportExportDocList({
        ...this.options,
        search: this.search,
        type: this.searchType,
      })
        .then((res) => {
          this.pgImportExportDocLoader = false;
          this.docList = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.pgImportExportDocLoader = false;
        });
    },
    downloadImportExportDocDetails() {
      this.pgImportExportDocLoader = true;
      this.downloadImportExportDoc()
        .then((res) => {
          this.fileDownload(res);
          this.pgImportExportDocLoader = false;
        })
        .catch(() => {
          this.pgImportExportDocLoader = false;
        });
    },
    fetchClientList() {
      if (this.clients.length) return;
      this.clientLoader = true;
      if (this.clients.length === 0 && this.userCategory.user_category === 3) {
        this.getClients({
          fields: "id,name",
          pagination: 0,
          service: "clickdna",
        })
          .then((res) => {
            this.clientLoader = false;
            this.clients = res.data;
          })
          .catch(() => {
            this.clientLoader = false;
          });
      }
    },
    close() {
      this.dialog = false;
      this.reset();
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      const payload = new FormData();
      payload.append("country_iso", this.editedItem.country_code);
      payload.append("data_file", this.file_name);
      payload.append("client_id", this.selectedClient.id);
      payload.append("doc_type", this.doc_type);
      this.uploadDocList(payload)
        .then((res) => {
          this.saveLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.close();
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
    confirmStatusChange(item) {
      this.editedIndex = this.docList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogConfirm = true;
    },

    closeConfirm() {
      this.dialogConfirm = false;
      this.docList[this.editedIndex].active =
        !this.docList[this.editedIndex].active;
    },

    changeStatus() {
      this.statusLoader = true;
      this.changeDocListStatus({
        id: this.editedItem.id,
        state: this.editedItem.doc_status ? "active" : "inactive",
      })
        .then((res) => {
          this.statusLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.dialogConfirm = false;
        })
        .catch(() => {
          this.statusLoader = false;
          this.closeConfirm();
        });
    },
  },
};
</script>
