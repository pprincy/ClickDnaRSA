<!-- #27 -->
<template>
  <v-col>
    <v-data-table
      v-model="selectedUsers"
      :headers="headers"
      :items="users"
      :options.sync="options"
      :server-items-length="total"
      :search="search"
      :loading="usersLoader"
      class="elevation-1"
      item-key="id"
      show-select
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Users</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2 mr-2" @click="addUser(0)">
            Create User
          </v-btn>
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, i) in allUserStatuses"
                :key="i"
                @click="openConfirm(item)"
              >
                <v-list-item-title
                  >{{ item.text }} Selected Accounts</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
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
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          class="ma-1"
          :color="
            item.status === 'active'
              ? 'success'
              : item.status === 'suspend'
              ? 'warning'
              : 'error'
          "
        >
          {{ item.status | ucfirst }}
        </v-chip>
      </template>
      <template v-slot:[`item.groups`]="{ item }">
        <v-chip class="ma-1" v-for="s in item.groups" :key="s.id">
          {{ s.name }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="inviteUser(item)"
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
              class="ml-2"
              v-bind="attrs"
              v-on="on"
              @click="addUser(item.id)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Edit</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <ConfirmDialog
      :dialog="dialogConfirm"
      :text="'Are you sure you want to ' + action.text + ' selected accounts?'"
      :loader="statusLoader"
      @confirm="confirmAction"
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
import { userStatuses } from "@/config/data";
import { mapActions } from "vuex";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";

export default {
  components: {
    ConfirmDialog,
  },
  computed: {
    allUserStatuses() {
      return Object.keys(userStatuses).map((i) => {
        return {
          text: userStatuses[i],
          value: i,
        };
      });
    },
  },
  data: () => ({
    dialogConfirm: false,
    statusLoader: false,
    headers: [
      {
        text: "Name",
        value: "name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Email",
        value: "email",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Account Status",
        value: "status",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Last Active",
        value: "last_login",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Group Access",
        value: "groups",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
      },
    ],
    users: [],
    options: {},
    total: 0,
    selectedUsers: [],
    usersLoader: false,
    search: null,
    action: {},
    _timerId: null,
    dialogInvite: false,
    inviteLoader: false,
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: "",
      email: null,
    },
  }),

  watch: {
    options: {
      handler() {
        this.fetchMembers();
      },
      deep: true,
    },
    search() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.fetchMembers();
      }, 300);
    },
  },

  methods: {
    ...mapActions([
      "getMembers",
      "createMember",
      "updateMember",
      "deleteMember",
      "changeMemberStatus",
      "sendUserInvite",
      "snackBar",
    ]),
    fetchMembers() {
      this.users = [];
      this.usersLoader = true;
      this.getMembers({
        ...this.options,
        search: this.search,
      })
        .then((res) => {
          this.usersLoader = false;
          this.users = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.usersLoader = false;
        });
    },

    addUser(id) {
      this.$router.push({
        name: "UserCreate",
        params: {
          id: id,
        },
      });
    },

    openConfirm(action) {
      if (this.selectedUsers.length === 0) {
        return this.snackBar({
          color: "error",
          message: "Please select atleast one user",
        });
      }
      this.action = action;
      this.dialogConfirm = true;
    },

    closeConfirm() {
      this.dialogConfirm = false;
    },

    confirmAction() {
      this.statusLoader = true;
      this.changeMemberStatus({
        action: this.action.value,
        data: { user_ids: this.selectedUsers.map((i) => i.id) },
      })
        .then((res) => {
          this.statusLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.dialogConfirm = false;
          this.selectedUsers = [];
          this.fetchMembers();
        })
        .catch(() => {
          this.statusLoader = false;
          this.closeConfirm();
        });
    },

    inviteUser(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogInvite = true;
    },

    sendInvite() {
      this.inviteLoader = true;
      this.sendUserInvite({
        user_ids: [this.editedItem.id],
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
  },
};
</script>
