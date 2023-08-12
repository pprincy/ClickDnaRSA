<template>
  <v-dialog
    v-model="localDialog"
    max-width="500px"
    @keydown.esc="$emit('close', false)"
    persistent
  >
    <v-card>
      <v-card-title class="text-h6" v-if="sellerData">
        CRM Details - {{ sellerData.name }}
      </v-card-title>
      <v-card-text>
        <v-progress-linear
          :active="crmLoader"
          :indeterminate="crmLoader"
          color="primary"
          v-if="crmLoader"
        ></v-progress-linear>
        <v-simple-table v-else>
          <template v-slot:default>
            <tbody>
              <tr>
                <td>Account</td>
                <td>
                  <a
                    :href="crmDetails.account_id_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-decoration-none"
                    v-if="crmDetails.account_id_url"
                    >{{
                      crmDetails.account_number
                        ? crmDetails.account_number
                        : "Click here"
                    }}</a
                  >
                  <span v-else>No Data Found</span>
                </td>
              </tr>
              <tr>
                <td>Opportunity</td>
                <td>
                  <a
                    :href="crmDetails.opportunity_id_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-decoration-none"
                    v-if="crmDetails.opportunity_id_url"
                  >
                    {{
                      crmDetails.opportunity
                        ? crmDetails.opportunity
                        : "Click here"
                    }}
                  </a>
                  <span v-else>No Data Found</span>
                  ( Status -
                  <strong
                    :class="
                      crmDetails.status === 'Pending'
                        ? 'red--text'
                        : 'green--text'
                    "
                  >
                    {{ crmDetails.status }}
                  </strong>
                  )
                </td>
              </tr>
              <tr>
                <td>Contact</td>
                <td>
                  <a
                    :href="crmDetails.contact_id_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-decoration-none"
                    v-if="crmDetails.contact_id_url"
                    >Click here</a
                  >
                  <span v-else>No Data Found</span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('close', false)">
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    sellerData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      localDialog: false,
      crmDetails: [],
      crmLoader: false,
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
      if (newVal) {
        this.fetchCRMDetails();
      }
    },
  },
  methods: {
    ...mapActions(["getCRMDetails"]),
    fetchCRMDetails() {
      this.crmDetails = [];
      this.crmLoader = true;
      this.getCRMDetails(this.sellerData.id)
        .then((res) => {
          this.crmLoader = false;
          this.crmDetails = res.data;
        })
        .catch(() => {
          this.crmLoader = false;
        });
    },
  },
};
</script>
