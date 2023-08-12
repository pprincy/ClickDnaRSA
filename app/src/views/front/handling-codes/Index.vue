<!-- #7 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="handlingCodes"
      :search="search"
      :loading="handlingCodesLoader"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Special Handling Codes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
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
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Name"
                          :rules="[
                            (v) => (v && !!v.trim()) || 'Name is required.',
                          ]"
                          class="required"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
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
                      <v-col cols="6">
                        <v-file-input
                          v-model="fileInput"
                          accept="image/png, image/jpeg"
                          label="Upload Icon"
                        ></v-file-input>
                      </v-col>
                      <v-col cols="6">
                        <v-switch
                          v-model="editedItem.active"
                          label="Status"
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
      <template v-slot:[`item.icon`]="{ item }">
        <img
          :src="item.icon | assetURL"
          :alt="item.name"
          width="50"
          class="my-2"
        />
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
        text: "Icon",
        value: "icon",
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
      },
    ],
    editedIndex: -1,
    editedItem: {
      name: null,
      description: null,
      icon: null,
      active: true,
    },
    defaultItem: null,
    handlingCodes: [],
    handlingCodesLoader: false,
    search: null,
    saveLoader: false,
    deleteLoader: false,
    fileInput: null,
    statusLoader: false,
    _timerId: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Create Special Handling Code"
        : "Edit Special Handling Code";
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
    this.fetchSpHandlingCodes();
  },

  methods: {
    ...mapActions([
      "getSpHandlingCodes",
      "createSpHandlingCode",
      "updateSpHandlingCode",
      "deleteSpHandlingCode",
      "snackBar",
    ]),
    fetchSpHandlingCodes() {
      this.handlingCodes = [];
      this.handlingCodesLoader = true;
      this.getSpHandlingCodes()
        .then((res) => {
          this.handlingCodesLoader = false;
          this.handlingCodes = res.data;
        })
        .catch(() => {
          this.handlingCodesLoader = false;
        });
    },
    editItem(item) {
      this.editedIndex = this.handlingCodes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.handlingCodes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteLoader = true;
      this.deleteSpHandlingCode(this.handlingCodes[this.editedIndex].id)
        .then((res) => {
          this.deleteLoader = false;
          this.handlingCodes.splice(this.editedIndex, 1);
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
      this.handlingCodes[this.editedIndex].active =
        !this.handlingCodes[this.editedIndex].active;
      this.reset();
    },

    collectFormData() {
      const payload = new FormData();
      for (const field in this.editedItem) {
        if (field === "icon") continue;
        payload.append(
          field,
          this.editedItem[field] === null ? "" : this.editedItem[field]
        );
      }
      if (this.fileInput) {
        payload.append("icon", this.fileInput);
        this.editedItem.icon = URL.createObjectURL(this.fileInput);
      }
      return payload;
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const payload = this.collectFormData();
      this.saveLoader = true;
      if (this.editedIndex > -1) {
        this.updateSpHandlingCode({
          id: this.editedItem.id,
          formData: payload,
        })
          .then((res) => {
            Object.assign(
              this.handlingCodes[this.editedIndex],
              this.editedItem
            );
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
        this.createSpHandlingCode(payload)
          .then((res) => {
            this.fetchSpHandlingCodes();
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
      this.editedIndex = this.handlingCodes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogConfirm = true;
    },
    changeStatus() {
      this.statusLoader = true;
      const payload = this.collectFormData();
      this.updateSpHandlingCode({
        id: this.editedItem.id,
        formData: payload,
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
  },
};
</script>
