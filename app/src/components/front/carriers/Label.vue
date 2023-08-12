<template>
  <v-col class="pa-0">
    <v-row>
      <v-col cols="6">
        <p class="font-weight-bold">Please select label type</p>
        <v-item-group v-model="selectedLabel" mandatory>
          <v-container>
            <v-row>
              <v-col v-for="lbl in labelTypes" :key="lbl.id" cols="12" md="4">
                <v-item
                  class="cur-pointer"
                  v-slot="{ active, toggle }"
                  :value="lbl.id"
                >
                  <div @click="toggle">
                    <v-img :src="lbl.icon | assetURL" class="text-right pa-2">
                      <v-btn v-if="active" color="primary" fab dark>
                        <v-icon> mdi-check </v-icon>
                      </v-btn>
                    </v-img>
                    <p class="text-h6 text-center">{{ lbl.name }}</p>
                  </div>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
      </v-col>
    </v-row>
    <v-row v-if="getCode(selectedLabel) === 'lastmile_hybrid'">
      <v-col cols="6">
        <p class="font-weight-bold">Please select barcode type</p>
        <v-select
          v-model="selectedBarcode"
          placeholder="Please select"
          class="shrink"
          :items="barcodeTypes"
          item-key="id"
          item-value="id"
          item-text="name"
        ></v-select>
      </v-col>
    </v-row>
    <v-btn
      class="float-right ma-2"
      color="primary"
      :loading="loader"
      @click="save()"
    >
      Save & Continue <v-icon dark right> mdi-arrow-right </v-icon>
    </v-btn>
    <v-btn class="float-right ma-2" text @click="$emit('update:e1', 1)">
      <v-icon dark left> mdi-arrow-left </v-icon> Back
    </v-btn>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["labelTypes", "barcodeTypes", "carrierDetails"]),
  },
  data() {
    return {
      selectedLabel: null,
      selectedBarcode: null,
      loader: false,
    };
  },
  watch: {
    carrierDetails(obj) {
      if (!obj) return;
      this.selectedLabel = obj.label_type_id;
      this.selectedBarcode = obj.barcode_type_id;
    },
  },
  created() {
    this.getLabelTypes();
    this.getBarcodeTypes();
  },
  methods: {
    ...mapActions([
      "getLabelTypes",
      "saveCarrierLabelDefinition",
      "getBarcodeTypes",
      "snackBar",
    ]),
    getCode(id) {
      return this.labelTypes?.find((i) => i.id === id)?.code;
    },
    save() {
      this.loader = true;
      this.saveCarrierLabelDefinition({
        carrierId: this.$route.params.id,
        data: {
          label_type_id: this.selectedLabel,
          barcode_type_id: this.selectedBarcode,
        },
      })
        .then((res) => {
          this.loader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.$emit("continue");
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
