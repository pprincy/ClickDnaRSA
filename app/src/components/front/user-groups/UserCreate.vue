<!-- #29 -->
<template>
  <v-form ref="form" lazy-validation>
    <v-card :loading="loader">
      <v-toolbar flat>
        <v-toolbar-title>
          <v-btn :to="{ name: 'UsersList' }" text icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          {{ +$route.params.id !== 0 ? "Edit" : "Create" }}
          User
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
              v-model="userData.name"
              :rules="[(v) => (v && !!v.trim()) || 'Name is required.']"
              class="required"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Email"
              v-model="userData.email"
              :rules="[
                (v) => (v && !!v.trim()) || 'Email address is required',
                (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
              ]"
              class="required"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="userData.user_category"
              label="User Category"
              :rules="[(v) => (v !== '' && v !== null) || 'Type is required.']"
              class="required"
              item-text="value"
              item-value="id"
              :items="userTypes"
              @change="fetchGroups()"
            ></v-select>
          </v-col>
          <v-col v-if="userData.user_category === 1">
            <v-autocomplete
              v-model="userData.client_id"
              :items="clients"
              :loading="clientLoader"
              hide-no-data
              item-text="name"
              item-value="id"
              label="Select client"
              placeholder="Start typing to Search"
              @change="fetchClientList(), fetchGroups()"
            ></v-autocomplete>
          </v-col>
          <v-col v-if="userData.user_category === 2">
            <v-autocomplete
              v-model="userData.seller_id"
              :items="sellers"
              :loading="sellerLoader"
              hide-no-data
              item-text="name"
              item-value="id"
              label="Select Seller"
              placeholder="Start typing to Search"
              class="required"
              @change="fetchSellerList(), fetchGroups()"
              :rules="[(v) => !!v || 'Please select seller']"
            ></v-autocomplete>
          </v-col>
          <!-- <v-col>
            <v-select
              label="Account Status"
              v-model="userData.status"
              :items="allUserStatuses"
            ></v-select>
          </v-col> -->
          <v-col v-if="+$route.params.id !== 0 && userData.last_login">
            <strong>Last Active: </strong><br />
            Logged in on
            {{ userData.last_login | moment("DD MMMM YYYY at hh:mm A") }}
          </v-col>
        </v-row>
        <v-divider class="my-10"></v-divider>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary" dense dark flat>
                <v-toolbar-title>User Groups</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-autocomplete
                  label="Select groups"
                  clearable
                  multiple
                  small-chips
                  deletable-chips
                  outlined
                  :items="allGroups"
                  v-model="userData.groups"
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
// import { userStatuses } from "@/config/data";
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userTypes"]),

    // allUserStatuses() {
    //   return Object.keys(userStatuses).map((i) => {
    //     return {
    //       text: userStatuses[i],
    //       value: i,
    //     };
    //   });
    // },
  },
  data() {
    return {
      userData: {
        name: null,
        email: null,
        status: "active",
        groups: [],
      },
      allGroups: [],
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
    // this.fetchGroups();
    if (+this.$route.params.id !== 0) {
      this.fetchMemberDetails();
    }
  },
  methods: {
    ...mapActions([
      "getMemberDetails",
      "createMember",
      "updateMember",
      "getGroups",
      "getUserTypes",
      "getClients",
      "getSellersActiveList",
      "snackBar",
    ]),

    fetchGroups() {
      if (
        this.userData.user_category === 1 &&
        this.userData.client_id != undefined
      ) {
        this.getGroups({
          user_category: this.userData.user_category,
          client_id: this.userData.client_id,
        })
          .then((res) => {
            this.clientLoader = false;
            this.allGroups = res.data.data;
          })
          .catch(() => {
            this.clientLoader = false;
          });
      } else if (
        this.userData.user_category === 2 &&
        this.userData.seller_id != undefined
      ) {
        this.getGroups({
          user_category: this.userData.user_category,
          seller_id: this.userData.seller_id,
        })
          .then((res) => {
            this.clientLoader = false;
            this.allGroups = res.data.data;
          })
          .catch(() => {
            this.clientLoader = false;
          });
      } else if (this.userData.user_category === 3) {
        this.getGroups({
          user_category: this.userData.user_category,
        })
          .then((res) => {
            this.clientLoader = false;
            this.allGroups = res.data.data;
          })
          .catch(() => {
            this.clientLoader = false;
          });
      }
    },

    fetchMemberDetails() {
      this.loader = true;
      this.getMemberDetails(this.$route.params.id)
        .then((res) => {
          this.loader = false;
          const client_id = res.data.clientid;
          const seller_id = res.data.sellerid;
          const { id, name, email, status, groups, last_login, user_category } =
            res.data;
          this.userData = {
            id,
            name,
            email,
            status,
            groups,
            last_login,
            user_category,
            client_id,
            seller_id,
          };
          this.fetchGroups();
          this.userData.groups = this.userData.groups.map((s) => s.id);
        })
        .catch(() => {
          this.loader = false;
        });
    },

    fetchClientList() {
      if (!this.userData.user_category === 1) return;
      this.clientLoader = true;
      this.getClients({
        fields: "id,name",
        pagination: 0,
        active: this.userData.user_category,
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
      if (!this.userData.user_category === 2) return;
      this.sellerLoader = true;
      this.getSellersActiveList({
        // client_id: this.userData.client_id,
        params: {
          fields: "id,name",
          pagination: 0,
          // active: this.userData.user_category,
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
        api = this.createMember(this.userData);
      } else {
        api = this.updateMember({
          id: this.$route.params.id,
          data: this.userData,
        });
      }
      this.saveLoader = true;
      api
        .then((res) => {
          this.saveLoader = false;
          if (+this.$route.params.id === 0) {
            this.$router.replace({
              name: "UsersList",
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
