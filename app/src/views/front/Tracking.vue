<template>
  <v-container fluid fill-height>
    <v-row align-center justify="center">
      <v-col cols="12" md="auto" sm="auto" xs="auto">
        <p class="font-weight-bold text-h5 text-center">Track & Trace</p>
        <v-btn-toggle v-model="tab" color="deep-purple accent-3" mandatory>
          <v-btn value="trackingNumber"> Tracking Number </v-btn>

          <v-btn value="trackByRef"> Track by Reference </v-btn>

          <v-btn value="proofOfDel"> Obtain Proof of Delivery </v-btn>
        </v-btn-toggle>
        <v-row v-if="tab === 'trackingNumber'">
          <v-col v-if="trackingType === 'single'">
            <v-text-field
              class="full-width mt-2"
              label="Tracking ID"
              type="text"
              v-model="trackingNumbers[0].value"
            >
              <template v-slot:append>
                <v-btn color="primary">Track</v-btn>
              </template>
            </v-text-field>
            <v-btn
              text
              class="font-weight-bold text-uppercase pl-0"
              @click="trackingType = 'multiple'"
              >Multiple Tracking Number</v-btn
            >
            |
            <v-btn text class="font-weight-bold text-uppercase"
              >Need Help ?</v-btn
            >
          </v-col>
          <v-col v-else>
            <template v-for="(item, i) in trackingNumbers">
              <v-text-field
                class="full-width"
                type="text"
                :placeholder="'Tracking Number ' + ('0' + (i + 1)).slice(-2)"
                @focus="checkAndAdd(i)"
                :key="i"
                v-model="item.value"
              >
              </v-text-field>
            </template>
            <v-btn color="primary" class="float-right">Track</v-btn>
            <v-btn
              text
              class="font-weight-bold text-uppercase pl-0"
              @click="trackingType = 'single'"
              >Single Tracking Number</v-btn
            >
            |
            <v-btn text class="font-weight-bold text-uppercase"
              >Need Help ?</v-btn
            >
          </v-col>
        </v-row>
        <v-row v-else-if="tab === 'trackByRef'">
          <v-col>
            <template v-for="(item, i) in trackingNumbers">
              <v-text-field
                class="full-width"
                :placeholder="'Reference Number ' + ('0' + (i + 1)).slice(-2)"
                type="text"
                @focus="checkAndAdd(i)"
                :key="i"
                v-model="item.value"
              >
              </v-text-field>
            </template>
            <v-row>
              <v-col>
                <v-autocomplete
                  label="Country"
                  :items="allCountries"
                  v-model="country"
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-text-field label="DESTINATION POSTAL CODE"> </v-text-field>
              </v-col>
              <v-col>
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
                      v-model="date"
                      label="Ship Date"
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    @input="dateMenu = false"
                    :min="new Date().toISOString()"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-text-field
              class="full-width"
              type="text"
              label="ACCOUNT NUMBER (RECOMMENDED)"
              v-model="accountNumber"
            >
            </v-text-field>
            <v-btn color="primary" class="float-right">Track</v-btn>
            <v-btn text class="font-weight-bold text-uppercase pl-0"
              >Need Help ?</v-btn
            >
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <template v-for="(item, i) in trackingNumbers">
              <v-text-field
                class="full-width"
                :placeholder="'Tracking Number ' + ('0' + (i + 1)).slice(-2)"
                type="text"
                @focus="checkAndAdd(i)"
                :key="i"
                v-model="item.value"
              >
              </v-text-field>
            </template>
            <v-select
              class="full-width"
              :items="['View/Print Letter']"
              v-model="viewPrint"
            >
            </v-select>
            <v-btn color="primary" class="float-right">Submit</v-btn>
            <v-btn text class="font-weight-bold text-uppercase pl-0"
              >Need Help ?</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { countries } from "@/config/data";
export default {
  computed: {
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
      tab: "trackingNumber",
      trackingType: "single",
      trackingNumbers: [
        {
          value: null,
        },
      ],
      limit: 30,
      accountNumber: null,
      country: null,
      date: null,
      dateMenu: false,
      viewPrint: "View/Print Letter",
    };
  },
  methods: {
    checkAndAdd(index) {
      if (
        this.limit > this.trackingNumbers.length &&
        index + 1 === this.trackingNumbers.length &&
        this.trackingNumbers.filter((item, i) => i !== index && !item.value)
          .length === 0
      ) {
        this.trackingNumbers.push({
          value: null,
        });
      }
    },
  },
};
</script>
<style scoped>
.v-input input:focus {
  border-left: 3px solid #4d148c;
}
</style>
