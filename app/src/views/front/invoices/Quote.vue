<template>
  <v-col>
    <v-card v-if="!quoteDetails.freight_id" class="elevation-0 text-center">
      <v-card-text>
        <v-btn color="primary" @click="quoteDialog = true">
          Click here to Request for Freight Quote by RSA
        </v-btn>
        <RequestQuote
          :dialog="quoteDialog"
          :inv-id="invId"
          @close="quoteDialog = false"
          @created="onQuoteCreated"
        />
      </v-card-text>
    </v-card>
    <v-card
      v-else
      :color="
        quoteStatus === 0
          ? 'warning'
          : quoteStatus === 5
          ? 'success'
          : quoteStatus === 6
          ? 'error'
          : 'info'
      "
      class="text-center mx-auto pa-4"
      dark
    >
      <v-card-title class="text-h5 mx-auto">
        <v-spacer></v-spacer>
        {{ displayStatus }}
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-subtitle class="white--text my-2">
        Summary of Quote Requested <br />
      </v-card-subtitle>

      <v-card-text class="white--text my-2">
        <v-list color="transparent" dense>
          <v-list-item>
            <v-list-item-content class="font-weight-bold">
              Type of Freight
            </v-list-item-content>
            <v-list-item-content class="text-left">
              <span
                >{{ quoteDetails.type === 0 ? "Sea" : "Air" }}
                <span v-if="quoteDetails.type === 0"
                  >(<strong>Type of Shipping:</strong>
                  {{
                    quoteDetails.sea_shipping_type === 1 ? "FCL" : "LCL"
                  }})</span
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
            <v-list-item-content class="text-left">
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
            <v-list-item-content class="text-left">
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
      </v-card-text>

      <v-card-actions class="text-center action-btn-container">
        <v-btn
          color="red"
          v-if="quoteStatus === 0"
          @click="
            confirmStatusChange(
              7,
              'Are you sure want to cancel this quote request?'
            )
          "
        >
          Cancel Request
        </v-btn>
        <v-btn
          color="success"
          v-if="quoteStatus === 1 || quoteStatus === 3"
          @click="
            confirmStatusChange(5, 'Are you sure want to accept this quote?')
          "
        >
          Accept the Quote
        </v-btn>
        <v-btn
          color="error"
          v-if="quoteStatus === 1 || quoteStatus === 3"
          @click="
            confirmStatusChange(6, 'Are you sure want to reject this quote?')
          "
        >
          Reject the Quote
        </v-btn>
        <v-btn
          color="warning"
          v-if="quoteStatus === 1"
          @click="
            confirmStatusChange(
              2,
              'Are you sure want to make request for revision?'
            )
          "
        >
          Request for Revision
        </v-btn>
      </v-card-actions>
    </v-card>
    <ConfirmDialog
      :dialog="dialogConfirm"
      :text="actionMsg"
      :loader="statusLoader"
      @confirm="changeStatus"
      @close="dialogConfirm = false"
    />
  </v-col>
</template>
<script>
import RequestQuote from "@/views/front/invoices/RequestQuote";
import { mapActions } from "vuex";
import { quoteStatuses } from "@/config/data";
import ConfirmDialog from "@/components/front/common/ConfirmDialog";

export default {
  components: {
    RequestQuote,
    ConfirmDialog,
  },
  props: {
    invId: {
      type: Number,
      default: 0,
    },
    freightId: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    displayStatus() {
      return quoteStatuses.find((i) => i.value === this.quoteStatus)?.text;
    },
  },
  data() {
    return {
      quoteDialog: false,
      quoteStatus: 0,
      quoteDetails: {},
      actionMsg: null,
      actionStatus: 0,
      dialogConfirm: false,
      statusLoader: false,
    };
  },
  mounted() {
    this.fetchQuoteDetails();
  },
  watch: {
    freightId(newVal) {
      if (newVal) {
        this.fetchQuoteDetails();
      }
    },
  },
  methods: {
    ...mapActions(["getQuoteDetails", "updateFreightStatus", "snackBar"]),
    fetchQuoteDetails() {
      if (this.freightId) {
        this.getQuoteDetails(this.freightId).then((res) => {
          this.quoteDetails = res.data;
          this.quoteStatus = res.data.status;
        });
      }
    },
    confirmStatusChange(actionStatus, actionMsg) {
      this.dialogConfirm = true;
      this.actionStatus = actionStatus;
      this.actionMsg = actionMsg;
    },
    changeStatus() {
      this.statusLoader = true;
      this.updateFreightStatus({
        id: this.freightId,
        data: {
          status: this.actionStatus,
        },
      })
        .then((res) => {
          this.statusLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.quoteStatus = this.actionStatus;
          this.dialogConfirm = false;
        })
        .catch(() => {
          this.statusLoader = false;
          this.dialogConfirm = false;
        });
    },
    onQuoteCreated(freightId) {
      this.quoteStatus = 0;
      this.$emit("created", freightId);
    },
  },
};
</script>
<style lang="scss" scoped>
.action-btn-container {
  display: flex;
  justify-content: center;
  .v-btn {
    text-transform: none;
  }
}
@media only screen and (max-width: 1024px) {
  .action-btn-container {
    flex-direction: column;
    .v-btn {
      margin-top: 3px;
      margin-bottom: 3px;
    }
  }
}
</style>
