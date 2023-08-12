<template>
  <v-dialog
    v-model="visible"
    @keydown.esc="handleClickCancelSaveNode"
    persistent
    max-width="700"
  >
    <v-card>
      <v-card-text>
        <v-tabs v-model.number="selectedTab" right>
          <v-tab v-if="node && node.type === 'last_mile_agent'" href="#carrier"
            >Carrier</v-tab
          >
          <v-tab
            v-if="node && node.type === 'last_mile_agent'"
            href="#restrictions"
            >Restrictions</v-tab
          >
          <v-tab
            v-if="node && node.type !== 'last_mile_agent'"
            href="#label_logic"
            >Address Setup</v-tab
          >
        </v-tabs>
        <v-tabs-items v-model="selectedTab">
          <v-tab-item
            v-if="node && node.type === 'last_mile_agent'"
            value="carrier"
          >
            <v-row>
              <v-col>
                <v-label>Select Carriers</v-label>
                <v-checkbox
                  v-for="(c, i) in carriers"
                  :key="i"
                  color="primary"
                  :value="c.id"
                  v-model="nodeForm.carrier_ids"
                  hide-details
                >
                  <template v-slot:label>
                    <strong class="carrier_name">{{ c.carrier_code }}</strong>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item
            v-if="node && node.type === 'last_mile_agent'"
            value="restrictions"
          >
            <Restrictions
              ref="restrictions"
              :pool-carriers="nodeForm.carrier_ids"
              :carriers="carriers"
              :node.sync="node"
              :dialog="visible"
            />
          </v-tab-item>
          <v-tab-item
            v-if="node && node.type !== 'last_mile_agent'"
            value="label_logic"
          >
            <LabelLogic
              ref="labellogic"
              :pool-carriers="nodeForm.carrier_ids"
              :carriers="carriers"
              :node.sync="node"
              :dialog="visible"
              :nodes="nodes"
              :origin="origin"
              :destination="destination"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="handleClickCancelSaveNode">Cancel</v-btn>
        <v-btn text @click="handleClickSaveNode(false)">Apply</v-btn>
        <v-btn text @click="handleClickSaveNode(true)">Apply & Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Restrictions from "./Restrictions";
import LabelLogic from "./LabelLogic";
export default {
  components: {
    Restrictions,
    LabelLogic,
  },
  computed: {
    ...mapGetters(["carriers"]),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
      default: null,
    },
    origin: {
      type: Object,
      default: null,
    },
    destination: {
      type: Object,
      default: null,
    },
    nodes: {
      type: Array,
      default: () => [],
    },
  },
  data: function () {
    return {
      nodeForm: {
        carrier_ids: [],
      },
      selectedTab: undefined,
    };
  },
  methods: {
    ...mapActions(["saveCarrierRestrictions", "snackBar"]),
    handleClickSaveNode(close) {
      // if (
      //   this.selectedTab === "label_logic" &&
      //   !this.$refs.labellogic.$refs.lblForm.validate()
      // )
      //   return;
      if (
        this.selectedTab === "label_logic" &&
        this.$refs.labellogic.$refs.addressForm &&
        !this.$refs.labellogic.$refs.addressForm.validate()
      ) {
        this.$refs.labellogic.lblTabs = "address";
        return;
      }
      if (this.node.type !== "last_mile_agent") {
        this.nodeForm.carrier_ids = [this.node.id];
      }
      this.nodeForm.carrier_settings = this.nodeForm.carrier_ids.map((cid) => {
        const settings = this.node?.carrier_settings?.find(
          (cs) => cs.entity_id === cid
        );
        let address;
        if (cid === this.$refs.labellogic?.selectedCarrier?.id) {
          address = this.$refs.labellogic.addressForm;
          address.city_id = address.city.id;
        } else {
          address = settings?.addressForm;
        }
        if (address && "city" in address) {
          delete address.city;
        }

        return {
          entity_id: cid,
          restrictions: {
            customers:
              cid === this.$refs.restrictions?.selectedCarrier?.id
                ? this.$refs.restrictions?.selectedCustomers || []
                : settings?.restrictions?.customers || [],
            city_postals:
              cid === this.$refs.restrictions?.selectedCarrier?.id
                ? this.$refs.restrictions?.selectedCities || []
                : settings?.restrictions?.city_postals || [],
            weight_ranges:
              cid === this.$refs.restrictions?.selectedCarrier?.id
                ? this.$refs.restrictions?.selectedWeights || []
                : settings?.restrictions?.weight_ranges || [],
            dimensions:
              cid === this.$refs.restrictions?.selectedCarrier?.id
                ? this.$refs.restrictions?.selectedDimentions || []
                : settings?.restrictions?.dimensions || [],
          },
          // label_logic:
          //   cid === this.$refs.labellogic?.selectedCarrier?.id
          //     ? this.$refs.labellogic?.allLabelTypes
          //         ?.filter((j) => j.selected)
          //         ?.map((i) => {
          //           return {
          //             label_type_id: i.id,
          //             quantity: i.qty,
          //             paper_format_id: i.format,
          //           };
          //         })
          //     : settings?.label_logic || [],
          address: address?.city_id
            ? Object.assign({ country_code: this.node.countryCode }, address)
            : {},
        };
      });
      if (
        [
          "client",
          "origin_agent",
          "consumer",
          "terminal",
          "transit_partner",
        ].includes(this.node.type)
      ) {
        this.nodeForm.carrier_ids = [];
      }
      this.$emit("update:node", Object.assign(this.node, this.nodeForm));
      if (close) {
        this.$emit("update:visible", false);
      }
      this.snackBar({
        color: "success",
        message:
          "Success! Please click on canvas sceen SAVE button to permanently save settings.",
      });
    },
    handleClickCancelSaveNode() {
      this.$emit("update:visible", false);
    },
  },
  watch: {
    node: {
      deep: true,
      handler(val) {
        if (!val) {
          return;
        }
        this.nodeForm = this.lodash.cloneDeep(val);
      },
    },
  },
};
</script>
<style scoped>
.carrier-logo {
  max-width: 40%;
  max-height: 15px;
}
.carrier_name {
  text-transform: capitalize;
}
</style>
