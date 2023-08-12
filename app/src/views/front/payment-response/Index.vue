<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-img
          src="@/assets/logo.svg"
          alt="RSA Logo"
          aspect-ratio="1"
          title="RSA Logo"
          max-height="50"
          max-width="175"
          class="mx-auto mb-4"
          contain
        ></v-img>
        <div
          :style="{
            display: activeLoader,
          }"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-row class="justify-center">
          <v-col cols="12" md="5" sm="5" xs="12">
            <div class="payment-status-msg text-center">
              <div v-show="showData">
                <v-icon>mdi-check-circle</v-icon><br />
                <h2 class="green--text">Succesful Payment</h2>
                <br />
                <label>{{ message }}</label>
              </div>
              <div v-show="!showData">
                <v-icon>mdi-close-circle-outline</v-icon>
                <br />
                <h2 class="red--text">Failure to Pay</h2>
                <br />
                <label>{{ message }}</label>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      activeLoader: "block",
      message: "",
      showData: false,
    };
  },
  mounted() {
    this.fetchPaymentResponse();
  },
  methods: {
    ...mapActions(["getPaymentResponse", "snackBar"]),
    fetchPaymentResponse() {
      switch (this.$route.params.invoicePgResponse) {
        case "invoice-pg-response":
          this.getPaymentResponse(this.$route.params.hashValue)
            .then((res) => {
              this.activeLoader = "none";
              if (res.data.order_status == "Success") {
                this.message =
                  "Thanks " +
                  res.data.billing_name +
                  ", " +
                  "for your payment of " +
                  res.data.amount +
                  " " +
                  res.data.currency +
                  " with transaction Id " +
                  res.data.order_id +
                  " for FBA Shippment Id " +
                  res.data.tracking_id +
                  " ";
                this.showData = true;
              } else if (
                res.data.order_status == "Not Found" ||
                res.data.order_status == "Failed" ||
                res.data.order_status == "Invalid Domain"
              ) {
                this.message =
                  res.data.order_status + ":: " + res.data.status_message;
                this.showData = false;
              } else {
                this.message =
                  "" +
                  res.data.billing_name +
                  ", " +
                  "your payment of " +
                  res.data.currency +
                  " " +
                  res.data.amount +
                  " with transaction Id " +
                  res.data.order_id +
                  " for FBA Shippment Id " +
                  res.data.tracking_id +
                  " has failed due to" +
                  res.data.order_status +
                  ":: " +
                  res.data.status_message;
                this.showData = false;
              }
            })
            .catch(() => {});
          break;

        default:
          this.snackBar({
            message: "Invalid Url",
          });
      }
    },
  },
};
</script>
<style lang="scss">
.payment-status-msg {
  box-shadow: rgb(100 100 111 / 20%) 0px 7px 29px 0px;
  padding: 5rem 2rem;
}
.mdi-check-circle::before {
  content: "\F05E0";
  color: green;
  font-size: 5rem;
}
.mdi-close-circle-outline::before {
  content: "\F015A";
  color: red;
  font-size: 5rem;
}
</style>
