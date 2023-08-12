<!-- #28 -->
<template>
  <v-col>
    <v-data-table
      v-model="selectedGroups"
      :headers="headers"
      :items="groups"
      :search="search"
      :loading="groupsLoader"
      class="elevation-1"
      item-key="id"
      show-select
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Groups</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
            hide-details
          ></v-text-field>
          <v-btn color="primary" dark class="mb-2 mr-2" @click="addGroup(0)">
            Create Group
          </v-btn>
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, i) in allGroupStatuses"
                :key="i"
                @click="openConfirm(item)"
              >
                <v-list-item-title
                  >{{ item.text }} Selected Groups</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </template>
      <template v-slot:item.active="{ item }">
        <v-chip class="ma-1" :color="item.active ? 'success' : 'error'">
          {{ item.active ? "Active" : "Inactive" }}
        </v-chip>
      </template>
      <template v-slot:item.screens="{ item }">
        <v-chip class="ma-1" v-for="s in item.screens" :key="s.id"
          >{{ s.screen_id }} {{ s.name }}</v-chip
        >
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="addGroup(item.id)"> mdi-pencil </v-icon>
      </template>
    </v-data-table>
    <ConfirmDialog
      :dialog="dialogConfirm"
      :text="'Are you sure you want to ' + action.text + ' selected groups?'"
      :loader="statusLoader"
      @confirm="confirmAction"
      @close="closeConfirm"
    />
  </v-col>
</template>
<script>
import { groupStatuses } from "@/config/data";
import { mapActions } from "vuex";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";

export default {
  components: {
    ConfirmDialog,
  },
  computed: {
    allGroupStatuses() {
      return Object.keys(groupStatuses).map((i) => {
        return {
          text: groupStatuses[i],
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
        text: "Group Name",
        value: "name",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Number of Users",
        value: "no_of_users",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Group Status",
        value: "active",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Screen Access",
        value: "screens",
        class: "body-1 font-weight-bold",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "body-1 font-weight-bold",
      },
    ],
    groups: [],
    selectedGroups: [],
    groupsLoader: false,
    action: {},
    search: null,
  }),

  created() {
    this.fetchMemberGroups();
  },

  methods: {
    ...mapActions([
      "getMemberGroups",
      "createMemberGroup",
      "updateMemberGroup",
      "deleteMemberGroup",
      "changeMemberGroupStatus",
      "snackBar",
    ]),
    fetchMemberGroups() {
      this.groups = [];
      this.groupsLoader = true;
      this.getMemberGroups()
        .then((res) => {
          this.groupsLoader = false;
          this.groups = res.data;
        })
        .catch(() => {
          this.groupsLoader = false;
        });
    },

    addGroup(id) {
      this.$router.push({
        name: "GroupCreate",
        params: {
          id: id,
        },
      });
    },

    openConfirm(action) {
      if (this.selectedGroups.length === 0) {
        return this.snackBar({
          color: "error",
          message: "Please select atleast one group",
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
      this.changeMemberGroupStatus({
        action: this.action.value,
        data: { group_ids: this.selectedGroups.map((i) => i.id) },
      })
        .then((res) => {
          this.statusLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.dialogConfirm = false;
          this.selectedGroups = [];
          this.fetchMemberGroups();
        })
        .catch(() => {
          this.statusLoader = false;
          this.closeConfirm();
        });
    },
  },
};
</script>
