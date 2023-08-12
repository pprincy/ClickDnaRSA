<template>
  <v-container fluid>
    <v-form ref="form">
      <v-toolbar flat>
        <v-toolbar-title
          ><span class="body-1 font-weight-bold"
            >You can subscribe to receive all proof of delivery event and
            support information to a callback URL.</span
          >
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark icon class="mb-2" @click="addItem()">
          <v-icon> mdi-plus </v-icon>
        </v-btn>
        <v-btn
          color="primary"
          dark
          class="mb-2 ml-2"
          :loading="saveLoader"
          @click="save()"
        >
          Save
        </v-btn>
      </v-toolbar>
      <v-row>
        <v-col cols="12">
          <v-card
            :loading="loader"
            class="mb-1"
            v-for="(item, i) in subscriptions"
            :key="i"
          >
            <v-card-text>
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-btn
                    v-if="subscriptions.length > 1"
                    @click="removeItem(item, i)"
                    class="px-2"
                    color="error"
                    icon
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-text-field
                    class="ml-4 required"
                    label="Callback URL"
                    :rules="[
                      (v) => (v && !!v.trim()) || 'Callback URL is required.',
                    ]"
                    v-model="item.callback_url"
                  ></v-text-field>
                  <div class="d-flex">
                    <v-menu
                      v-model="item.dateMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :value="getFormattedDate(item.effective_date)"
                          label="Effective Date Start"
                          :rules="[(v) => !!v || 'Date is required']"
                          append-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          class="ml-4 required"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="item.effective_date"
                        @input="item.dateMenu = false"
                        :min="new Date().toISOString()"
                      ></v-date-picker>
                    </v-menu>
                    <v-text-field
                      v-model="item.effective_time"
                      :rules="[
                        (v) =>
                          /^([01]\d|2[0-3]):([0-5]\d)$/.test(v) ||
                          'Time format must be valid',
                      ]"
                      placeholder="HH:MM"
                      label="Effective Time Start"
                      append-icon="mdi-clock-time-four-outline"
                      @input="timeInput(item, 'effective_time')"
                      class="ml-4"
                    ></v-text-field>
                  </div>
                  <div class="ml-4">
                    <v-switch
                      inset
                      label="Include Signature Image"
                      v-model="item.include_sign_image"
                    ></v-switch>
                  </div>
                  <div class="ml-4">
                    <v-switch
                      inset
                      label="Include Delivery Proof Image"
                      v-model="item.include_pod_image"
                    ></v-switch>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
    <ApiAuth />
  </v-container>
</template>
<script>
import ApiAuth from "./ApiAuth";
import { mapActions } from "vuex";
export default {
  components: {
    ApiAuth,
  },
  data() {
    return {
      dateMenu: false,
      subscriptions: [
        {
          callback_url: null,
          include_sign_image: true,
          include_pod_image: true,
          effective_date: null,
          effective_time: null,
        },
      ],
      loader: false,
      saveLoader: false,
    };
  },
  created() {
    this.fetchPODSubscriptions();
  },
  methods: {
    ...mapActions([
      "getPODSubscriptions",
      "updatePODSubscriptions",
      "snackBar",
    ]),
    fetchPODSubscriptions() {
      this.loader = true;
      this.getPODSubscriptions()
        .then((res) => {
          this.loader = false;
          this.subscriptions = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      this.updatePODSubscriptions({
        subscriptions: this.subscriptions.map((i) => {
          delete i.dateMenu;
          return i;
        }),
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
    },
    addItem() {
      this.subscriptions.unshift({
        callback_url: null,
        include_sign_image: true,
        include_pod_image: true,
        effective_date: null,
        effective_time: null,
      });
    },
    removeItem(item, i) {
      this.subscriptions.splice(i, 1);
    },
  },
};
</script>
