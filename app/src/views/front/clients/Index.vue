<!-- #47 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="clients"
      :search="search"
      :loading="clientsLoader"
      :options.sync="options"
      :server-items-length="total"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Manage Clients</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="650px"
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
                          label="Client Name"
                          :rules="[
                            (v) =>
                              (v && !!v.trim()) || 'Client name is required.',
                          ]"
                          class="required"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.contact_name"
                          label="Contact Name"
                          :rules="[
                            (v) =>
                              (v && !!v.trim()) || 'Contact name is required.',
                          ]"
                          class="required"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          type="email"
                          v-model="editedItem.email"
                          label="Email"
                          :rules="[
                            (v) =>
                              (v && !!v.trim()) || 'Email address is required',
                            (v) =>
                              /.+@.+\..+/.test(v) ||
                              'E-mail address must be valid',
                          ]"
                          class="required"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete
                          label="Country"
                          :items="allCountries"
                          v-model="editedItem.country_code"
                          :rules="[(v) => !!v || 'Country is required.']"
                          class="required"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.authorization_key"
                          label="Authorization Key"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" v-if="editedIndex !== -1">
                        <v-text-field
                          v-model="editedItem.account_number_code"
                          label="Account Number"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="d-flex">
                        <v-text-field
                          type="number"
                          v-model="editedItem.range_limit"
                          label="Range Limit"
                          class="mr-1 required"
                          :rules="[(v) => !!v || 'Range limit is required.']"
                        ></v-text-field>
                        <v-text-field
                          type="number"
                          v-model="editedItem.min_utilization"
                          label="Min. Utilization"
                          class="ml-1 required"
                          :rules="[
                            (v) => !!v || 'Min. Utilization is required.',
                          ]"
                        >
                          <span slot="prepend-inner">%</span>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete
                          label="Service"
                          :items="allClientServices"
                          v-model="editedItem.service"
                          :rules="[(v) => !!v || 'Service is required.']"
                          class="required"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.crm_value"
                          label="CRM Append Variable"
                          class="required"
                          :rules="[
                            (v) => (v && !!v.trim()) || 'Field is required.',
                            (v) =>
                              /^[a-zA-Z0-9\-]*$/.test(v) ||
                              'Only text, number or hyphen are allowed',
                            (v) =>
                              (v && v.length <= 5) ||
                              'Maximum 5 characters are allowed',
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.url_value"
                          label="URL Naming Convention"
                          class="required"
                          :rules="[
                            (v) => (v && !!v.trim()) || 'Field is required.',
                            (v) =>
                              /^[a-zA-Z0-9\-]*$/.test(v) ||
                              'Only text, number or hyphen are allowed',
                            (v) =>
                              (v && v.length <= 20) ||
                              'Maximum 20 characters are allowed',
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-switch
                          v-model="editedItem.active"
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
          v-model="item.active"
          @change="confirmStatusChange(item)"
        ></v-switch>
      </template>
      <template v-slot:[`item.range_limit`]="{ item }">
        {{ item.range_limit | numFormat }}
      </template>
      <template v-slot:[`item.min_utilization`]="{ item }">
        {{ item.min_utilization | numFormat }}%
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="inviteClient(item)"
            >
              mdi-email
            </v-icon>
          </template>
          <span>Send Invitation</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Edit</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              small
              v-bind="attrs"
              v-on="on"
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Delete</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              small
              v-bind="attrs"
              v-on="on"
              @click="goToMapping(item)"
            >
              mdi-arrow-left-right
            </v-icon>
          </template>
          <span>Product Code and HS Code mapping</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon small v-bind="attrs" v-on="on" @click="goToMapSeller(item)">
              mdi-plus
            </v-icon>
          </template>
          <span>Map Sellers</span>
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
    <ConfirmDialog
      :dialog="dialogInvite"
      text="Are you sure want to send invitation email?"
      :loader="inviteLoader"
      @confirm="sendInvite"
      @close="dialogInvite = false"
    />
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { countries, clientServices } from "@/config/data";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";

export default {
  components: {
    ConfirmDialog,
  },
  computed: {
    ...mapGetters(["trackCategories"]),
    formTitle() {
      return this.editedIndex === -1 ? "Create" : "Edit";
    },
    allCountries() {
      return Object.keys(countries).map((i) => {
        return {
          text: countries[i],
          value: i,
        };
      });
    },
    allClientServices() {
      return Object.keys(clientServices).map((i) => {
        return {
          text: clientServices[i],
          value: i,
        };
      });
    },
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogConfirm: false,
    headers: [
      {
        text: "Client Name",
        value: "name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Account Number",
        value: "account_number_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Limit",
        value: "range_limit",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Min Utilization",
        value: "min_utilization",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Contact Name",
        value: "contact_name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Email",
        value: "email",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Country",
        value: "country_code",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Active?",
        value: "active",
        class: "body-1 font-weight-bold",
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
      country_code: "",
      active: true,
      email: null,
    },
    defaultItem: null,
    clients: [],
    options: {},
    total: 0,
    clientsLoader: false,
    search: null,
    saveLoader: false,
    deleteLoader: false,
    statusLoader: false,
    dialogInvite: false,
    inviteLoader: false,
  }),

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
    options: {
      handler() {
        this.fetchClients();
      },
      deep: true,
    },
    search() {
      this.fetchClients();
    },
  },

  created() {
    this.defaultItem = Object.assign({}, this.editedItem);
  },

  methods: {
    ...mapActions([
      "getClients",
      "createClient",
      "updateClient",
      "deleteClient",
      "sendClientInvite",
      "snackBar",
    ]),

    fetchClients() {
      this.clients = [];
      this.clientsLoader = true;
      this.getClients({
        ...this.options,
        search: this.search,
      })
        .then((res) => {
          this.clientsLoader = false;
          this.clients = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.clientsLoader = false;
        });
    },

    editItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    inviteClient(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogInvite = true;
    },

    deleteItemConfirm() {
      this.deleteLoader = true;
      this.deleteClient(this.clients[this.editedIndex].id)
        .then((res) => {
          this.deleteLoader = false;
          this.clients.splice(this.editedIndex, 1);
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
      this.clients[this.editedIndex].active = this.clients[this.editedIndex]
        .active
        ? false
        : true;
      this.reset();
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      if (this.editedIndex > -1) {
        this.updateClient({
          id: this.editedItem.id,
          data: this.editedItem,
        })
          .then((res) => {
            this.fetchClients();
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
        this.createClient(this.editedItem)
          .then((res) => {
            this.fetchClients();
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
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogConfirm = true;
    },

    changeStatus() {
      this.statusLoader = true;
      this.updateClient({
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

    sendInvite() {
      this.inviteLoader = true;
      this.sendClientInvite({
        client_ids: [this.editedItem.id],
      })
        .then((res) => {
          this.inviteLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.dialogInvite = false;
        })
        .catch(() => {
          this.inviteLoader = false;
        });
    },

    goToMapping(item) {
      this.$router.push({
        name: "ProductHSCodeMap",
        params: {
          id: item.id,
        },
        query: {
          name: item.name,
        },
      });
    },

    goToMapSeller(item) {
      this.$router.push({
        name: "MapSellers",
        params: {
          id: item.id,
        },
        query: {
          name: item.name,
        },
      });
    },
  },
};
</script>
