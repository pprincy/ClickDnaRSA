<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
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

      <strong
        ><p id="message" class="red--text">{{ expiredMessage }}</p></strong
      >
    </v-layout>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      activeLoader: "block",
      expiredMessage: "",
    };
  },
  mounted() {
    this.fetchPaymentRequest();
  },
  methods: {
    ...mapActions(["getPaymentRequest", "snackBar"]),
    fetchPaymentRequest() {
      switch (this.$route.params.invoicePg) {
        case "invoice-pg":
          this.getPaymentRequest(this.$route.params.invoiceNo)
            .then((res) => {
              this.activeLoader = "none";
              if (res && res.status_code == "200" && res.data) {
                if (res.data.is_expired) {
                  this.expiredMessage = res.data.is_expired_message;
                } else {
                  this.post_to_url(res.data);
                }
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
    post_to_url(data) {
      try {
        if (data) {
          var form = document.createElement("form");
          form.setAttribute("id", "demo_form");
          form.setAttribute("action", data.action);
          form.setAttribute("method", "post");

          var hdnEncReq = document.createElement("input");
          hdnEncReq.setAttribute("type", "hidden");
          hdnEncReq.setAttribute("name", "encRequest");
          hdnEncReq.setAttribute("value", data.encRequest);
          form.appendChild(hdnEncReq);

          var hdnAccessCode = document.createElement("input");
          hdnAccessCode.setAttribute("type", "hidden");
          hdnAccessCode.setAttribute("name", "access_code");
          hdnAccessCode.setAttribute("value", data.access_code);
          form.appendChild(hdnAccessCode);

          document.body.appendChild(form);
          document.getElementById("demo_form").submit();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
