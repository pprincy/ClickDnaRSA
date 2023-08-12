<template>
  <v-dialog
    v-model="localDialog"
    max-width="550px"
    @keydown.esc="$emit('close', false)"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit </span>
        <i class="caption red--text ml-4"> * required field</i>
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content class="font-weight-bold">
            Package Invoice Number
          </v-list-item-content>
          <v-list-item-content class="align-end">
            {{ invoice.invoice_number }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content class="font-weight-bold">
            Client Name
          </v-list-item-content>
          <v-list-item-content class="align-end">
            {{ invoice.client_name }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content class="font-weight-bold">
            Seller Name
          </v-list-item-content>
          <v-list-item-content class="align-end">
            {{ invoice.seller_name }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content class="font-weight-bold">
            Product Code (ASN)
          </v-list-item-content>
          <v-list-item-content class="align-end">
            {{ invoice.product_id }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content class="font-weight-bold">
            Product Description
          </v-list-item-content>
          <v-list-item-content class="align-end">
            {{ invoice.product_description }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content class="font-weight-bold">
            HS Code by Seller
          </v-list-item-content>
          <v-list-item-content class="align-end">
            {{ invoice.hs_code }}
          </v-list-item-content>
        </v-list-item>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="editedItem.status"
                label="Status"
                :rules="[
                  (v) =>
                    (v !== false && v !== '' && v !== null) ||
                    `Status is required.`,
                ]"
                :items="allProductStatues"
                class="required"
              ></v-select>
            </v-col>
            <v-col cols="12" v-if="+editedItem.status === 2">
              <v-text-field
                v-model="editedItem.reject_reason"
                label="Reason"
                :rules="[(v) => (v && !!v.trim()) || 'Reason is required.']"
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
import { mapActions, mapGetters } from "vuex";
import { productStatuesEdit } from "@/config/data";
export default {
  props: {
    defaultItem: {
      type: Object,
      default: () => {},
    },
    invoice: {
      type: Object,
      default: () => {},
    },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["userRole"]),
    allProductStatues() {
      return Object.keys(productStatuesEdit).map((i) => {
        return {
          text: productStatuesEdit[i],
          value: +i,
        };
      });
    },
  },
  data() {
    return {
      localDialog: false,
      editedItem: {},
      saveLoader: false,
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
      this.editedItem = Object.assign({}, this.editProduct);
      console.log(
        "  this.editedItem",
        this.editedItem,
        this.editProduct,
        this.invoice
      );
    },
  },
  methods: {
    ...mapActions(["updateTempProduct", "snackBar"]),
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      this.updateTempProduct({
        id: this.invoice.id,
        data: this.editedItem,
      })
        .then((res) => {
          this.saveLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.$emit("refreshData");
          this.$emit("close", false);
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
  },
};
</script>
