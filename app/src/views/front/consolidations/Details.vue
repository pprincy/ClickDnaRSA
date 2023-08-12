<!-- #21 -->
<template>
  <v-col class="ma-4">
    <p class="text-h6">
      {{
        +$route.query.r === 1
          ? "View"
          : +$route.params.id === 0
          ? "Create"
          : "Modify"
      }}
      a Consolidation
    </p>
    <v-stepper v-model="e1" class="man-config-sec" alt-labels non-linear>
      <v-stepper-header>
        <v-stepper-step editable :complete="e1 > 1" step="1">
          {{
            +$route.query.r === 1
              ? "View"
              : +$route.params.id === 0
              ? "Create"
              : "Modify"
          }}
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :editable="!!+$route.params.id || +e1 !== 1" step="2">
          Finalize
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <Create ref="createcons" />
          <v-btn
            class="float-right ma-6"
            color="primary"
            :loading="loader"
            :disabled="+$route.query.r === 1"
            @click="isValid()"
          >
            Continue <v-icon dark right> mdi-arrow-right </v-icon>
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <Finalize ref="finalcons" />
          <v-btn
            class="float-right"
            color="primary"
            :disabled="+$route.query.r === 1"
            :loading="floader"
            @click="save(1)"
          >
            Save & Finalize
            <v-icon dark right> mdi-checkbox-marked-circle </v-icon>
          </v-btn>
          <v-btn
            class="float-right mx-2"
            color="primary"
            :loading="loader"
            @click="save(0)"
            :disabled="+$route.query.r === 1"
          >
            Save <v-icon dark right> mdi-content-save </v-icon>
          </v-btn>
          <v-btn class="float-right" text @click="e1 = 1">
            <v-icon dark left> mdi-arrow-left </v-icon> Back
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-col>
</template>
<script>
import Create from "@/components/front/consolidations/Create.vue";
import Finalize from "@/components/front/consolidations/Finalize.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    Create,
    Finalize,
  },
  computed: {
    ...mapGetters(["consolidationObj", "userCategory"]),
  },
  data() {
    return {
      e1: 1,
      loader: false,
      floader: false,
    };
  },
  created() {
    this.fetchConsolidation();
  },
  methods: {
    ...mapActions([
      "getConsolidation",
      "createConsolidation",
      "updateConsolidation",
      "snackBar",
    ]),
    fetchConsolidation() {
      if (+this.$route.params.id !== 0) {
        this.getConsolidation(this.$route.params.id).then((res) => {
          this.$refs.createcons.selectedTrackingNo = [];
          this.$refs.createcons.selectedTrackingNo.push(
            ...res.data.bags.map((i) => i.bag_number)
          );
        });
      }
    },
    isValid() {
      if (
        +this.$route.params.id === 0 &&
        this.$refs.createcons.selectedTrackingNo.length === 0
      ) {
        return this.snackBar({
          color: "error",
          message: "Please add bags or tracking number",
        });
      } else {
        if (
          +this.$route.params.id &&
          this.$refs.createcons.selectedTrackingNo.length === 0
        ) {
          this.e1 = 2;
          return;
        }
        let api;
        if (+this.$route.params.id !== 0) {
          api = this.updateConsolidation({
            id: this.$route.params.id,
            data:
              this.userCategory.user_category === 3
                ? {
                    client_id: this.$refs.createcons.selectedClient.id,
                    tracking_numbers: this.$refs.createcons.selectedTrackingNo,
                  }
                : {
                    tracking_numbers: this.$refs.createcons.selectedTrackingNo,
                  },
          });
        } else {
          api = this.createConsolidation(
            this.userCategory.user_category === 3
              ? {
                  client_id: this.$refs.createcons.selectedClient.id,
                  tracking_numbers: this.$refs.createcons.selectedTrackingNo,
                }
              : {
                  tracking_numbers: this.$refs.createcons.selectedTrackingNo,
                }
          );
        }
        this.loader = true;
        api
          .then((res) => {
            this.loader = false;
            if (+this.$route.params.id === 0) {
              this.$router.replace({
                name: "ConsolidationsDetails",
                params: {
                  id: res.data.record_id,
                },
                query: this.$route.query,
              });
            }
            this.fetchConsolidation();
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
            this.e1 = 2;
          })
          .catch(() => {
            this.loader = false;
          });
      }
    },
    save(final) {
      if (final) {
        this.consolidationObj.status = "finalize";
        this.floader = true;
      } else {
        this.loader = true;
      }
      this.updateConsolidation({
        id: this.$route.params.id,
        data: {
          ...this.consolidationObj,
        },
      })
        .then((res) => {
          this.floader = false;
          this.loader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          if (final) {
            this.$router.replace({
              name: "Consolidations",
            });
          }
        })
        .catch(() => {
          this.floader = false;
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
