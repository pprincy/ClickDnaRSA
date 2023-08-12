<!-- #40 -->
<template>
  <v-col class="mx-4">
    <v-row>
      <v-col class="pb-0 my-4 d-flex justify-space-between align-center">
        <div>
          <span class="text-h6 ml-2">Set Alerts</span><br />
          <span class="ml-2"
            >Set alerts for certain events for inbound and outbound and assigned
            an email address as a target notice.</span
          >
        </div>
        <v-btn class="primary float-right" @click="save()" :loading="pageLoader"
          >Update</v-btn
        >
      </v-col>
    </v-row>
    <v-card class="mt-4" :loading="pageLoader">
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row v-show="$vuetify.breakpoint.mdAndUp">
            <v-col class="pb-0">
              <p class="body-1 font-weight-bold">Condition</p>
            </v-col>
            <v-col class="pb-0 text-center">
              <p class="body-1 font-weight-bold">Time Frame</p>
            </v-col>
            <v-col class="pb-0">
              <p class="body-1 font-weight-bold">Targeted Email Address</p>
            </v-col>
            <v-col class="pb-0 text-center">
              <p class="body-1 font-weight-bold">
                Repeat Alert at Set Time <br />
                (Exclude the minute timeframe)
              </p>
            </v-col>
          </v-row>
          <v-row align="end" v-for="(item, i) in settings" :key="i">
            <v-col cols="12" md="3" sm="6" xs="12" class="py-0">
              <v-text-field :label="item.condition" disabled></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="6" xs="12" class="py-0">
              <div class="d-flex justify-space-between text-center">
                <div class="mx-2">
                  <p class="py-0" v-if="i === 0"><strong>Minutes</strong></p>
                  <v-text-field
                    class="centered-input"
                    v-model="item.minutes"
                    :disabled="!!(item.hours || item.days)"
                    solo
                    readonly
                  >
                    <v-icon
                      slot="prepend-inner"
                      color="green"
                      :disabled="!!(item.hours || item.days)"
                      @click="decreseQty(item, 'minutes')"
                    >
                      mdi-minus
                    </v-icon>
                    <v-icon
                      slot="append"
                      color="red"
                      :disabled="!!(item.hours || item.days)"
                      @click="increaseQty(item, 'minutes')"
                    >
                      mdi-plus
                    </v-icon>
                  </v-text-field>
                </div>
                <div class="mx-2">
                  <p class="py-0" v-if="i === 0"><strong>Hours</strong></p>
                  <v-text-field
                    class="centered-input"
                    v-model="item.hours"
                    :disabled="!!(item.minutes || item.days)"
                    readonly
                    solo
                  >
                    <v-icon
                      slot="prepend-inner"
                      color="green"
                      :disabled="!!(item.minutes || item.days)"
                      @click="decreseQty(item, 'hours')"
                    >
                      mdi-minus
                    </v-icon>
                    <v-icon
                      slot="append"
                      color="red"
                      :disabled="!!(item.minutes || item.days)"
                      @click="increaseQty(item, 'hours')"
                    >
                      mdi-plus
                    </v-icon>
                  </v-text-field>
                </div>
                <div class="mx-2">
                  <p class="py-0" v-if="i === 0"><strong>Days</strong></p>
                  <v-text-field
                    class="centered-input"
                    v-model="item.days"
                    :disabled="!!(item.hours || item.minutes)"
                    readonly
                    solo
                  >
                    <v-icon
                      slot="prepend-inner"
                      color="green"
                      :disabled="
                        !!(item.days === 0 || item.hours || item.minutes)
                      "
                      @click="decreseQty(item, 'days')"
                    >
                      mdi-minus
                    </v-icon>
                    <v-icon
                      slot="append"
                      color="red"
                      :disabled="!!(item.hours || item.minutes)"
                      @click="increaseQty(item, 'days')"
                    >
                      mdi-plus
                    </v-icon>
                  </v-text-field>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="3" sm="6" xs="12" class="py-0">
              <v-combobox
                chips
                clearable
                label="Email Address"
                v-model="item.alert_emails"
                :rules="emailRules"
                append-icon=""
                multiple
              >
              </v-combobox>
            </v-col>
            <v-col
              cols="12"
              md="3"
              sm="6"
              xs="12"
              class="py-0 d-flex justify-center"
            >
              <v-checkbox v-model="item.alert_repeat"></v-checkbox>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      pageLoader: false,
      settings: [],
      emailRules: [
        (v) => {
          if (v.length > 0) {
            for (let i = 0; i < v.length; i++) {
              if (!/.+@.+/.test(v[i])) {
                return "E-mail must be valid";
              }
            }
          }
          return true;
        },
      ],
    };
  },
  created() {
    this.fetchSettings();
  },
  methods: {
    ...mapActions(["getAlertSettings", "updateAlertSettings", "snackBar"]),
    fetchSettings() {
      this.pageLoader = true;
      this.getAlertSettings()
        .then((res) => {
          this.pageLoader = false;
          this.settings = res.data;
        })
        .catch(() => {
          this.pageLoader = false;
        });
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.pageLoader = true;
      this.updateAlertSettings(this.settings)
        .then((res) => {
          this.pageLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.pageLoader = false;
        });
    },
    increaseQty(item, t) {
      if (t === "hours") {
        item.hours = +item.hours + 1 === 60 ? 0 : +item.hours + 1;
      } else if (t === "minutes") {
        item.minutes = +item.minutes + 1 === 60 ? 0 : +item.minutes + 1;
      } else {
        item.days++;
      }
    },
    decreseQty(item, t) {
      if (t === "hours") {
        item.hours = +item.hours - 1 === -1 ? 59 : +item.hours - 1;
      } else if (t === "minutes") {
        item.minutes = +item.minutes - 1 === -1 ? 59 : +item.minutes - 1;
      } else {
        item.days--;
      }
    },
  },
};
</script>
