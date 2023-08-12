<template>
  <v-dialog
    v-model="localDialog"
    @keydown.esc="$emit('close', false)"
    max-width="750px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit - {{ editedItem.client_name }}</span>
        <i class="caption red--text ml-4"> * required field</i>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="editedItem.name"
                label="Seller Company Name"
                :rules="[(v) => !!v || 'Field is required.']"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="editedItem.legal_name"
                label="Company Legal Name"
                :rules="[(v) => !!v || 'Field is required.']"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="email"
                v-model="editedItem.email"
                label="Email"
                :rules="[
                  (v) => !!v || 'Field is required',
                  (v) => /.+@.+\..+/.test(v) || 'E-mail address must be valid',
                ]"
                class="required"
                :disabled="
                  +defaultItem.rsa_status === 1 ||
                  +defaultItem.client_status === 1
                "
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Phone number"
                type="number"
                v-model="editedItem.phone_number"
                :rules="[(v) => !!v || 'Phone number is required.']"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                label="Country"
                :items="allCountries"
                v-model="editedItem.country_code"
                :rules="[(v) => !!v || 'Field is required.']"
                class="required"
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="editedItem.signatory_name"
                label="Signatory Name"
                :rules="[(v) => !!v || 'Field is required.']"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="editedItem.job_title"
                label="Job Title"
                :rules="[(v) => !!v || 'Field is required.']"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="editedItem.legal_postal_code"
                label="Legal Postal Code"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="editedItem.legal_address"
                label="Legal Address"
                :rules="[(v) => !!v || 'Field is required.']"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="6" v-if="userRole.code === 'AD'">
              <v-select
                v-model="editedItem.rsa_status"
                label="RSA Status"
                :rules="[
                  (v) =>
                    (v !== false && v !== '' && v !== null) ||
                    `Field is required.`,
                ]"
                :items="allSellerStatuses"
                class="required"
                :hint="
                  +editedItem.rsa_status === 1
                    ? 'Please verify that signature is done by signatory authority.'
                    : ''
                "
              >
                <template v-slot:message="{ message }">
                  <span
                    :class="{
                      'hint-text':
                        message ===
                        'Please verify that signature is done by signatory authority.',
                    }"
                    v-html="message"
                  ></span>
                </template>
              </v-select>
            </v-col>
            <v-col
              cols="6"
              v-if="
                userRole.code === 'AD' &&
                [2, 3].includes(+editedItem.rsa_status)
              "
            >
              <v-text-field
                v-model="editedItem.rsa_reason"
                label="RSA reason"
                :rules="[(v) => !!v || 'Field is required.']"
                class="required"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-file-input
                v-model="editedItem.agreement"
                show-size
                accept=".pdf"
                label="Upload Agreement"
                :rules="[
                  +editedItem.rsa_status === 1
                    ? (v) => !!v || 'File is required.'
                    : true,
                  (v) =>
                    !v ||
                    v.size < 4194304 ||
                    `File size should be less than 4 MB!`,
                  (v) =>
                    !v ||
                    ['application/pdf'].includes(v.type) ||
                    `PDF file required`,
                ]"
                prepend-icon=""
                append-icon="mdi-paperclip"
                v-if="!isURL(editedItem.agreement)"
                :class="{ required: editedItem.rsa_status === 1 }"
              >
              </v-file-input>
              <div class="d-flex justify-space-between my-4" v-else>
                <div>
                  <label
                    >Agreement PDF
                    <p class="agreement-modified">
                      {{
                        editedItem.agreement_modified_at
                          | localMoment
                          | moment("DD MMM, YYYY hh:mm A")
                      }}
                    </p>
                  </label>
                </div>
                <div>
                  <v-btn
                    v-if="editedItem.agreement"
                    :href="editedItem.agreement | assetURL"
                    target="_blank"
                    color="success"
                    class="mr-1"
                    small
                  >
                    View
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="editedItem.agreement = null"
                    small
                  >
                    Upload New
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="editedItem.client_status"
                label="Client Status"
                :rules="[
                  (v) =>
                    (v !== false && v !== '' && v !== null) ||
                    `Field is required.`,
                ]"
                :items="allSellerStatuses"
                class="required"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="editedItem.client_merchant_id"
                label="Merchant Token"
                :rules="[
                  (v) =>
                    +editedItem.client_status === 1
                      ? (v !== '' && v !== undefined) || 'Field is required'
                      : true,
                ]"
                :class="{ required: +editedItem.client_status === 1 }"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="number"
                v-model.number="editedItem.amazon_merchant_id"
                label="Amazon Merchant Token (Unencrypted)"
                onkeypress="return event.charCode >= 48"
                :rules="[
                  (v) =>
                    +editedItem.client_status === 1
                      ? (v !== '' && v !== undefined && v !== null) ||
                        'Field is required'
                      : true,
                  (v) =>
                    v === undefined ||
                    v === '' ||
                    v === null ||
                    v > 0 ||
                    'Number should be greater than 0',
                  (v) =>
                    v === undefined ||
                    v === '' ||
                    v === null ||
                    /^\d+$/.test(v) ||
                    'Point value not allowed',
                ]"
                :class="{ required: +editedItem.client_status === 1 }"
              ></v-text-field>
            </v-col>
            <v-col cols="6" v-if="[2, 3].includes(+editedItem.client_status)">
              <v-text-field
                v-model="editedItem.client_reason"
                label="Client reason"
                :rules="[(v) => !!v || 'Field is required.']"
                class="required"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('close', false)">
          Cancel
        </v-btn>
        <v-btn color="blue darken-1" text @click="save" :loading="saveLoader">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { countries } from "@/config/data";
export default {
  props: {
    defaultItem: {
      type: Object,
      default: () => {},
    },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["userRole", "sellerStatuses"]),
    allCountries() {
      return Object.keys(countries).map((i) => {
        return {
          text: countries[i],
          value: i,
        };
      });
    },
    allSellerStatuses() {
      return this.sellerStatuses.map((i) => {
        return {
          text: i.value,
          value: i.key,
        };
      });
    },
  },
  data() {
    return {
      localDialog: false,
      editedItem: {},
      saveLoader: false,
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
      this.editedItem = Object.assign({}, this.defaultItem);
    },
  },
  methods: {
    ...mapActions(["updateSellersUploadList", "snackBar"]),
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }

      const payload = new FormData();
      for (const field in this.editedItem) {
        if (
          field != "agreement_modified_at" &&
          field != "e_sign_link" &&
          field != "expiry_date"
        ) {
          if (Object.prototype.hasOwnProperty.call(this.editedItem, field)) {
            const fieldVal = this.editedItem[field];
            if ("File" in window && fieldVal instanceof File) {
              payload.append(field, fieldVal, fieldVal.name);
            } else if (!["agreement"].includes(field)) {
              payload.append(field, fieldVal === null ? "" : fieldVal);
            }
          }
        }
      }

      this.saveLoader = true;
      this.updateSellersUploadList({
        id: this.editedItem.id,
        data: payload,
      })
        .then((res) => {
          this.saveLoader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.$emit("refreshData");
          this.$emit("close", false);
        })
        .catch(() => {
          this.saveLoader = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.hint-text {
  font-weight: bold;
  color: #c9761a;
}
.agreement-modified {
  font-size: 12px;
}
</style>
