<template>
  <v-container fluid>
    <v-form ref="form">
      <v-data-table
        :headers="headers"
        :items="subscriptions"
        :loading="loader"
        class="elevation-0"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title
              ><span class="body-1 font-weight-bold"
                >Select the tracking event or category you wish to subscripbe
                to. You can add single or multiple events. Select a category if
                you are unsure which event you need.</span
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
        </template>
        <template v-slot:[`item.event_category_id`]="{ item }">
          <v-autocomplete
            v-model="item.event_category_id"
            :items="trackCategories"
            :rules="[(v) => !!v || 'Category is required.']"
            item-key="id"
            item-value="id"
            item-text="name"
            class="required"
          ></v-autocomplete>
        </template>
        <template v-slot:[`item.event_id`]="{ item }">
          <v-autocomplete
            v-model="item.event_id"
            :items="allTrackEvents(item)"
            :rules="[(v) => !!v || 'Tracking Event is required.']"
            item-key="id"
            item-value="id"
            item-text="event_name"
            class="required"
          ></v-autocomplete>
        </template>
        <template v-slot:[`item.callback_url_bag`]="{ item }">
          <v-text-field
            v-model="item.callback_url_bag"
            :rules="[(v) => (v && !!v.trim()) || 'Value is required.']"
            class="required"
          ></v-text-field>
        </template>
        <template v-slot:[`item.callback_url_package`]="{ item }">
          <v-text-field
            v-model="item.callback_url_package"
            :rules="[(v) => (v && !!v.trim()) || 'Value is required.']"
            class="required"
          ></v-text-field>
        </template>
        <template v-slot:[`item.effective_date`]="{ item }">
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
                  label="Date"
                  :rules="[(v) => !!v || 'Date is required']"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  class="required"
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
              label="Time"
              append-icon="mdi-clock-time-four-outline"
              @input="timeInput(item, 'effective_time')"
            ></v-text-field>
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            color="error"
            @click="removeItem(item)"
            v-if="subscriptions.length > 1"
            icon
          >
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-form>
    <ApiAuth />
  </v-container>
</template>
<script>
import ApiAuth from "./ApiAuth";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    ApiAuth,
  },
  computed: {
    ...mapGetters(["trackCategories", "trackEvents"]),
  },
  data() {
    return {
      headers: [
        {
          text: "#",
          value: "actions",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Category",
          value: "event_category_id",
          class: "body-1 font-weight-bold",
          width: "200px",
        },
        {
          text: "Tracking Event",
          value: "event_id",
          class: "body-1 font-weight-bold",
          width: "200px",
        },
        {
          text: "Callback URL Bag",
          value: "callback_url_bag",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Callback URL Package",
          value: "callback_url_package",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Effective Time Stamp",
          value: "effective_date",
          class: "body-1 font-weight-bold",
        },
      ],
      subscriptions: [
        {
          event_category_id: null,
          event_id: null,
          callback_url_bag: null,
          callback_url_package: null,
          effective_date: null,
          effective_time: null,
        },
      ],
      loader: false,
      saveLoader: false,
    };
  },
  created() {
    this.getTrackCategories();
    this.getTrackEvents();
    this.fetchTrackingSubscriptions();
  },
  methods: {
    ...mapActions([
      "getTrackCategories",
      "getTrackEvents",
      "getTrackingSubscriptions",
      "updateTrackingSubscriptions",
      "snackBar",
    ]),
    fetchTrackingSubscriptions() {
      this.loader = true;
      this.getTrackingSubscriptions()
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
      this.updateTrackingSubscriptions({
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
    allTrackEvents(item) {
      return this.trackEvents.filter(
        (i) => i.category_id === item.event_category_id
      );
    },
    addItem() {
      this.subscriptions.unshift({
        event_category_id: null,
        event_id: null,
        callback_url_bag: null,
        callback_url_package: null,
        effective_date: null,
        effective_time: null,
      });
    },
    removeItem(item) {
      this.subscriptions.splice(
        this.subscriptions.findIndex(
          (i) =>
            i.event_category_id === item.event_category_id &&
            i.event_id === item.event_id &&
            i.callback_url_bag === item.callback_url_bag &&
            i.callback_url_package === item.callback_url_package
        ),
        1
      );
    },
  },
};
</script>
