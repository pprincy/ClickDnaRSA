<template>
  <v-dialog
    v-model="localDialog"
    max-width="700"
    @keydown.esc="$emit('close', false)"
    persistent
  >
    <v-card :loading="loader">
      <v-card-title class="text-h6">
        Consolidation #{{ editedItem.operation_number }}
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$emit('close', false)" text icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col md="6" sm="6" xs="12">
            <v-card>
              <v-toolbar color="primary" dense dark flat>
                <v-toolbar-title>Summary Of Flight</v-toolbar-title>
              </v-toolbar>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Flight Number</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.flight_number }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Master Airwaybill</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.mawb_number }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Departure Date</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{
                      consolidationSummary.departure_date
                        | moment("ddd DD MMM, YYYY")
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Departure Time</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.departure_time }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Departing Airport</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.origin_airport }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Arriving Airport</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.destination_airport }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Arrival Date</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{
                      consolidationSummary.arrival_date
                        | moment("ddd DD MMM, YYYY")
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Arrival Time</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.arrival_time }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col md="6" sm="6" xs="12">
            <v-card>
              <v-toolbar color="primary" dense dark flat>
                <v-toolbar-title>Summary Of Consolidation</v-toolbar-title>
              </v-toolbar>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Bags</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.total_bags | numFormat }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Consignments</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.total_consignments | numFormat }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Packages</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.total_packages | numFormat }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold"
                    >Total Consignments by Destination</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-for="(
                  item, i
                ) in consolidationSummary.total_consignment_by_destination"
                :key="i"
                two-line
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.country_name }}</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ item.total_consignments | numFormat }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col md="6" sm="6" xs="12">
            <v-card>
              <v-toolbar color="primary" dense dark flat>
                <v-toolbar-title>Summary Of Agent</v-toolbar-title>
              </v-toolbar>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Agent Name</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.agent_name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Contact Number</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.agent_contact_num }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col md="6" sm="6" xs="12">
            <v-card>
              <v-toolbar color="primary" dense dark flat>
                <v-toolbar-title>Summary Of Load</v-toolbar-title>
              </v-toolbar>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Total Weight</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.total_weight | numFormat }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Total Value USD</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">
                    {{ consolidationSummary.total_value | numFormat }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
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
    editedItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      localDialog: false,
      loader: false,
      consolidationSummary: {},
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
      if (newVal) {
        this.fetchConsolidationSummary();
      }
    },
  },
  methods: {
    ...mapActions(["getConsolidationSummary"]),
    fetchConsolidationSummary() {
      this.loader = true;
      console.log(this.editedItem);
      this.getConsolidationSummary(this.editedItem.operation_number)
        .then((res) => {
          this.loader = false;
          this.consolidationSummary = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
