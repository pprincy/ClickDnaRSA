<template>
  <v-dialog
    v-model="localDialog"
    @keydown.esc="$emit('close', false)"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5"
          >Edit - {{ editedItem.invoice_no }}, {{ editedItem.seller_name }} /
          {{ editedItem.client_name }}</span
        >
        <i class="caption red--text ml-4"> * required field</i>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-select
                label="Payment Mode"
                v-model="formData.payment_mode"
                :rules="[(v) => !!v || 'Payment Mode is required.']"
                :items="paymentModesItems"
                class="required"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.bank_transaction_id"
                label="Bank Transaction ID"
                :rules="[
                  (v) =>
                    (v && !!v.trim()) || 'Bank Transaction ID is required.',
                ]"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
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
                    :value="getFormattedDate(formData.payment_date)"
                    label="Payment Date"
                    placeholder="ddd DD MMM, YYYY"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[(v) => !!v || 'Payment Date is required.']"
                    class="required"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.payment_date"
                  @input="dateMenu = false"
                  :allowed-dates="(d) => disabled(d)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.payment_amount"
                type="number"
                label="Payment Amount"
                :rules="[
                  (v) =>
                    (v !== '' && v !== undefined) ||
                    'Payment Amount is required',
                  (v) => v > 0 || 'Amount should be greater than 0',
                ]"
                class="required"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('close', false)">
          Cancel
        </v-btn>
        <v-btn color="blue darken-1" text @click="save" :loading="saveLoader">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";
import { paymentModes } from "@/config/data";
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
  },
  computed: {
    paymentModesItems() {
      return paymentModes;
    },
  },
  data() {
    return {
      localDialog: false,
      editedItem: {},
      saveLoader: false,
      dateMenu: false,
      formData: {},
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
      this.editedItem = Object.assign({}, this.defaultItem);
    },
  },
  methods: {
    ...mapActions(["updatePendingPaymentDetails", "snackBar"]),
    disabled(d) {
      const diff = this.$moment(this.$moment(d).format("YYYY-MM-DD")).diff(
        this.$moment().format("YYYY-MM-DD"),
        "days"
      );
      return diff >= -30 && diff < 1;
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      Object.assign(this.formData, {
        invoice_id: this.editedItem.invoice_id,
        finance_detail_id: this.editedItem.finance_detail_id,
      });
      this.updatePendingPaymentDetails(this.formData)
        .then((res) => {
          this.saveLoader = false;
          this.$emit("refreshData");
          this.$emit("close", false);
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.$refs.form.reset();
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
  },
};
</script>
