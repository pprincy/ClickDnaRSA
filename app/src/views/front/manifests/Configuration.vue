<!-- #14 -->
<template>
  <v-col class="ma-4">
    <p class="text-h6 ml-4">Change the fields downloaded on the manifest</p>
    <v-stepper v-model="e1" class="man-config-sec" alt-labels non-linear>
      <v-stepper-header>
        <v-stepper-step v-if="isAdmin" editable :complete="e1 > 1" step="1">
          Select Carrier
        </v-stepper-step>
        <v-divider v-if="isAdmin"></v-divider>

        <v-stepper-step
          :complete="e1 > step(2)"
          :editable="!isAdmin || +e1 !== 1"
          :step="step(2)"
        >
          Select Fields
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step
          :editable="!isAdmin || +e1 !== 1"
          :complete="e1 > step(3)"
          :step="step(3)"
        >
          Sorting
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step
          :editable="!isAdmin || +e1 !== 1"
          :complete="e1 > step(4)"
          :step="step(4)"
        >
          Headers
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :editable="!isAdmin || +e1 !== 1" :step="step(5)">
          Format
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-if="isAdmin" step="1">
          <Step1 ref="carriers" />
          <v-btn
            class="float-right ma-6"
            color="primary"
            :loading="loader"
            @click="isValid(2)"
          >
            Continue <v-icon dark right> mdi-arrow-right </v-icon>
          </v-btn>
        </v-stepper-content>

        <v-stepper-content :step="step(2)">
          <Step2 ref="fields" />
          <v-btn class="float-right" color="primary" @click="isValid(step(3))">
            Continue <v-icon dark right> mdi-arrow-right </v-icon>
          </v-btn>
          <v-btn v-if="isAdmin" class="float-right" text @click="e1 = 1">
            <v-icon dark left> mdi-arrow-left </v-icon> Back
          </v-btn>
        </v-stepper-content>

        <v-stepper-content :step="step(3)">
          <Step3 ref="sortfields" :e1.sync="e1" />
          <v-btn class="float-right" color="primary" @click="isValid(step(4))">
            Continue <v-icon dark right> mdi-arrow-right </v-icon>
          </v-btn>
          <v-btn class="float-right" text @click="e1 = step(2)">
            <v-icon dark left> mdi-arrow-left </v-icon> Back
          </v-btn>
        </v-stepper-content>

        <v-stepper-content :step="step(4)">
          <Step4 ref="headers" :e1.sync="e1" />
          <v-btn class="float-right" color="primary" @click="isValid(step(5))">
            Continue <v-icon dark right> mdi-arrow-right </v-icon>
          </v-btn>
          <v-btn class="float-right" text @click="e1 = step(3)">
            <v-icon dark left> mdi-arrow-left </v-icon> Back
          </v-btn>
        </v-stepper-content>

        <v-stepper-content :step="step(5)">
          <Step5 ref="format" :e1.sync="e1" />
          <v-btn
            class="float-right"
            color="primary"
            :loading="loader"
            @click="saveSettings()"
          >
            Finish <v-icon dark right> mdi-checkbox-marked-circle </v-icon>
          </v-btn>
          <v-btn class="float-right" text @click="e1 = step(4)">
            <v-icon dark left> mdi-arrow-left </v-icon> Back
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-col>
</template>
<script>
import Step1 from "@/components/front/manifests/config/Step1.vue";
import Step2 from "@/components/front/manifests/config/Step2.vue";
import Step3 from "@/components/front/manifests/config/Step3.vue";
import Step4 from "@/components/front/manifests/config/Step4.vue";
import Step5 from "@/components/front/manifests/config/Step5.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
  },
  computed: {
    ...mapGetters(["user", "manifestObj"]),
    isAdmin() {
      return this.user?.is_admin;
    },
  },
  data() {
    return {
      e1: 1,
      loader: false,
    };
  },
  mounted() {
    this.fetchSettings();
  },
  methods: {
    ...mapActions([
      "getManifestSettings",
      "updateManifestSettings",
      "snackBar",
    ]),
    selectedCarrier() {
      return !!this.$refs.carriers?.selectedCarrier[0]?.user_id;
    },
    fetchSettings() {
      if (!this.isAdmin) {
        this.loader = true;
        this.getManifestSettings({
          user_id: this.$refs.carriers?.selectedCarrier[0]?.user_id,
        })
          .then(() => (this.loader = false))
          .catch(() => (this.loader = false));
      }
    },
    isValid(step) {
      if (step === 2 && this.isAdmin) {
        if (!this.selectedCarrier()) {
          return this.snackBar({
            color: "error",
            message: "Please select any carrier to proceed",
          });
        } else {
          this.loader = true;
          this.getManifestSettings({
            user_id: this.$refs.carriers?.selectedCarrier[0]?.user_id,
          })
            .then(() => {
              this.loader = false;
              this.e1 = step;
            })
            .catch(() => (this.loader = false));
        }
      } else {
        this.e1 = step;
      }
    },
    step(num) {
      if (this.isAdmin) {
        return num;
      } else {
        return num - 1;
      }
    },
    saveSettings() {
      this.loader = true;
      this.updateManifestSettings(this.manifestObj)
        .then((res) => {
          this.loader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
<style>
.man-config-sec .v-stepper__step__step {
  font-size: 1.3rem;
  height: 32px;
  width: 32px;
}
.man-config-sec .v-stepper__label {
  text-align: center !important;
}
</style>
