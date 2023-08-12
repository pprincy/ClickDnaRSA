<template>
  <v-expansion-panels class="mt-10" v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-header class="white--text" color="primary">
        API Authentication Setup
        <i class="caption red--text ml-4"> * required field</i>
        <template v-slot:actions>
          <v-icon color="white"> $expand </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form ref="form">
          <v-row>
            <v-col cols="2">
              <v-select
                label="Type"
                v-model="authDetails.auth_type"
                :items="authTypes"
              ></v-select>
            </v-col>
            <v-col cols="10">
              <v-row v-if="authDetails.auth_type === 'api_key'">
                <v-col class="d-flex">
                  <v-text-field
                    label="API Key Name"
                    :rules="[
                      (v) => (v && !!v.trim()) || 'API Key Name is required',
                    ]"
                    v-model="authDetails.api_key_name"
                    class="required"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="Value"
                    :rules="[
                      (v) => (v && !!v.trim()) || 'API Key Value is required',
                    ]"
                    v-model="authDetails.api_key_value"
                    class="required"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-select
                    label="Add To"
                    v-model="authDetails.api_key_add_to"
                    :items="addTos"
                    :rules="[(v) => !!v || 'This is required field']"
                    class="required"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-if="authDetails.auth_type === 'api_key'">
                <v-col class="d-flex">
                  <v-text-field
                    label="Generate Token Endpoint"
                    v-model="authDetails.api_key_generate_token_endpoint"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-switch
                    label="Token Has Expiry"
                    v-model="authDetails.api_key_has_token_expiry"
                  ></v-switch>
                </v-col>
                <v-col>
                  <v-text-field
                    label="JSON Expire Attribute"
                    placeholder="Name"
                    v-model="authDetails.api_key_json_expire_attribute"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-select
                    label="Timestamp Format"
                    v-model="authDetails.api_key_timestamp_format"
                    :items="timestampFormats"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-if="authDetails.auth_type === 'basic_auth'">
                <v-col class="d-flex">
                  <v-text-field
                    label="Username"
                    v-model="authDetails.basic_username"
                    :rules="[
                      (v) => (v && !!v.trim()) || 'Username is required',
                    ]"
                    class="required"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    type="password"
                    label="Password"
                    v-model="authDetails.basic_password"
                    :rules="[
                      (v) => (v && !!v.trim()) || 'Password is required',
                    ]"
                    class="required"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="authDetails.auth_type === 'bearer_token'">
                <v-col class="d-flex">
                  <v-text-field
                    label="Bearer Token"
                    v-model="authDetails.bearer_token"
                    :rules="[
                      (v) => (v && !!v.trim()) || 'Bearer Token is required',
                    ]"
                    class="required"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="authDetails.auth_type === 'oauth_2_0'">
                <v-col cols="3">
                  <v-select
                    label="Grant Type"
                    v-model="authDetails.grant_type"
                    :items="authGrantTypes"
                  ></v-select>
                </v-col>
                <v-col>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        label="Token Name"
                        v-model="authDetails.token_name"
                        :rules="[
                          (v) => (v && !!v.trim()) || 'Token Name is required',
                        ]"
                        class="required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Client Secret"
                        v-model="authDetails.client_secret"
                        :rules="[
                          (v) =>
                            (v && !!v.trim()) || 'Client Secret is required',
                        ]"
                        class="required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Callback URL"
                        v-model="authDetails.callback_url"
                        :rules="[
                          (v) =>
                            (v && !!v.trim()) || 'Callback URL is required',
                        ]"
                        class="required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Scope"
                        v-model="authDetails.scope"
                        :rules="[
                          (v) => (v && !!v.trim()) || 'Scope is required',
                        ]"
                        class="required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Auth URL"
                        v-model="authDetails.auth_url"
                        :rules="[
                          (v) => (v && !!v.trim()) || 'Auth URL is required',
                        ]"
                        class="required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="State"
                        v-model="authDetails.state"
                        :rules="[
                          (v) => (v && !!v.trim()) || 'State is required',
                        ]"
                        class="required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Client ID"
                        v-model="authDetails.client_id"
                        :rules="[
                          (v) => (v && !!v.trim()) || 'Client ID is required',
                        ]"
                        class="required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        label="Client Authentication"
                        v-model="authDetails.client_authentication"
                        :items="clientAuths"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="mb-10"
              @click="save"
              :loading="saveLoader"
            >
              Save
            </v-btn>
          </v-row>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      authTypes: [
        {
          text: "API Key",
          value: "api_key",
        },
        {
          text: "Bearer Token",
          value: "bearer_token",
        },
        {
          text: "Basic Auth",
          value: "basic_auth",
        },
        {
          text: "OAuth 2.0",
          value: "oauth_2_0",
        },
      ],
      authGrantTypes: [
        {
          text: "Authorization Code",
          value: "authorization_code",
        },
        {
          text: "Authorization Code (PKCE)",
          value: "authorization_code_pkce",
        },
        {
          text: "Implicit",
          value: "implicit",
        },
        {
          text: "Password Credentials",
          value: "password_credentials",
        },
        {
          text: "Client Credentials",
          value: "client_credentials",
        },
      ],
      timestampFormats: [
        {
          text: "dd:MM:yyyy HH:mm",
          value: "%d:%m:%Y %H:%M",
        },
        {
          text: "yyyy:MM:dd HH:mm",
          value: "%Y:%m:%d %H:%M",
        },
      ],
      clientAuths: [
        {
          text: "Send as Basic Auth Header",
          value: "basic_auth_header",
        },
        {
          text: "Send Client Credentials in Body",
          value: "credential_in_body",
        },
      ],
      addTos: [
        {
          text: "Request Header",
          value: "header",
        },
        {
          text: "Query Params",
          value: "query_params",
        },
        {
          text: "Body",
          value: "body",
        },
      ],
      panel: 0,
      loader: false,
      saveLoader: false,
      authDetails: {},
    };
  },
  created() {
    this.fetchAuthSubscriptions();
  },
  methods: {
    ...mapActions([
      "getAuthSubscriptions",
      "updateAuthSubscriptions",
      "snackBar",
    ]),
    fetchAuthSubscriptions() {
      this.loader = true;
      this.getAuthSubscriptions()
        .then((res) => {
          this.loader = false;
          this.authDetails = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.saveLoader = true;
      this.updateAuthSubscriptions(this.authDetails)
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
    },
  },
};
</script>
