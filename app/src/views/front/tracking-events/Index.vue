<!-- #13 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="events"
      :search="search"
      :loading="eventsLoader"
      hide-default-footer
      disable-pagination
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Manage Events</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            @keydown.esc="close"
            max-width="800px"
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
                          v-model="editedItem.event_name"
                          label="Event Name"
                          :rules="[
                            (v) =>
                              (v && !!v.trim()) || 'Event name is required.',
                          ]"
                          class="required"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete
                          v-model="editedItem.category_id"
                          :items="trackCategories"
                          label="Category"
                          :rules="[(v) => !!v || 'Category is required.']"
                          item-key="id"
                          item-value="id"
                          item-text="name"
                          class="required"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.event_code"
                          label="Code"
                          :rules="[
                            (v) => (v && !!v.trim()) || 'Code is required.',
                          ]"
                          class="required"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="6">
                        <v-autocomplete
                          v-model="editedItem.scan_type_id"
                          :items="scans"
                          label="Mapped Scan"
                          item-key="id"
                          item-value="id"
                          item-text="name"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="6">
                        <v-textarea
                          v-model="editedItem.summary"
                          label="Description"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="6">
                        <v-switch
                          v-model.number="editedItem.visibility"
                          label="Is Private?"
                          true-value="internal"
                          false-value="public"
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
            :disabled="!events || !events.length"
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
      <template v-slot:[`item.visibility`]="{ item }">
        <v-switch
          v-model.number="item.visibility"
          @change="confirmStatusChange(item)"
          true-value="internal"
          false-value="public"
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
import { mapActions, mapGetters } from "vuex";
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
        text: "Name",
        value: "event_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Category",
        value: "category_name",
        class: "body-1 font-weight-bold",
        width: "180px",
      },
      { text: "Code", value: "event_code", class: "body-1 font-weight-bold" },
      {
        text: "Description",
        value: "summary",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Mapped Scan",
        value: "scan_type_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Is Private?",
        value: "visibility",
        class: "body-1 font-weight-bold",
        width: "180px",
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
      event_name: "",
      event_code: "",
      summary: "",
      visibility: "public",
      category_id: null,
    },
    defaultItem: null,
    events: [],
    options: {},
    total: 0,
    eventsLoader: false,
    search: null,
    saveLoader: false,
    deleteLoader: false,
    fileInput: null,
    statusLoader: false,
    scans: [],
  }),

  computed: {
    ...mapGetters(["trackCategories"]),
    formTitle() {
      return this.editedIndex === -1
        ? "Create Tracking Event"
        : "Edit Tracking Event";
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
    this.getTrackCategories();
    this.fetchTrackingEvents();
    this.fetchEntityScans();
  },

  methods: {
    ...mapActions([
      "getTrackCategories",
      "getTrackingEvents",
      "createTrackingEvent",
      "updateTrackingEvent",
      "deleteTrackingEvent",
      "getEntityScans",
      "snackBar",
    ]),

    fetchTrackingEvents() {
      this.events = [];
      this.eventsLoader = true;
      this.getTrackingEvents({
        ...this.options,
        search: this.search,
      })
        .then((res) => {
          this.eventsLoader = false;
          this.events = res.data;
        })
        .catch(() => {
          this.eventsLoader = false;
        });
    },

    fetchEntityScans() {
      this.getEntityScans({
        fields: "id,name",
        pagination: 0,
      }).then((res) => {
        this.scans = res.data;
      });
    },

    editItem(item) {
      this.editedIndex = this.events.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.events.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteLoader = true;
      this.deleteTrackingEvent(this.events[this.editedIndex].id)
        .then((res) => {
          this.deleteLoader = false;
          this.events.splice(this.editedIndex, 1);
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
      this.events[this.editedIndex].visibility =
        this.events[this.editedIndex].visibility === "internal"
          ? "public"
          : "internal";
      this.reset();
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      if (this.editedIndex > -1) {
        this.updateTrackingEvent({
          id: this.editedItem.id,
          formData: this.editedItem,
        })
          .then((res) => {
            this.fetchTrackingEvents();
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
        this.createTrackingEvent(this.editedItem)
          .then((res) => {
            this.fetchTrackingEvents();
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
      this.editedIndex = this.events.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogConfirm = true;
    },

    changeStatus() {
      this.statusLoader = true;
      this.updateTrackingEvent({
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
          [
            "Name",
            "Category",
            "Code",
            "Description",
            "Mapped Scan",
            "Is Private?",
          ],
          ...this.events.map((i) => {
            return [
              i.event_name,
              i.category_name,
              i.event_code,
              i.summary,
              i.scan_type_name,
              i.visibility ? "Yes" : "No",
            ];
          }),
        ],
        "Tracking Events"
      );
    },
  },
};
</script>
