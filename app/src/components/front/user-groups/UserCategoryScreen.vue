<template>
  <v-col class="mx-4">
    <v-data-table
      :headers="headers"
      :items="allUserCategoryScreen"
      :loading="loader"
      :options.sync="options"
      :server-items-length="total"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row>
          <v-col md="8">
            <v-toolbar flat>
              <v-toolbar-title>Screens</v-toolbar-title>
            </v-toolbar>
          </v-col>
          <v-col md="4">
            <v-btn
              color="primary"
              dark
              class="mb-2 mr-2 float-right"
              :loading="saveLoader"
              @click="saveUserCategoryScreen()"
            >
              Save
            </v-btn>

            <v-select
              v-model="user_category"
              label="User Category"
              :rules="[(v) => (v !== '' && v !== null) || 'Type is required.']"
              class="required float-right"
              item-text="value"
              item-value="id"
              :items="userTypes"
              @change="fetchUserCategoryList()"
            ></v-select>
          </v-col>
        </v-row>

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
      <!-- <template v-slot:item.RSA="{ item }">
        <v-simple-checkbox v-model="item.RSA"></v-simple-checkbox>
      </template>
      <template v-slot:item.Client="{ item }">
        <v-simple-checkbox v-model="item.Client"></v-simple-checkbox>
      </template>
      <template v-slot:item.Seller="{ item }">
        <v-simple-checkbox v-model="item.Seller"></v-simple-checkbox>
      </template> -->
    </v-data-table>
  </v-col>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userTypes"]),
  },
  data() {
    return {
      headers: [
        {
          text: "Screens",
          value: "name",
          class: "body-1 font-weight-bold",
        },
        // {
        //   text: "RSA",
        //   value: "RSA",
        //   class: "body-1 font-weight-bold",
        // },
        // {
        //   text: "Client",
        //   value: "Client",
        //   class: "body-1 font-weight-bold",
        // },
        // {
        //   text: "Seller",
        //   value: "Seller",
        //   class: "body-1 font-weight-bold",
        // },
      ],
      timerId: null,
      total: 0,
      options: {},
      allUserCategoryScreen: [],
      loader: false,
      search: null,
      saveLoader: false,
      user_category: "",
    };
  },
  watch: {
    options: {
      handler() {
        this.fetchUserCategoryScreen();
      },
      deep: true,
    },
    search() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.fetchUserCategoryScreen();
      }, 300);
    },
  },

  created() {
    this.fetchUserCategoryScreen();
    this.getUserTypes();
  },

  methods: {
    ...mapActions([
      "getUserCategoryScreen",
      "saveUserCategoryScreenList",
      "getUserTypes",
    ]),
    fetchUserCategoryScreen() {
      this.loader = true;
      this.getUserCategoryScreen({
        ...this.options,
        search: this.search,
      })
        .then((res) => {
          this.loader = false;
          this.allUserCategoryScreen = res.data.records.screen;
          this.total = res.data.total;
        })
        .catch(() => {
          this.loader = false;
        });
    },

    saveUserCategoryScreen() {
      this.saveLoader = true;
      const payload = new FormData();
      payload.append("RSA", this.RSA);
      payload.append("Client", this.Client);
      payload.append("Seller", this.Seller);
      this.saveUserCategoryScreenList(payload)
        .then(() => {
          this.saveLoader = false;
          this.dialog = false;
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
  },
};
</script>
