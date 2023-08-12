<template>
  <v-data-table
    :headers="_headers"
    v-model="selected"
    :items="trackingNumbers"
    :search="search"
    :loading="loader"
    item-key="tracking_number"
    class="elevation-1"
    show-group-by
    show-select
    hide-default-footer
    disable-pagination
  >
    <template v-slot:top>
      <v-row class="mt-0">
        <v-col
          cols="12"
          md="5"
          sm="12"
          class="d-flex flex-column align-left justify-center pt-0"
        >
          <v-toolbar-title class="pl-4 text-h6"
            >Tracking Summary</v-toolbar-title
          >
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="12"
          class="d-flex flex-column align-center justify-center pt-0"
        >
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            class="w-90 pt-0"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="12">
          <v-btn
            color="primary"
            dark
            class="mr-4 float-right"
            :loading="downloader"
            @click="download(selected, true)"
          >
            Download
          </v-btn>
          <v-btn
            color="primary"
            dark
            class="mr-4 float-right"
            @click="openEmail(1)"
          >
            Email
          </v-btn>
          <v-dialog
            v-model="dialog"
            width="600"
            @keydown.esc="dialog = false"
            persistent
          >
            <v-card>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title
                  >Enter Email Address
                  <i class="caption red--text ml-4"> * required field</i>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon>mdi-mail</v-icon>
              </v-toolbar>
              <v-card-text class="pa-4">
                <v-form ref="form" lazy-validation>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="email"
                        label="Email address"
                        name="email"
                        prepend-icon="mdi-mail"
                        type="text"
                        :rules="[
                          (v) =>
                            (v && !!v.trim()) || 'Email address is required',
                          (v) =>
                            /.+@.+\..+/.test(v) ||
                            'E-mail address must be valid',
                        ]"
                        class="required"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  :loading="loader"
                  @click="sendEmail(1)"
                >
                  Send
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </template>
    <template v-for="h in headers" v-slot:[`header.${h.sort}`]="{}">
      ss
    </template>
    <template
      v-slot:group.header="{ items, isOpen, toggle, remove, group, groupBy }"
    >
      <th colspan="4">
        <v-icon @click="toggle"
          >{{ isOpen ? "mdi-minus" : "mdi-plus" }}
        </v-icon>
        {{ getHeader(groupBy[0]) + " : " + group }}
      </th>
      <th>
        <v-icon @click="remove" color="darken-2" class="mr-2">
          mdi-close
        </v-icon>
        <v-icon
          @click="
            goToDetails({
              group,
              groupBy: groupBy[0],
            })
          "
          color="cyan darken-2"
        >
          mdi-arrow-right-bold-hexagon-outline
        </v-icon>
      </th>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon class="mr-2" @click="download([item], false)">
        mdi-download
      </v-icon>
      <v-icon class="mr-2" @click="openEmail(item)"> mdi-email </v-icon>
      <v-icon @click="goToDetails(item)" color="cyan darken-2">
        mdi-arrow-right-bold-hexagon-outline
      </v-icon>
    </template>
  </v-data-table>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "trackNos",
      "selectedTrackNo",
      "refNoData",
      "consNo",
      "userRole",
    ]),
    _headers() {
      return this.headers.filter((i) =>
        this.userRole.code !== "AD" ? i.value !== "client" : true
      );
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Client",
          value: "client",
          groupable: false,
          sortable: false,
          class: "body-1 font-weight-bold",
        },
        {
          text: "Origin",
          align: "start",
          value: "origin",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Destination",
          value: "destination",
          class: "body-1 font-weight-bold",
        },
        {
          text: "Tracking Number",
          value: "tracking_number",
          groupable: false,
          class: "body-1 font-weight-bold",
        },
        { text: "Status", value: "status", class: "body-1 font-weight-bold" },
        {
          text: "Actions",
          value: "actions",
          groupable: false,
          sortable: false,
          class: "body-1 font-weight-bold",
        },
      ],
      trackingNumbers: [],
      selected: [],
      search: "",
      loader: false,
      dialog: false,
      email: null,
      downloader: false,
    };
  },
  created() {
    this.fetchTrackNoSummary();
  },
  methods: {
    ...mapMutations(["setSelectedTrackNo"]),
    ...mapActions([
      "getTrackNoSummary",
      "getConsNoSummary",
      "sendTrackingEmail",
      "downloadTrackingInfo",
      "snackBar",
    ]),
    fetchTrackNoSummary() {
      this.loader = true;
      let api;
      if (this.trackNos.length) {
        api = this.getTrackNoSummary({
          tracking_numbers: this.trackNos,
        });
      } else if (this.consNo) {
        api = this.getConsNoSummary({
          consolidation_no: this.consNo,
        });
      } else if (this.refNoData) {
        api = this.getTrackNoSummary(this.refNoData);
      } else {
        if (this.$route.name === "TrackingSummary") {
          this.$router.replace({
            name: "Tracking",
          });
        } else {
          this.$router.replace({
            name: "ClientTracking",
          });
        }
      }
      api
        .then((res) => {
          this.loader = false;
          this.trackingNumbers = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    getHeader(value) {
      return this.headers.find((i) => i.value === value).text;
    },
    goToDetails(o) {
      if (o.groupBy) {
        this.setSelectedTrackNo(
          this.trackingNumbers
            .filter((i) => i[o.groupBy] === o.group)
            .map((t) => t.tracking_number)
        );
      } else {
        this.setSelectedTrackNo([o.tracking_number]);
      }
      if (this.$route.name === "TrackingSummary") {
        this.$router.push({
          name: "TrackingDetails",
          params: o,
        });
      } else {
        this.$router.push({
          name: "ClientTrackingDetails",
          params: o,
        });
      }
    },
    openEmail(item) {
      if (item === 1 && this.selected.length === 0) {
        return this.snackBar({
          color: "error",
          message: "Please select records",
        });
      } else if (item === 1) {
        this.dialog = true;
      } else {
        this.selected = [item];
        this.dialog = true;
      }
    },
    sendEmail() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loader = true;
      this.sendTrackingEmail({
        tracking_number: this.selected.map((i) => i.tracking_number),
      })
        .then((res) => {
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.dialog = false;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    download(items, all) {
      if (!items || items.length === 0) return;
      this.loader = true;
      if (all) this.downloader = true;
      this.downloadTrackingInfo({
        tracking_number: items.map((i) => i.tracking_number),
      })
        .then((res) => {
          this.loader = false;
          this.downloader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.fetchConsolidations();
        })
        .catch(() => {
          this.loader = false;
          this.receiveLoader = false;
        });
    },
  },
};
</script>
