<!-- #9 -->
<template>
  <v-col class="mx-4">
    <v-progress-linear
      :active="pageLoader"
      :indeterminate="pageLoader"
    ></v-progress-linear>
    <v-form ref="form" v-if="codeDetails" lazy-validation>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="pb-0">
              <span class="body-1 font-weight-bold"
                >Code Details
                <i class="caption red--text ml-4"> * required field</i>
              </span>
              <v-btn
                color="primary"
                dark
                class="mb-2 float-right"
                :loading="saveLoader"
                v-if="can('app_service_label_splitcode_update')"
                @click="save()"
              >
                Save
              </v-btn>
            </v-col>
            <v-col cols="12" md="4" sm="6">
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
                    :value="getFormattedDate(codeDetails.activation_date)"
                    label="Split Activation Date"
                    :rules="[
                      (v) =>
                        (v && !!v.trim()) ||
                        'Split activation date is required',
                    ]"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    class="required"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="codeDetails.activation_date"
                  @input="dateMenu = false"
                  :min="new Date().toISOString()"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="codeDetails.name"
                label="Split Name"
                :rules="[(v) => (v && !!v.trim()) || 'Split Name is required.']"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="codeDetails.description"
                label="Split Description"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Split description is required.',
                ]"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="codeDetails.code"
                label="Split code"
                :rules="[(v) => (v && !!v.trim()) || 'Split code is required.']"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-switch
                v-model.number="codeDetails.status"
                :true-value="1"
                :false-value="0"
                label="Active"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-data-table
        :headers="headers"
        :items="codeDetails.conditions"
        class="elevation-1"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title
              ><span class="body-1 font-weight-bold"
                >Define Your Split’s Condition</span
              >
              <span class="body-2">
                (<sup>*</sup>Minimum two conditions)</span
              ></v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              dark
              small
              class="mb-2"
              @click="addCondition()"
              :disabled="!can('app_service_label_splitcodeconditions_create')"
            >
              <v-icon> mdi-plus </v-icon>
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:[`item.field_name`]="{ item }">
          <v-select
            v-model="item.field_name"
            :items="fieldItems"
            item-key="name"
            item-text="label"
            item-value="name"
            :rules="[(v) => !!v || 'Field name is required.']"
            class="required"
          ></v-select>
        </template>
        <template v-slot:[`item.condition`]="{ item }">
          <v-select
            v-model="item.condition"
            :items="conditionItems(item.field_name)"
            :rules="[(v) => !!v || 'Condition type is required.']"
            item-key="condition"
            item-value="condition"
            item-text="name"
            class="required"
          ></v-select>
        </template>
        <template v-slot:[`item.value`]="{ item }">
          <v-autocomplete
            v-if="fieldType(item.field_name) === 'country'"
            v-model="item.value"
            :rules="[(v) => !!v || 'Value is required.']"
            :items="allCountries"
            class="required"
          ></v-autocomplete>
          <v-switch
            v-else-if="fieldType(item.field_name) === 'bool'"
            v-model="item.value"
          ></v-switch>
          <v-text-field
            v-else
            v-model="item.value"
            :rules="[(v) => (v && !!v.trim()) || 'Value is required.']"
            :type="
              fieldType(item.field_name) === 'int' ||
              fieldType(item.field_name) === 'float'
                ? 'number'
                : 'text'
            "
            class="required"
          ></v-text-field>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            @click="removeCondition(item)"
            :disabled="
              codeDetails.conditions.length <= 2 ||
              !can('app_service_label_splitcodeconditions_delete')
            "
            icon
          >
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-form>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
import { countries } from "@/config/data";
export default {
  components: {},
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
      dateMenu: false,
      date: null,
      headers: [
        {
          text: "Parcel Fields",
          value: "field_name",
          class: "body-1 font-weight-bold",
          width: "30%",
        },
        {
          text: "Condition Type​",
          value: "condition",
          class: "body-1 font-weight-bold",
          width: "30%",
        },
        {
          text: "Value",
          value: "value",
          class: "body-1 font-weight-bold",
          width: "30%",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "body-1 font-weight-bold",
          width: "10%",
        },
      ],
      codeDetails: null,
      fieldItems: [],
      pageLoader: false,
      saveLoader: false,
    };
  },
  created() {
    if (+this.$route.params.id !== 0) {
      this.fetchSplitCodeDetails();
    } else {
      this.codeDetails = {
        name: null,
        code: null,
        description: null,
        date: null,
        status: 1,
        conditions: [
          {
            field_name: null,
            condition: null,
            value: null,
          },
          {
            field_name: null,
            condition: null,
            value: null,
          },
        ],
      };
    }
    this.fetchSplitCodeFields();
  },
  methods: {
    ...mapActions([
      "snackBar",
      "getSplitCodeDetails",
      "createSplitCode",
      "updateSplitCode",
      "getSplitCodeFields",
    ]),
    fetchSplitCodeDetails() {
      this.pageLoader = true;
      this.getSplitCodeDetails(this.$route.params.id)
        .then((res) => {
          this.pageLoader = false;
          this.codeDetails = res.data;
        })
        .catch(() => {
          this.pageLoader = false;
        });
    },
    addCondition() {
      this.codeDetails.conditions.push({
        field_name: null,
        condition: null,
        value: null,
      });
    },
    removeCondition(item) {
      this.codeDetails.conditions.splice(
        this.codeDetails.conditions.findIndex(
          (i) =>
            i.field_name === item.field_name &&
            i.condition === item.condition &&
            i.value === item.value
        ),
        1
      );
    },
    conditionItems(name) {
      if (!name || !this.fieldItems) return [];
      return this.fieldItems.find((i) => i.name === name).conditions;
    },
    fieldType(name) {
      if (!name || !this.fieldItems) return [];
      return this.fieldItems.find((i) => i.name === name).type;
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      if (+this.$route.params.id !== 0) {
        this.updateSplitCode({
          id: this.$route.params.id,
          data: this.codeDetails,
        })
          .then((res) => {
            this.saveLoader = false;
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
          })
          .catch(() => {
            this.saveLoader = false;
          });
      } else {
        this.createSplitCode(this.codeDetails)
          .then((res) => {
            this.saveLoader = false;
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
            this.$router.replace({
              name: "SplitCodes",
            });
          })
          .catch(() => {
            this.saveLoader = false;
          });
      }
    },
    fetchSplitCodeFields() {
      this.getSplitCodeFields()
        .then((res) => {
          this.pageLoader = false;
          this.fieldItems = res.data;
        })
        .catch(() => {
          this.pageLoader = false;
        });
    },
  },
};
</script>
