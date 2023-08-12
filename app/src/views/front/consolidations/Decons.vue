<template>
  <v-dialog v-model="dialog" max-width="750px" @keydown.esc="close" persistent>
    <template v-slot:activator="{}">
      <v-btn color="info" dark class="mr-4 float-right" @click="openDialog()">
        Deconsolidate
      </v-btn>
    </template>
    <v-card :loading="loader">
      <v-form ref="form" class="mb-8" lazy-validation>
        <v-data-table
          :headers="headers"
          :items="field_conditions"
          hide-default-footer
          disable-pagination
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <span class="text-h6"> Deconsolidated Conditions </span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                dark
                small
                class="mb-2"
                @click="addCondition()"
              >
                <v-icon> mdi-plus </v-icon>
              </v-btn>
            </v-toolbar>
            <p class="ml-4">
              Please select one or more criteria to deconsolidate the inbound.
              Note that you can select multiple consolidations on the right to
              perform the deconsolidation in bulk.
            </p>
          </template>
          <template v-slot:[`item.field_map`]="{ item }">
            <v-select
              v-model="item.field_map"
              :items="fieldItems"
              item-key="field_map"
              item-text="name"
              item-value="field_map"
              :rules="[(v) => !!v || 'Field name is required.']"
              class="required"
            ></v-select>
          </template>
          <template v-slot:[`item.condition`]="{ item }">
            <v-select
              v-model="item.condition"
              :items="conditionItems(item.field_map)"
              :rules="[(v) => !!v || 'Condition type is required.']"
              item-key="condition"
              item-value="condition"
              item-text="name"
              class="required"
            ></v-select>
          </template>
          <template v-slot:[`item.condition_value`]="{ item }">
            <v-autocomplete
              v-if="fieldType(item.field_map) === 'country'"
              v-model="item.condition_value"
              :rules="[(v) => !!v || 'Value is required.']"
              :items="allCountries"
              class="required"
            ></v-autocomplete>
            <v-switch
              v-else-if="fieldType(item.field_map) === 'bool'"
              v-model="item.condition_value"
            ></v-switch>
            <v-text-field
              v-else
              v-model="item.condition_value"
              :rules="[(v) => (v && !!v.trim()) || 'Value is required.']"
              :type="
                fieldType(item.field_map) === 'int' ||
                fieldType(item.field_map) === 'float'
                  ? 'number'
                  : 'text'
              "
              class="required"
            ></v-text-field>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              small
              @click="removeCondition(item)"
              v-if="field_conditions.length > 1"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-form>
      <template v-if="deconsItems.length">
        <p class="ml-4">
          <span class="text-h6">Summary of what was deconsolidated</span><br />
          The following cargo is deconsolidated based on your conditions
        </p>
        <v-data-table
          :headers="dheaders"
          :items="deconsItems"
          hide-default-footer
          disable-pagination
        >
          <template v-slot:[`item.total_bags`]="{ item }">
            {{ item.total_bags | numFormat }}
          </template>
          <template v-slot:[`item.total_value`]="{ item }">
            {{ item.total_value | numFormat }}
          </template>
          <template v-slot:[`item.total_packages`]="{ item }">
            {{ item.total_packages | numFormat }}
          </template>
        </v-data-table>
      </template>
      <template v-if="remainsItems.length">
        <p class="ml-4 mt-4">
          <span class="text-h6">Summary of what remains</span> <br />
          Based on your deconsolidation, the below cargo remains. Note that you
          can further deconsolidate or merge later.
        </p>
        <v-data-table
          :headers="dheaders"
          :items="remainsItems"
          hide-default-footer
          disable-pagination
        >
          <template v-slot:[`item.total_bags`]="{ item }">
            {{ item.total_bags | numFormat }}
          </template>
          <template v-slot:[`item.total_value`]="{ item }">
            {{ item.total_value | numFormat }}
          </template>
          <template v-slot:[`item.total_packages`]="{ item }">
            {{ item.total_packages | numFormat }}
          </template>
        </v-data-table>
      </template>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
        <v-btn color="primary" @click="save(false)" :loading="reviewLoader">
          Review
        </v-btn>
        <v-btn
          v-if="deconsItems.length"
          color="primary"
          @click="save(true)"
          :loading="confirmLoader"
        >
          Confirm Deconsolidation
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";
import { countries } from "@/config/data";
export default {
  props: {
    operationNumbers: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "consolidation",
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
      dialog: false,
      headers: [
        {
          text: "Fields",
          value: "field_map",
          class: "body-1 font-weight-bold",
          width: "30%",
        },
        {
          text: "Condition",
          value: "condition",
          class: "body-1 font-weight-bold",
          width: "30%",
        },
        {
          text: "Value",
          value: "condition_value",
          class: "body-1 font-weight-bold",
          width: "30%",
        },
        {
          text: "#",
          value: "actions",
          sortable: false,
          class: "body-1 font-weight-bold",
          width: "10%",
        },
      ],
      field_conditions: [
        {
          field_map: null,
          condition: null,
          condition_value: null,
        },
      ],
      fieldItems: [],
      reviewLoader: false,
      confirmLoader: false,
      dheaders: [
        {
          text: "Cons Number",
          value: "consolidation_number",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Total Pcs",
          value: "total_packages",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Total Bags",
          value: "total_bags",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Value (USD)",
          value: "total_value",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Destinations",
          value: "destinations",
          class: "body-1 font-weight-bold",
        },
      ],
      deconsItems: [],
      remainsItems: [],
      loader: false,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.fetchDeconsolidateFields();
  },
  methods: {
    ...mapActions(["getDeconsolidateFields", "deConsolidateIt", "snackBar"]),
    openDialog() {
      if (this.operationNumbers.length === 0) {
        return this.snackBar({
          color: "error",
          message: "Please select at least one record.",
        });
      }
      this.dialog = true;
    },
    fetchDeconsolidateFields() {
      this.getDeconsolidateFields()
        .then((res) => {
          this.loader = false;
          this.fieldItems = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    conditionItems(name) {
      if (!name || !this.fieldItems) return [];
      return this.fieldItems.find((i) => i.field_map === name).conditions;
    },
    fieldType(name) {
      if (!name || !this.fieldItems) return [];
      return this.fieldItems.find((i) => i.field_map === name).field_type;
    },
    opType(name) {
      if (!name || !this.fieldItems) return [];
      return this.fieldItems.find((i) => i.field_map === name).operation_type;
    },
    addCondition() {
      this.field_conditions.push({
        field_map: null,
        condition: null,
        condition_value: null,
      });
    },
    removeCondition(item) {
      this.field_conditions.splice(
        this.field_conditions.findIndex(
          (i) =>
            i.field_map === item.field_map &&
            i.condition === item.condition &&
            i.condition_value === item.condition_value
        ),
        1
      );
    },
    close() {
      this.dialog = false;
    },
    save(confirm = false) {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (confirm) {
        this.confirmLoader = true;
      } else {
        this.reviewLoader = true;
      }
      this.deConsolidateIt({
        confirm,
        consolidation_numbers: this.operationNumbers.map(
          (i) => i.operation_number || i.consolidation_number
        ),
        type: this.type,
        field_conditions: this.field_conditions.map((i) => {
          i.operation_type = this.opType(i.field_map);
          return i;
        }),
      })
        .then((res) => {
          if (confirm) {
            this.confirmLoader = false;
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
            this.$emit("refresh");
            this.close();
          } else {
            this.reviewLoader = false;
            this.deconsItems = res.data.deconsolidation_summary;
            this.remainsItems = res.data.remaining_summary;
          }
        })
        .catch(() => {
          this.confirmLoader = false;
          this.reviewLoader = false;
        });
    },
  },
};
</script>
