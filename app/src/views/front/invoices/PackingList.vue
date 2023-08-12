<template>
  <v-dialog
    v-model="localDialog"
    max-width="600px"
    @keydown.esc="$emit('close', false)"
    persistent
  >
    <v-card>
      <v-card-title class="text-h6" v-if="invoice">
        Packing List - {{ invoice.invoice_no }} ({{ invoice.seller_name }})
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="products"
          :loading="productsLoader"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item="props">
            <tr :class="{ 'red--text': props.item.status === 'Pending' }">
              <td>{{ props.item.product_id }}</td>
              <td>{{ props.item.product_hs_code }}</td>
              <td>{{ props.item.hs_code }}</td>
              <td>{{ props.item.description }}</td>
              <td>
                <v-chip
                  text-color="white"
                  :color="props.item.status === 'Pending' ? 'red' : 'green'"
                >
                  <strong>{{ props.item.status }}</strong>
                </v-chip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('close', false)">
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    invoice: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      localDialog: false,
      products: [],
      productsLoader: false,
      headers: [
        {
          text: "Product Id",
          align: "start",
          value: "product_id",
          class: "body-1 font-weight-bold",
        },
        {
          text: "HS Code",
          value: "product_hs_code",
          class: "body-1 font-weight-bold",
        },
        {
          text: "HS Code by Seller",
          value: "hs_code",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Description",
          value: "description",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Status",
          value: "status",
          class: "body-1 font-weight-bold",
        },
      ],
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
      if (newVal) {
        this.fetchInvoicePackages();
      }
    },
  },
  methods: {
    ...mapActions(["getInvoicePackages"]),
    fetchInvoicePackages() {
      this.products = [];
      this.productsLoader = true;
      this.getInvoicePackages(this.invoice.id)
        .then((res) => {
          this.productsLoader = false;
          this.products = res.data;
        })
        .catch(() => {
          this.productsLoader = false;
        });
    },
  },
};
</script>
