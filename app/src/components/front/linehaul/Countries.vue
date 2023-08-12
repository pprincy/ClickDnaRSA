<template>
  <v-col cols="12" md="2">
    <v-autocomplete
      v-model="selectedClientId"
      :items="clients"
      :loading="clientLoader"
      item-text="name"
      item-value="id"
      label="Select Client"
      placeholder="Start typing to Search"
      class="required"
      :rules="[(v) => !!v || 'Please select client']"
      outlined
      autofocus
      @change="
        $emit('updateClientId', selectedClientId, fetchLinehaulConfigId())
      "
      :disabled="disabledClientId"
    ></v-autocomplete>
    <div :disabled="!selectedClientId">
      <p class="pa-0 ma-0 d-flex align-center" v-if="carriers && !origin">
        <v-chip color="primary"> 1 </v-chip>
        <span class="ml-2">
          Please drag-drop origin country from the list to canvas.
        </span>
      </p>
      <p
        class="pa-0 ma-0 d-flex align-center"
        v-if="carriers && origin && !destination"
      >
        <v-chip color="primary"> 2 </v-chip>
        <span class="ml-2">
          Please drag-drop destination country from the list to canvas.
        </span>
      </p>
      <v-text-field
        label="Country"
        placeholder="Search Country/Code"
        v-model="search"
        append-icon="mdi-magnify"
        hide-details
      ></v-text-field>
      <div class="ba-1">
        <v-progress-linear
          :active="!linehaulConfig"
          :indeterminate="!linehaulConfig"
          color="deep-purple accent-4"
        ></v-progress-linear>
        <v-tooltip
          v-for="(c, i) in allCountries"
          :key="i"
          :disabled="isDisabled(c)"
          right
        >
          <template v-slot:activator="{ on, attrs }">
            <img
              v-on="on"
              v-bind="attrs"
              :src="c.flag_url | assetURL"
              alt=""
              :draggable="!isDisabled(c)"
              @dragstart="startDrag($event, c)"
              @dblclick.stop="addCountry(c)"
              class="ma-3 company-logo"
              :disabled="isDisabled(c)"
            />
          </template>
          <span>{{ c.name }}</span>
        </v-tooltip>
      </div>
    </div>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["carriers", "origin", "destination", "clientId", "disabledClientId"],
  computed: {
    ...mapGetters(["linehaulConfig"]),
    allCountries() {
      return this.linehaulConfig?.countries?.filter((c) => {
        return (
          c.name.toLowerCase().includes(this.search.toLowerCase()) ||
          c.code.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
  },
  data() {
    return {
      search: "",
      clientLoader: false,
      clients: [],
      selectedClientId: null,
    };
  },
  watch: {
    clientId(val) {
      this.selectedClientId = val;
    },
  },
  mounted() {
    this.fetchClientList();
  },
  methods: {
    ...mapActions(["getClients", "getLinehaulConfigAddId", "snackBar"]),
    fetchClientList() {
      if (this.clients.length) return;
      this.clientLoader = true;
      this.getClients({
        fields: "id,name",
        pagination: 0,
        service: "clickdna",
      })
        .then((res) => {
          this.clientLoader = false;
          this.clients = res.data;
        })
        .catch(() => {
          this.clientLoader = false;
        });
    },
    getItem(item) {
      return {
        id: item.code + "-" + item.id,
        countryCode: item.code,
        x: 0,
        y: 0,
        data: item,
        type: "origin",
        width: 90,
        height: 60,
      };
    },
    startDrag(e, item) {
      e.dataTransfer.setData("country", JSON.stringify(this.getItem(item)));
    },
    addCountry(item) {
      this.$emit("addCountry", this.getItem(item));
    },
    isDisabled(c) {
      let disabled = false;
      if (
        (this.origin && this.destination) ||
        c.code === this.origin?.code ||
        c.code === this.destination?.code
      ) {
        disabled = true;
      }
      return disabled;
    },
    fetchLinehaulConfigId() {
      this.getLinehaulConfigAddId(this.selectedClientId)
        .then((res) => {
          console.log("res", res);
        })
        .catch(() => {
          this.clientLoader = false;
        });
    },
  },
};
</script>
<style scoped>
.ba-1 {
  border: 1px solid #e7e7e7;
  min-height: 100%;
  max-height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.company-logo {
  min-width: 40px;
  height: 40px;
}
[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}
</style>
