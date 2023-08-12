<template>
  <v-dialog
    v-model="localDialog"
    max-width="600px"
    @keydown.esc="$emit('close', false)"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h6">
          Offer Quote to Seller
          <i class="caption red--text ml-4"> * required field</i>
        </span>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-list color="grey lighten-4" dense>
          <p
            class="font-weight-black ml-4 text-center text-decoration-underline"
          >
            Quote Summary - {{ editedItem.seller_name }} /
            {{ editedItem.client_name }}
          </p>
          <v-list-item>
            <v-list-item-content class="font-weight-bold">
              Type of Freight
            </v-list-item-content>
            <v-list-item-content class="text-left">
              <span
                >{{ quoteDetails.type === 0 ? "Sea" : "Air" }}
                <span v-if="quoteDetails.type === 0"
                  >(<strong>Type of Shipping:</strong>
                  {{ quoteDetails.type === 1 ? "FCL" : "LCL" }})</span
                >
              </span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="(item, index) in quoteDetails.dimensions"
            :key="index"
          >
            <v-list-item-content class="font-weight-bold">
              Box {{ index + 1 }}
            </v-list-item-content>
            <v-list-item-content class="align-end">
              <span class="text-left">
                H {{ item.depth }} x L {{ item.length }} x W
                {{ item.width }} (cm)
                <br />
                Quantity - {{ item.quantity }}
              </span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="font-weight-bold">
              Total Gross Weight (Kg)
            </v-list-item-content>
            <v-list-item-content class="align-end">
              {{ quoteDetails.total_gross_weight }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="font-weight-bold">
              Origin Country
            </v-list-item-content>
            <v-list-item-content class="align-end">
              <span>
                {{ displayCountry(quoteDetails.origin_country_id) }}
                <span>
                  (<strong>
                    Origin
                    {{ quoteDetails.type === 0 ? "Port" : "Airport" }}</strong
                  >:
                  {{
                    quoteDetails.type === 0
                      ? quoteDetails.origin_port_name
                      : quoteDetails.origin_airport_name
                  }}
                  )</span
                >
              </span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="font-weight-bold">
              Destination Country
            </v-list-item-content>
            <v-list-item-content class="align-end">
              <span>
                {{ displayCountry(quoteDetails.destination_country_id) }}
                <span>
                  (<strong>
                    Destination
                    {{ quoteDetails.type === 0 ? "Port" : "Airport" }}</strong
                  >:
                  {{
                    quoteDetails.type === 0
                      ? quoteDetails.destination_port_name
                      : quoteDetails.destination_airport_name
                  }}
                  )</span
                >
              </span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="font-weight-bold">
              Pickup or Drop
            </v-list-item-content>
            <v-list-item-content>
              {{ quoteDetails.pickup_drop === 0 ? "Pick up" : "Drop" }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="font-weight-bold">
              Location
            </v-list-item-content>
            <v-list-item-content class="text-left">
              {{ quoteDetails.address }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="font-weight-bold">
              Comments
            </v-list-item-content>
            <v-list-item-content class="text-left">
              {{ quoteDetails.comments }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="quoteDetails.freight_cost">
            <v-list-item-content class="font-weight-bold">
              Freight Cost
            </v-list-item-content>
            <v-list-item-content class="align-end">
              ${{ quoteDetails.freight_cost | money }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="quoteDetails.valid_date">
            <v-list-item-content class="font-weight-bold">
              Quote valid till
            </v-list-item-content>
            <v-list-item-content class="align-end">
              {{ quoteDetails.valid_date | moment("DD MMM, YYYY") }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Cost of Freight"
                type="number"
                v-model.number="formData.freight_cost"
                class="required"
                :rules="[
                  (v) => (v !== '' && v !== undefined) || 'Field is required',
                  (v) => v > 0 || 'Amount should be greater than 0',
                ]"
              >
                <template v-slot:append>
                  <strong>USD</strong>
                </template>
              </v-text-field>
            </v-col>
            <v-col md="12">
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="getFormattedDate(formData.valid_date)"
                    label="Valid Till Date"
                    placeholder="ddd DD MMM, YYYY"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[(v) => !!v || 'Date is required']"
                    class="required"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.valid_date"
                  @input="dateMenu = false"
                  :allowed-dates="(d) => disabled(d)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col md="12">
              <v-text-field
                label="Carrier Name"
                v-model="formData.carrier_name"
                class="required"
                :rules="[(v) => (v && !!v.trim()) || 'Field is required']"
              ></v-text-field>
            </v-col>
            <v-col md="12">
              <v-text-field
                label="Comments"
                v-model="formData.comments"
                class="required"
                :rules="[(v) => (v && !!v.trim()) || 'Field is required']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('close', false)">
          close
        </v-btn>
        <v-btn color="blue darken-1" text @click="save" :loading="saveLoader">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: {
    defaultItem: {
      type: Object,
      default: () => {},
    },
    dialog: {
      type: Boolean,
      default: false,
    },
    freightId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      saveLoader: false,
      formData: {},
      editedItem: {},
      localDialog: false,
      dateMenu: false,
      quoteDetails: {},
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
      this.editedItem = Object.assign({}, this.defaultItem);
      if (newVal && this.freightId) {
        this.$refs.form?.reset();
        this.fetchQuoteDetails();
      }
    },
  },
  methods: {
    ...mapActions(["offerQuote", "getQuoteDetails", "snackBar"]),
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      Object.assign(this.formData, { freight_id: this.freightId });
      this.offerQuote(this.formData)
        .then((res) => {
          this.saveLoader = false;
          this.$emit("refreshData");
          this.$emit("close", false);
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
    disabled(d) {
      const diff = this.$moment(this.$moment(d).format("YYYY-MM-DD")).diff(
        this.$moment().format("YYYY-MM-DD"),
        "days"
      );
      return diff > -1 && diff < 30;
    },
    fetchQuoteDetails() {
      this.loader = true;
      this.getQuoteDetails(this.freightId)
        .then((res) => {
          this.loader = false;
          this.quoteDetails = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
