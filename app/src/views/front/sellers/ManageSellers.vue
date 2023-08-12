<!-- #54 -->
<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="sellers"
      :options.sync="options"
      :server-items-length="total"
      :loading="sellersLoader"
    >
      <template v-slot:top>
        <v-row class="mt-0">
          <v-col
            cols="9"
            class="d-flex flex-column align-left justify-center pt-0"
          >
            <v-toolbar-title class="pl-4 text-h6"
              >Manage Sellers</v-toolbar-title
            >
          </v-col>
          <v-col cols="3" class="d-flex justify-end pt-0">
            <v-btn
              color="primary"
              :loading="sellersLoader"
              @click="downloadManageSellersDetails()"
              >Download</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0">
            <Search
              :search-options="searchOptions"
              :val="searchType"
              @changeText="(res) => (search = res)"
              @changeType="(res) => (searchType = res)"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        {{ item.created_at | localMoment | moment("DD MMM, YYYY hh:mm A") }}
      </template>
      <template v-slot:[`item.active`]="{ item }">
        <v-switch
          v-model="item.active"
          @change="confirmStatusChange(item)"
        ></v-switch>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
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
              @click="openCRMDetails(item)"
            >
              mdi-microsoft-dynamics-365
            </v-icon>
          </template>
          <span>Microsoft 365</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      max-width="500px"
      @keydown.esc="close"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.name"
                    label="Recepient Name"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.legal_name"
                    label="Legal Name"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.legal_address"
                    label="Legal Address"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.legal_postal_code"
                    label="Legal Postal Code"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.email"
                    label="Email Address"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.phone_number"
                    label="Phone Number"
                    type="tel"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.job_title"
                    label="Job Title"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.signatory_name"
                    label="Signatory Name"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.country_name"
                    label="Country Name"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
                    label="Country"
                    :items="allCountries"
                    v-model="editedItem.country_code"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <v-switch
                    v-model="editedItem.active"
                    label="Status"
                    disabled
                  ></v-switch>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save" :loading="saveLoader">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    <CRMDetails
      :dialog="dialogCRM"
      :seller-data="editedItem"
      @close="dialogCRM = false"
    />
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import Search from "@/components/front/common/Search";
import { countries } from "@/config/data";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";
import CRMDetails from "@/views/front/sellers/CRMDetails";

export default {
  components: {
    Search,
    ConfirmDialog,
    CRMDetails,
  },
  computed: {
    allCountries() {
      return Object.keys(countries).map((i) => {
        return {
          text: countries[i],
          value: i,
        };
      });
    },
  },
  data() {
    return {
      sellers: [],
      headers: [
        {
          text: "Actions",
          value: "actions",
          class: "body-1 font-weight-bold",
          width: "120px",
          sortable: false,
        },
        {
          text: "Recipient Name",
          value: "name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Country",
          value: "country_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Legal Name",
          value: "legal_name",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Email",
          value: "email",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Active?",
          value: "active",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Created At",
          value: "created_at",
          class: "body-1 font-weight-bold",
        },
      ],
      searchOptions: [
        {
          text: "Country",
          value: "country_name",
        },
        {
          text: "Seller Name",
          value: "name",
        },
        {
          text: "Email",
          value: "email",
        },
      ],
      total: 0,
      sellersLoader: false,
      search: null,
      options: {},
      searchType: null,
      dialogConfirm: false,
      statusLoader: false,
      dialogInvite: false,
      inviteLoader: false,
      dialog: false,
      editedIndex: -1,
      editedItem: {
        id: null,
        name: null,
        country_name: null,
        email: null,
        legal_name: true,
        active: true,
      },
      saveLoader: false,
      dialogCRM: false,
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    options: {
      handler() {
        this.fetchSellers();
      },
      deep: true,
    },
    search() {
      this.fetchSellers();
    },
    searchType() {
      if (this.search) this.fetchSellers();
    },
  },

  methods: {
    ...mapActions([
      "getManageSellers",
      "changeSellerStatus",
      "sendSellerInvite",
      "updateManageSeller",
      "snackBar",
      "downloadManageSellers",
    ]),

    fetchSellers() {
      this.sellers = [];
      this.sellersLoader = true;
      this.getManageSellers({
        ...this.options,
        search: this.search,
        type: this.searchType,
        status: this.statusType,
      })
        .then((res) => {
          this.sellersLoader = false;
          this.sellers = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.sellersLoader = false;
        });
    },

    editItem(item) {
      this.editedIndex = this.sellers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },

    closeConfirm() {
      this.dialogConfirm = false;
      this.sellers[this.editedIndex].active =
        !this.sellers[this.editedIndex].active;
    },

    confirmStatusChange(item) {
      this.editedIndex = this.sellers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogConfirm = true;
    },

    changeStatus() {
      this.statusLoader = true;
      this.changeSellerStatus({
        id: this.editedItem.id,
        state: this.editedItem.active,
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

    inviteClient(item) {
      this.editedIndex = this.sellers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogInvite = true;
    },

    openCRMDetails(item) {
      this.editedIndex = this.sellers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogCRM = true;
    },

    sendInvite() {
      this.inviteLoader = true;
      this.sendSellerInvite({
        seller_ids: [this.editedItem.id],
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

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      delete this.editedItem.country_name;
      this.updateManageSeller({
        id: this.editedItem.id,
        data: this.editedItem,
      })
        .then((res) => {
          this.fetchSellers();
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
    downloadManageSellersDetails() {
      this.sellersLoader = true;
      this.downloadManageSellers()
        .then((res) => {
          this.fileDownload(res);
          this.sellersLoader = false;
        })
        .catch(() => {
          this.sellersLoader = false;
        });
    },
  },
};
</script>
