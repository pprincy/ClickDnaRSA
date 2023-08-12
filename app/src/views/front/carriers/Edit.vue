<!-- #4 -->
<template>
  <v-col class="ma-4">
    <v-stepper v-model="e1" class="carriers-edit-sec" alt-labels non-linear>
      <v-stepper-header>
        <v-stepper-step editable :complete="e1 > 1" step="1">
          Profile
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step editable :complete="e1 > 2" step="2">
          Label Definition
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step editable :complete="e1 > 3" step="3">
          Country/City Coverage
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step editable step="4"> Tracking Mapping </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <Profile @continue="isProductSelected(2)" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <Label @continue="isProductSelected(3)" :e1.sync="e1" />
        </v-stepper-content>

        <v-stepper-content step="3">
          <Coverage />
          <v-btn
            class="float-right"
            color="primary"
            @click="isProductSelected(4)"
          >
            Continue <v-icon dark right> mdi-arrow-right </v-icon>
          </v-btn>
          <v-btn class="float-right" text @click="e1 = 2">
            <v-icon dark left> mdi-arrow-left </v-icon> Back
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="4">
          <TrackingMap :e1.sync="e1" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-col>
</template>
<script>
import Profile from "@/components/front/carriers/Profile.vue";
import Coverage from "@/components/front/carriers/Coverage.vue";
import Label from "@/components/front/carriers/Label.vue";
import TrackingMap from "@/components/front/carriers/TrackingMap.vue";
import { mapActions } from "vuex";
export default {
  components: {
    Profile,
    Coverage,
    Label,
    TrackingMap,
  },
  data() {
    return {
      e1: 1,
    };
  },
  methods: {
    ...mapActions(["snackBar"]),
    isProductSelected(step) {
      this.e1 = step;
    },
  },
};
</script>
<style>
.carriers-edit-sec .v-stepper__step__step {
  font-size: 1.3rem;
  height: 32px;
  width: 32px;
}
.carriers-edit-sec .v-stepper__label {
  text-align: center !important;
}
</style>
