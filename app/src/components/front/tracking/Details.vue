<template>
  <v-row>
    <v-col cols="12" md="3">
      <v-card :loading="loader" class="text-center">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title class="mx-auto">Track a Shipment</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field v-model="trackingID" label="Tracking ID"></v-text-field>
          <v-btn
            color="primary"
            :disabled="!trackingID"
            @click="fetchDetails(trackingID)"
            :loading="loader"
            >Track</v-btn
          >
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" :md="selectedTrackNo.length > 1 ? 6 : 9">
      <v-card :loading="loader" class="fill-height">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>{{ trackingDetails.tracking_no }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <p class="py-0 my-0">Shipment Date:</p>
              <p class="py-0 my-0" v-if="trackingDetails.shipment_origin">
                {{
                  trackingDetails.shipment_origin.date
                    | moment("MMM DD, YYYY (ddd) HH:mm")
                }}
              </p>
              <v-divider></v-divider>
              <p class="py-0 my-0" v-if="trackingDetails.shipment_origin">
                {{ trackingDetails.shipment_origin.location }}
              </p>
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="text-center"
              v-if="trackingDetails.current_status"
            >
              <div class="mx-auto arrow-steps clearfix">
                <div
                  class="step"
                  v-for="(item, i) of trackingDetails.current_status.states"
                  :key="i"
                  :class="{ current: item.selected }"
                ></div>
              </div>
              <p class="py-0 my-0 text-h6">
                {{ trackingDetails.current_status.status_title }}
              </p>
              <p class="py-0 my-0">
                {{ trackingDetails.current_status.status_location }}
              </p>
            </v-col>
            <v-col cols="12" md="3">
              <p class="py-0 my-0">Expected Delivery:</p>
              <p class="py-0 my-0" v-if="trackingDetails.shipment_destination">
                {{
                  trackingDetails.shipment_destination.date
                    | moment("MMM DD, YYYY (ddd) HH:mm")
                }}
              </p>
              <v-divider></v-divider>
              <p class="py-0 my-0" v-if="trackingDetails.shipment_destination">
                {{ trackingDetails.shipment_destination.location }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="3" v-if="selectedTrackNo.length > 1">
      <v-card :loading="loader" class="mx-auto fill-height">
        <v-virtual-scroll
          :bench="benched"
          :items="selectedTrackNo"
          height="200"
          item-height="40"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item" @click="fetchDetails(item)">
              <v-list-item-content>
                <v-list-item-title>
                  <strong>{{ item }}</strong>
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon small> mdi-open-in-new </v-icon>
              </v-list-item-action>
            </v-list-item>

            <v-divider></v-divider>
          </template>
        </v-virtual-scroll>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <p class="text-h6">Shipments Details</p>
      <v-card :loading="loader" class="text-center fill-height" tile outlined>
        <v-list v-if="trackingDetails.shipment_details" dense two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="body-1">From</v-list-item-title>
              <v-list-item-subtitle>{{
                trackingDetails.shipment_details.from_client
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="body-1">Weight</v-list-item-title>
              <v-list-item-subtitle
                >{{ trackingDetails.shipment_details.total_weight }}
                {{
                  trackingDetails.shipment_details.total_weight_unit
                }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content class="body-1">
              <v-list-item-title>Total Pieces</v-list-item-title>
              <v-list-item-subtitle>{{
                trackingDetails.shipment_details.total_pieces
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="body-1"
                >Item Description</v-list-item-title
              >
              <v-list-item-subtitle
                class="text-left py-1"
                v-for="(item, i) in trackingDetails.shipment_details
                  .item_descriptions"
                :key="i"
                >{{ item.name }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            v-if="
              trackingDetails.other_trackings &&
              trackingDetails.other_trackings.length
            "
          >
            <v-list-item-content>
              <v-list-item-title class="body-1"
                >Track Individual Item</v-list-item-title
              >
              <v-list dense>
                <template v-for="(item, i) in trackingDetails.other_trackings">
                  <v-list-item :key="i" @click="fetchDetails(item)">
                    <v-list-item-content>
                      <v-list-item-title class="text-left">
                        <strong>{{ item }}</strong>
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon small> mdi-open-in-new </v-icon>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider :key="'x' + i"></v-divider>
                </template>
              </v-list>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" md="9">
      <p class="text-h6">Travel history</p>
      <v-card :loading="loader" class="pa-2 fill-height" tile outlined>
        <v-card-text>
          <v-row>
            <v-col
              class="text-center"
              v-for="(item, i) in trackingDetails.travel_history"
              :key="i"
            >
              <v-chip outlined label
                >Total time: {{ item.total_time }}
                {{ item.total_time_unit }}</v-chip
              >
              <v-btn color="primary" block>{{ item.category }}</v-btn>
              <v-timeline dense>
                <v-timeline-item
                  :color="ev.status === 'pending' ? 'primary' : 'success'"
                  v-for="(ev, j) in item.events"
                  :key="j"
                  small
                >
                  <p class="py-0 my-0" v-if="ev.on">
                    On {{ ev.on | moment("MMM DD, YYYY (ddd) HH:mm") }}
                  </p>
                  <p class="py-0 my-0 font-weight-bold" color="accent">
                    {{ ev.name }}
                  </p>
                  <p class="py-0 my-0">{{ ev.location }}</p>
                </v-timeline-item>
              </v-timeline>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    benched: 0,
    trackNo: null,
    trackingDetails: {},
    loader: false,
    trackingID: null,
  }),
  computed: {
    ...mapGetters(["selectedTrackNo"]),
  },

  created() {
    this.trackNo = this.selectedTrackNo[0];
    if (this.trackNo == undefined) {
      if (this.$route.params.viewName == "orderList") {
        this.trackNo = this.$route.params.id;
      }
    }
    this.fetchDetails(this.trackNo);
  },
  methods: {
    ...mapActions(["getTrackingDetails"]),
    fetchDetails(trackNo) {
      this.loader = true;
      this.getTrackingDetails({
        tracking_no: trackNo,
      })
        .then((res) => {
          this.loader = false;
          this.trackingDetails = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
<style scoped>
.clearfix:after {
  clear: both;
  content: "";
  display: block;
  height: 0;
}
.arrow-steps {
  display: inline-flex;
}
.arrow-steps .step {
  font-size: 14px;
  text-align: center;
  color: #666;
  cursor: default;
  margin: 0 3px;
  padding: 10px;
  min-width: 40px;
  float: left;
  position: relative;
  background-color: #d9e3f7;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: background-color 0.2s ease;
}

.arrow-steps .step:after,
.arrow-steps .step:before {
  content: " ";
  position: absolute;
  top: 0;
  right: -17px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 17px solid #d9e3f7;
  z-index: 2;
  transition: border-color 0.2s ease;
}

.arrow-steps .step:before {
  right: auto;
  left: 0;
  border-left: 17px solid #fff;
  z-index: 0;
}

.arrow-steps .step:first-child:before {
  border: none;
}

.arrow-steps .step:last-child:after {
  border: none;
}

.arrow-steps .step:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.arrow-steps .step:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.arrow-steps .step.current {
  color: #fff;
  background-color: #23468c;
}

.arrow-steps .step.current:after {
  border-left: 17px solid #23468c;
}

.v-list--two-line .v-list-item,
.v-list-item--two-line {
  min-height: auto;
}
</style>
