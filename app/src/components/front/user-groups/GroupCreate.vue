<!-- #30 -->
<template>
  <v-form ref="form" lazy-validation>
    <v-card :loading="loader">
      <v-toolbar flat>
        <v-toolbar-title>
          <v-btn :to="{ name: 'GroupsList' }" text icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          {{ +$route.params.id === 0 ? "Create" : "Edit" }}
          Group
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save()" :loading="saveLoader" dark>
          save
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              label="Name"
              v-model="groupData.name"
              :rules="[(v) => (v && !!v.trim()) || 'Name is required.']"
              class="required"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Group Description"
              v-model="groupData.note"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="groupData.user_category"
              label="User Category"
              :rules="[(v) => (v !== '' && v !== null) || 'Type is required.']"
              class="required"
              item-text="value"
              item-value="id"
              :items="userTypes"
              @change="fetchScreens()"
            ></v-select>
          </v-col>
          <v-col v-if="groupData.user_category === 1">
            <v-autocomplete
              v-model="groupData.client_id"
              :items="clients"
              :loading="clientLoader"
              hide-no-data
              item-text="name"
              item-value="id"
              label="Select client"
              placeholder="Start typing to Search"
              @change="fetchClientList()"
            ></v-autocomplete>
          </v-col>
          <v-col v-if="groupData.user_category === 2">
            <v-autocomplete
              v-model="groupData.seller_id"
              :items="sellers"
              :loading="sellerLoader"
              hide-no-data
              item-text="name"
              item-value="id"
              label="Select Seller"
              placeholder="Start typing to Search"
              class="required"
              @change="fetchSellerList()"
              :rules="[(v) => !!v || 'Please select seller']"
            ></v-autocomplete>
          </v-col>
          <!-- <v-col>
            <v-switch
              label="Group Status"
              v-model="groupData.active"
            ></v-switch>
          </v-col> -->
        </v-row>
        <v-divider class="my-10"></v-divider>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary" dense dark flat>
                <v-toolbar-title>Screen Access</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-autocomplete
                  label="Select screens"
                  clearable
                  multiple
                  small-chips
                  deletable-chips
                  outlined
                  :items="allScreens"
                  v-model="groupData.screens"
                  item-key="id"
                  item-value="id"
                  item-text="name"
                ></v-autocomplete>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userTypes"]),
  },
  data() {
    return {
      groupData: {
        name: null,
        note: null,
        // active: true,
        screens: [],
      },
      allScreens: [],
      saveLoader: false,
      loader: false,
      clientLoader: false,
      clients: [],
      sellerLoader: false,
      sellers: [],
    };
  },
  created() {
    this.fetchClientList();
    this.fetchSellerList();
    this.getUserTypes();
    // this.fetchScreens();
    if (+this.$route.params.id !== 0) {
      this.fetchGroupDetails();
    }
  },
  methods: {
    ...mapActions([
      "getMemberGroupDetails",
      "createMemberGroup",
      "updateMemberGroup",
      "getScreens",
      "getUserTypes",
      "getClients",
      "getSellersActiveList",
      "snackBar",
    ]),

    fetchScreens() {
      this.getScreens({
        user_category: this.groupData.user_category,
      }).then((res) => {
        this.allScreens = res.data;
      });
    },
    fetchGroupDetails() {
      this.loader = true;
      this.getMemberGroupDetails(this.$route.params.id)
        .then((res) => {
          this.loader = false;
          const { id, name, note, active, screens, user_category } = res.data;
          this.groupData = { id, name, note, active, screens, user_category };
          this.fetchScreens();
          this.groupData.screens = this.groupData.screens.map((s) => s.id);
        })
        .catch(() => {
          this.loader = false;
        });
    },
    fetchClientList() {
      if (!this.groupData.user_category === 1) return;
      this.clientLoader = true;
      this.getClients({
        fields: "id,name",
        pagination: 0,
        active: this.groupData.user_category,
      })
        .then((res) => {
          this.clientLoader = false;
          this.clients = res.data;
        })
        .catch(() => {
          this.clientLoader = false;
        });
    },

    fetchSellerList() {
      if (!this.groupData.user_category === 2) return;
      this.sellerLoader = true;
      this.getSellersActiveList({
        // client_id: this.groupData.client_id,
        params: {
          fields: "id,name",
          pagination: 0,
          active: this.groupData.user_category,
        },
      })
        .then((res) => {
          this.sellerLoader = false;
          this.sellers = res.data;
        })
        .catch(() => {
          this.sellerLoader = false;
        });
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      let api;
      if (+this.$route.params.id === 0) {
        api = this.createMemberGroup(this.groupData);
      } else {
        api = this.updateMemberGroup({
          id: this.$route.params.id,
          data: this.groupData,
        });
      }
      this.saveLoader = true;
      api
        .then((res) => {
          this.saveLoader = false;
          if (+this.$route.params.id === 0) {
            this.$router.replace({
              name: "GroupsList",
            });
          }
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
  },
};
</script>
