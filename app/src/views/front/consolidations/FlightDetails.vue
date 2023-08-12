<template>
  <v-dialog
    v-model="localDialog"
    max-width="750px"
    @keydown.esc="close"
    persistent
  >
    <v-card :loading="saveLoader">
      <v-card-text>
        <v-form ref="form" class="py-4" lazy-validation>
          <span class="text-h6">
            {{ edit ? "Edit " : "" }}Flight Details
            <i class="caption red--text ml-4"> * required field</i></span
          >
          <p>
            <strong v-if="!edit">
              Please enter your flight details. Note in case of change, please
              edit the flight details before dispatching the cargo on the
              flight.
            </strong>
            <strong v-else> Please revise your flight details </strong>
          </p>
          <v-row>
            <v-col cols="12" md="6" sm="12">
              <v-text-field
                label="Master Airwaybill"
                v-model="editedItem.mawb_number"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Master Airwaybill is required.',
                ]"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field
                label="Flight Number"
                v-model="editedItem.flight_number"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Flight Number is required.',
                ]"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-autocomplete
                label="Origin Airport"
                :items="airportCodes"
                item-key="id"
                item-text="name"
                item-value="id"
                :rules="[(v) => !!v || 'Origin Airport is required.']"
                v-model="editedItem.origin_airport_id"
                :filter="filterAirportCodes"
                class="required"
              >
                <template v-slot:item="{ item }">
                  {{ item.name }} ({{ item.city_code }})
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-autocomplete
                label="Destination Airport"
                :items="airportCodes"
                item-key="id"
                item-text="name"
                item-value="id"
                :rules="[(v) => !!v || 'Destination Airport is required.']"
                v-model="editedItem.destination_airport_id"
                :filter="filterAirportCodes"
                class="required"
              >
                <template v-slot:item="{ item }">
                  {{ item.name }} ({{ item.city_code }})
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <strong>Departure</strong>
              <div class="d-flex">
                <v-menu
                  v-model="ddateMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="getFormattedDate(editedItem.departure_date)"
                      :rules="[(v) => !!v || 'Date is required']"
                      append-icon="mdi-calendar"
                      placeholder="ddd DD MMM, YYYY"
                      readonly
                      class="mx-2 required"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedItem.departure_date"
                    @input="setArrivalDate()"
                    :min="new Date().toISOString()"
                  ></v-date-picker>
                </v-menu>
                <v-text-field
                  v-model="editedItem.departure_time"
                  :rules="[
                    (v) =>
                      /^([01]\d|2[0-3]):([0-5]\d)$/.test(v) ||
                      'Time format must be valid',
                  ]"
                  placeholder="HH:MM"
                  append-icon="mdi-clock-time-four-outline"
                  class="mx-2"
                  @input="timeInput(editedItem, 'departure_time')"
                  @blur="setArrivalTime()"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <strong>Arrival</strong>
              <div class="d-flex">
                <v-menu
                  v-model="adateMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="getFormattedDate(editedItem.arrival_date)"
                      :rules="[(v) => !!v || 'Date is required']"
                      placeholder="ddd DD MMM, YYYY"
                      readonly
                      append-icon="mdi-calendar"
                      class="mx-2 required"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedItem.arrival_date"
                    @input="adateMenu = false"
                    :min="new Date().toISOString()"
                  ></v-date-picker>
                </v-menu>
                <v-text-field
                  v-model="editedItem.arrival_time"
                  :rules="[
                    (v) =>
                      /^([01]\d|2[0-3]):([0-5]\d)$/.test(v) ||
                      'Time format must be valid',
                  ]"
                  placeholder="HH:MM"
                  append-icon="mdi-clock-time-four-outline"
                  class="mx-2"
                  @input="timeInput(editedItem, 'arrival_time')"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
        <v-btn color="primary" @click="save" :loading="saveLoader">
          {{ edit ? "Make Flight Changes " : "Book on Flight" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { countries } from "@/config/data";

export default {
  props: {
    operationNumbers: {
      type: Array,
      default: () => [],
    },
    dialog: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["airportCodes"]),
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
      saveLoader: false,
      ddateMenu: false,
      adateMenu: false,
      localDialog: false,
      editedItem: {},
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
      this.$refs.form?.resetValidation();
      if (newVal) {
        this.fetchFlightDetails();
      }
    },
  },
  created() {
    this.getAirportCodes();
  },
  methods: {
    ...mapActions([
      "getAirportCodes",
      "updateFlightDetails",
      "getFlightDetails",
      "snackBar",
    ]),
    fetchFlightDetails() {
      if (this.edit) {
        this.saveLoader = true;
        this.getFlightDetails(this.operationNumbers[0].operation_number)
          .then((res) => {
            this.saveLoader = false;
            this.editedItem = res.data;
          })
          .catch(() => {
            this.saveLoader = false;
          });
      }
    },
    filterAirportCodes(item, queryText) {
      const name = item.name?.toLowerCase();
      const code = item.city_code?.toLowerCase();
      const searchText = queryText?.toLowerCase();
      return name?.indexOf(searchText) > -1 || code?.indexOf(searchText) > -1;
    },
    setArrivalDate() {
      this.editedItem.arrival_date = this.editedItem.departure_date;
      this.ddateMenu = false;
    },
    setArrivalTime() {
      if (
        this.editedItem.departure_date &&
        /^([01]\d|2[0-3]):([0-5]\d)$/.test(this.editedItem.departure_time)
      ) {
        const m = this.$moment(
          this.editedItem.departure_date +
            " " +
            this.editedItem.departure_time +
            ":00"
        ).add(1, "hours");
        this.editedItem.arrival_date = m.format("YYYY-MM-DD");
        this.editedItem.arrival_time = m.format("HH:mm");
        this.$forceUpdate();
      }
    },
    close() {
      this.$emit("close", false);
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      this.updateFlightDetails({
        operation_numbers: this.operationNumbers.map((i) => i.operation_number),
        ...this.editedItem,
      })
        .then((res) => {
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
  },
};
</script>
