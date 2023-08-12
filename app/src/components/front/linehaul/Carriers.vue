<template>
  <v-col cols="12" md="2">
    <div v-if="countryNode">
      <p class="text-h6 py-0">Entity Objects</p>
      <v-divider></v-divider>
      <v-progress-linear
        :active="!linehaulConfig"
        :indeterminate="!linehaulConfig"
        color="deep-purple accent-4"
      ></v-progress-linear>
      <v-tooltip
        left
        v-for="(eo, i) in linehaulTypes"
        :key="i"
        :disabled="isDisabled(eo)"
      >
        <template v-slot:activator="{ on, attrs }">
          <img
            v-on="on"
            v-bind="attrs"
            :src="eo.data.logo | assetURL"
            :alt="eo.data.name"
            :draggable="!isDisabled(eo)"
            @dragstart="startDragEO($event, eo)"
            class="ma-3 carrier-logo"
            :disabled="isDisabled(eo)"
            v-if="eo.data.droppable"
          />
        </template>
        <span>{{ eo.data.name }}</span>
      </v-tooltip>
    </div>
  </v-col>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
export default {
  props: {
    nodes: {
      type: Array,
      default: () => [],
    },
    countryNode: {
      type: Object,
      default: null,
    },
    clientId: {
      type: Number,
      default: null,
    },
  },

  computed: {
    ...mapGetters(["linehaulConfig"]),
    linehaulTypes() {
      if (this.linehaulConfig?.entity_objects?.length) {
        return this.linehaulConfig.entity_objects.map((i) => {
          return {
            id: "",
            country: null,
            x: 0,
            y: 0,
            data: i,
            type: i.code,
            width: 90,
            height: 60,
            carrier_ids: [],
            carrier_settings: [],
          };
        });
      } else {
        return [];
      }
    },
  },
  data() {
    return {
      carriersLoader: false,
      carriers: [],
      countryCarriers: {},
    };
  },
  mounted() {
    this.fetchCarriers();
  },
  watch: {
    countryNode() {
      this.fetchCarriers();
    },
  },
  methods: {
    ...mapActions(["getCarriers", "snackBar"]),
    ...mapMutations(["setCarriers"]),
    fetchCarriers() {
      if (!this.countryNode) return;
      if (this.countryCarriers[this.countryNode.countryCode]) {
        this.carriers = this.countryCarriers[this.countryNode.countryCode];
        this.setCarriers(this.countryCarriers[this.countryNode.countryCode]);
        return;
      }
      this.carriersLoader = true;
      this.getCarriers({
        country_code: this.countryNode.countryCode,
        filter_type: this.countryNode.type,
        pagination: 0,
        fields: "id,name,carrier_code,carrier_logo",
        client_id: this.clientId,
      })
        .then((res) => {
          this.carriersLoader = false;
          this.carriers = res.data;
          this.setCarriers(res.data);
          this.countryCarriers[this.countryNode.countryCode] = res.data;
        })
        .catch(() => {
          this.carriersLoader = false;
        });
    },
    getItem(item) {
      return {
        id: "carrier-" + this.countryNode.data.code + "-" + item.id,
        countryCode: this.countryNode.data.code,
        data: item,
        type: "carrier",
        x: 0,
        y: 0,
        width: 80,
        height: 60,
        carrier_ids: [item.id],
        carrier_settings: [
          {
            entity_id: item.id,
            restrictions: {
              customers: [],
              city_postals: [],
              weight_ranges: [],
              dimensions: [],
            },
          },
        ],
      };
    },
    startDrag(e, item) {
      e.dataTransfer.setData("carrier", JSON.stringify(this.getItem(item)));
    },
    addCarrier(item) {
      this.$emit("addCarrier", this.getItem(item));
    },
    startDragEO(e, item) {
      item.id =
        item.type + "-" + this.countryNode.data.code + "-" + +new Date();
      item.countryCode = this.countryNode.data.code;
      e.dataTransfer.setData("carrier", JSON.stringify(item));
    },
    addEO(item) {
      if (!this.countryNode) return;
      if (this.countryNode.data.code === "terminal") {
        item.id =
          this.linehaulConfig.settings.terminal_country_code +
          "-" +
          +new Date();
        item.countryCode = this.linehaulConfig.settings.terminal_country_code;
      } else {
        item.id = this.countryNode.data.code + "-" + +new Date();
        item.countryCode = this.countryNode.data.code;
      }
      this.$emit("addCarrier", this.lodash.cloneDeep(item));
    },
    addEntityNode(type) {
      this.addEO(this.linehaulTypes.find((n) => n.type === type));
    },
    isDisabled(eo) {
      let disabled = false;
      if (
        (eo.type === "origin_agent" ||
          eo.type === "last_mile_agent" ||
          eo.type === "client" ||
          eo.type === "consumer") &&
        this.nodes.findIndex((n) => n.type === eo.type) !== -1
      ) {
        disabled = true;
      } else if (
        eo.carrier_code &&
        this.nodes.findIndex(
          (n) => n.data?.carrier_code === eo.carrier_code
        ) !== -1
      ) {
        disabled = true;
      }
      return disabled;
    },
  },
};
</script>
<style scoped>
.ba-1 {
  border: 1px solid #e7e7e7;
  min-height: 100%;
  max-height: 500px;
  overflow-y: scroll;
  scrollbar-width: thin;
}
.carrier-logo {
  max-width: 30%;
  min-height: 20px;
}
[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
