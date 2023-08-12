<!-- #63 -->
<template>
  <v-col class="mx-4">
    <v-progress-linear
      :active="pageLoader"
      :indeterminate="pageLoader"
    ></v-progress-linear>
    <v-form ref="form" lazy-validation>
      <v-card :loading="pageLoader">
        <v-card-text>
          <v-row>
            <v-col cols="12" class="pb-0">
              <span class="body-1 font-weight-bold"
                >{{ +$route.params.id === 0 ? "Create" : "Edit" }} a Dashboard /
                Report
                <i class="caption red--text ml-4"> * required field</i>
              </span>
              <v-btn
                color="primary"
                dark
                class="mb-2 float-right"
                :loading="saveLoader"
                @click="save()"
              >
                Save
              </v-btn>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                v-model="reportDetails.type"
                label="Type"
                :rules="[
                  (v) => (v !== '' && v !== null) || 'Type is required.',
                ]"
                class="required"
                :items="reportTypes"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                v-model="reportDetails.user_category"
                label="User Category"
                :rules="[
                  (v) => (v !== '' && v !== null) || 'Type is required.',
                ]"
                class="required"
                item-text="value"
                item-value="id"
                :items="userTypes"
                @change="fetchRSAUserGroupList()"
              ></v-select>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
              v-if="reportDetails.user_category == 3"
            >
              <v-autocomplete
                v-model="reportDetails.user_group_id"
                :items="userGroup"
                :loading="userLoader"
                hide-no-data
                item-text="name"
                item-value="id"
                label="Select User Group"
                placeholder="Start typing to Search"
                :rules="[(v) => !!v || 'Please select a client.']"
                class="required"
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
              v-if="reportDetails.user_category != 3"
            >
              <v-select
                v-model="reportDetails.client_type_id"
                label="Type of Client"
                :rules="[(v) => !!v || 'Type of client is required.']"
                class="required"
                item-text="name"
                item-value="id"
                :items="clientTypes"
                @change="fetchClientList()"
              ></v-select>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
              v-if="reportDetails.user_category != 3"
            >
              <v-autocomplete
                v-model="reportDetails.client_id"
                :items="clients"
                :loading="clientLoader"
                hide-no-data
                item-text="name"
                item-value="id"
                label="Select client"
                placeholder="Start typing to Search"
                :rules="[(v) => !!v || 'Please select a client.']"
                class="required"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="reportDetails.name"
                label="Dashboard / Report Name"
                :rules="[
                  (v) =>
                    (v && !!v.trim()) || 'Dashboard / Report name is required.',
                ]"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                v-model="reportDetails.tool"
                label="Tool"
                :rules="[
                  (v) => (v !== '' && v !== null) || 'Tool is required.',
                ]"
                :items="reportTools"
                class="required"
              ></v-select>
            </v-col>
            <!-- <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="reportDetails.dashboard_id"
                label="Dashboard ID"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Dashboard ID is required.',
                ]"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="reportDetails.group_id"
                label="Group ID"
                :rules="[(v) => (v && !!v.trim()) || 'Group ID is required.']"
                class="required"
              ></v-text-field>
            </v-col> -->
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="reportDetails.tile_id"
                label="Tile ID"
                :rules="[(v) => (v && !!v.trim()) || 'Tile ID is required.']"
                class="required"
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="reportDetails.background"
                label="Background"
                :rules="[(v) => (v && !!v.trim()) || 'Background is required.']"
                class="required"
              ></v-text-field>
            </v-col> -->
            <v-col cols="12" md="4" sm="6">
              <v-select
                v-model="reportDetails.visible_to_client"
                label="Visible to Client"
                :rules="[
                  (v) => (v !== '' && v !== null) || 'Field is required.',
                ]"
                class="required"
                :items="[
                  {
                    text: 'Yes',
                    value: true,
                  },
                  {
                    text: 'No',
                    value: false,
                  },
                ]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-switch
                v-model="reportDetails.active"
                label="Active"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { reportTypes, reportTools } from "@/config/data";

export default {
  computed: {
    ...mapGetters(["clientTypes", "userTypes"]),
    reportTypes() {
      return reportTypes;
    },
    reportTools() {
      return reportTools;
    },
  },
  data() {
    return {
      pageLoader: false,
      saveLoader: false,
      reportDetails: {},
      clientLoader: false,
      userLoader: false,
      clients: [],
      userGroup: [],
    };
  },
  created() {
    if (+this.$route.params.id !== 0) {
      this.fetchDetails();
    }
    this.fetchClientList();
    this.fetchRSAUserGroupList();
    this.getClientTypes();
    this.getUserTypes();
  },
  methods: {
    ...mapActions([
      "snackBar",
      "getDReportDetails",
      "createDReport",
      "updateDReport",
      "getTypeClients",
      "getClients",
      "getClientTypes",
      "getRSAUserGroup",
      "getUserTypes",
    ]),

    // fetchClientList() {
    //   if (!this.reportDetails.client_type_id) return;
    //   this.clientLoader = true;
    //   this.getTypeClients(this.reportDetails.client_type_id)
    //     .then((res) => {
    //       this.clientLoader = false;
    //       this.clients = res.data;
    //     })
    //     .catch(() => {
    //       this.clientLoader = false;
    //     });
    // },

    fetchClientList() {
      if (!this.reportDetails.client_type_id) return;
      this.clientLoader = true;
      this.getClients({
        fields: "id,name",
        pagination: 0,
        service: this.reportDetails.client_type_id,
      })
        .then((res) => {
          this.clientLoader = false;
          this.clients = res.data;
        })
        .catch(() => {
          this.clientLoader = false;
        });
    },

    fetchRSAUserGroupList() {
      if (!this.reportDetails.user_category) return;
      this.userLoader = true;
      this.getRSAUserGroup({
        fields: "id,name",
        pagination: 0,
        service: this.reportDetails.user_category,
      })
        .then((res) => {
          this.userLoader = false;
          this.userGroup = res.data;
        })
        .catch(() => {
          this.userLoader = false;
        });
    },

    fetchDetails() {
      this.pageLoader = true;
      this.getDReportDetails(this.$route.params.id)
        .then((res) => {
          this.pageLoader = false;
          this.reportDetails = res.data;
          this.fetchClientList();
          this.fetchRSAUserGroupList();
        })
        .catch(() => {
          this.pageLoader = false;
        });
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      if (+this.$route.params.id !== 0) {
        this.updateDReport({
          id: this.$route.params.id,
          data: this.reportDetails,
        })
          .then((res) => {
            this.saveLoader = false;
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
          })
          .catch(() => {
            this.saveLoader = false;
          });
      } else {
        this.createDReport(this.reportDetails)
          .then((res) => {
            this.saveLoader = false;
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
            this.$router.replace({
              name: "DashBoardsReports",
            });
          })
          .catch(() => {
            this.saveLoader = false;
          });
      }
    },
  },
};
</script>
