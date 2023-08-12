<template>
  <div class="d-flex flex-column align-center justify-center">
    <v-menu
      v-model="dateMenu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="auto"
      v-if="dateFields.includes(searchType)"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :value="getFormattedDate(search)"
          class="w-90 pt-0"
          placeholder="ddd DD MMM, YYYY"
          append-icon="mdi-calendar"
          readonly
          hide-details
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="search" @input="dateMenu = false"></v-date-picker>
    </v-menu>
    <v-select
      v-model="statusVal"
      v-else-if="selectFields.includes(searchType) && items.length"
      @change="changeStatus()"
      class="w-90 pt-0"
      :items="items"
      placeholder="Select"
      hide-details
    ></v-select>
    <v-autocomplete
      v-model="countryCode"
      v-else-if="
        ['supported_countries', 'config_countries'].includes(searchType)
      "
      :items="allCountries"
      class="w-90 pt-0"
      placeholder="Select Country"
      @change="changeCountry"
      hide-details
    ></v-autocomplete>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Select search criteria below"
      class="w-90 pt-0"
      hide-details
      v-else
    ></v-text-field>
    <v-chip-group
      v-model="searchType"
      mandatory
      show-arrows
      active-class="primary"
      @change="updateSearchType()"
    >
      <v-chip v-for="(item, i) in searchOptions" :key="i" :value="item.value">
        {{ item.text }}
      </v-chip>
    </v-chip-group>
  </div>
</template>
<script>
import { countries } from "@/config/data";
export default {
  props: {
    searchOptions: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    val: {
      type: String,
      default: null,
    },
  },
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
      search: null,
      searchType: null,
      timerId: null,
      dateMenu: false,
      statusVal: null,
      countryCode: null,
      selectFields: [
        "status",
        "rsa_status",
        "client_status",
        "seller_status",
        "tool",
        "type",
        "doc_status",
        "doc_type",
        "boe_item_count",
      ],
      dateFields: [
        "ready_date",
        "arrival_date",
        "departure_date",
        "invoice_date",
      ],
    };
  },
  watch: {
    search() {
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.$emit("changeText", this.search);
      }, 300);
    },
  },
  methods: {
    updateSearchType() {
      if (this.selectFields.includes(this.searchType)) {
        this.$emit("changeText", "");
      }
      this.$emit("changeType", this.searchType);
    },
    changeStatus() {
      this.$emit("changeText", this.statusVal.toString());
    },
    changeCountry() {
      this.$emit("changeText", this.countryCode);
    },
  },
};
</script>
