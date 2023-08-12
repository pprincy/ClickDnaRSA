<!-- #51 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="entityScans"
      :search="search"
      :loading="entityScansLoader"
      hide-default-footer
      disable-pagination
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Entity Scans </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="800px"
            @keydown.esc="close"
            persistent
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Create
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5"
                  >{{ formTitle }}
                  <i class="caption red--text ml-4"> * required field</i></span
                >
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form">
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Name"
                          :rules="[
                            (v) => (v && !!v.trim()) || 'Name is required.',
                          ]"
                          class="required"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-autocomplete
                          v-model="editedItem.rsa_tracking_id"
                          :items="rsaTrackings"
                          label="Tracking Status"
                          item-key="id"
                          item-value="id"
                          item-text="event_name"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="6">
                        <v-textarea
                          v-model="editedItem.description"
                          label="Description"
                          :rules="[
                            (v) =>
                              (v && !!v.trim()) || 'Description is required.',
                          ]"
                          class="required"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          type="number"
                          v-model="editedItem.sequence"
                          label="Sequence"
                          :rules="[(v) => !!v || 'Sequence is required.']"
                          class="required"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-switch
                          v-model.number="editedItem.active"
                          label="Active?"
                        ></v-switch>
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
          <v-btn
            color="info"
            dark
            class="ml-2 mb-2"
            @click="download()"
            :disabled="!entityScans || !entityScans.length"
          >
            Download
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
              label="Search"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.active`]="{ item }">
        <v-switch
          v-model.number="item.active"
          @change="confirmStatusChange(item)"
        ></v-switch>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
    dialog: false,
    dialogDelete: false,
    dialogConfirm: false,
    headers: [
      {
        text: "Sequence",
        value: "sequence",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Name",
        value: "name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Description",
        value: "description",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Tracking Status",
        value: "rsa_tracking_label",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Is Active?",
        value: "active",
        class: "body-1 font-weight-bold",
        width: "150px",
      },
      {
        text: "Actions",
        value: "actions",
        class: "body-1 font-weight-bold",
        sortable: false,
      },
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
      description: "",
      rsa_tracking_id: "",
      sequence: "",
      active: true,
    },
    defaultItem: null,
    entityScans: [],
    entityScansLoader: false,
    search: null,
    saveLoader: false,
    deleteLoader: false,
    statusLoader: false,
    rsaTrackings: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create Scan" : "Edit Scan";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      if (this.editedIndex === -1) {
        this.editedItem = Object.assign({}, this.defaultItem);
      }
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.defaultItem = Object.assign({}, this.editedItem);
    this.fetchEntityScans();
    this.fetchTrackingEvents();
  },

  methods: {
    ...mapActions([
      "getEntityScans",
      "createEntityScan",
      "updateEntityScan",
      "deleteEntityScan",
      "getTrackingEvents",
      "snackBar",
    ]),

    fetchEntityScans() {
      this.entityScans = [];
      this.entityScansLoader = true;
      this.getEntityScans({
        pagination: 0,
        fields:
          "id,name,description,sequence,active,rsa_tracking_id,rsa_tracking_label",
      })
        .then((res) => {
          this.entityScansLoader = false;
          this.entityScans = res.data;
        })
        .catch(() => {
          this.entityScansLoader = false;
        });
    },

    fetchTrackingEvents() {
      this.getTrackingEvents({
        fields: "id,event_name",
        pagination: 0,
      }).then((res) => {
        this.rsaTrackings = res.data;
      });
    },

    editItem(item) {
      this.editedIndex = this.entityScans.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.entityScans.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteLoader = true;
      this.deleteEntityScan(this.entityScans[this.editedIndex].id)
        .then((res) => {
          this.deleteLoader = false;
          this.entityScans.splice(this.editedIndex, 1);
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

    reset() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.$refs.form?.reset();
      });
    },

    close() {
      this.dialog = false;
      this.reset();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.reset();
    },

    closeConfirm() {
      this.dialogConfirm = false;
      this.entityScans[this.editedIndex].active =
        !this.entityScans[this.editedIndex].active;
      this.reset();
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      if (this.editedIndex > -1) {
        this.updateEntityScan({
          id: this.editedItem.id,
          formData: this.editedItem,
        })
          .then((res) => {
            this.fetchEntityScans();
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
      } else {
        this.createEntityScan(this.editedItem)
          .then((res) => {
            this.fetchEntityScans();
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
      }
    },

    confirmStatusChange(item) {
      this.editedIndex = this.entityScans.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogConfirm = true;
    },

    changeStatus() {
      this.statusLoader = true;
      this.updateEntityScan({
        id: this.editedItem.id,
        formData: this.editedItem,
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

    download() {
      this.downloadXLSX(
        [
          ["Sequence", "Name", "Description", "Tracking Status", "Is Active?"],
          ...this.entityScans.map((i) => {
            return [
              i.sequence,
              i.name,
              i.description,
              i.rsa_tracking_label,
              i.active ? "Yes" : "No",
            ];
          }),
        ],
        "Entity Scans"
      );
    },
  },
};
</script>
