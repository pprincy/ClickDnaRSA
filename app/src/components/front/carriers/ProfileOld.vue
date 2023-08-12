<template>
  <v-col class="pa-0">
    <v-row>
      <v-col cols="12" md="6" sm="6">
        <v-card>
          <v-row>
            <v-col cols="12">
              <p class="body-1 font-weight-bold">Company Details</p>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field label="Name"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-file-input
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick a logo"
                label="Logo"
              ></v-file-input>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Website"
                placeholder="https://"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                label="Environment"
                :items="['Sandbox', 'Production']"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                label="Service Types"
                :items="allServiceTypes"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <p class="body-1 font-weight-bold">
                Primary Consolidation Address
              </p>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field label="Email"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field label="Contact Number"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-autocomplete
                label="Country"
                :items="allCountries"
                v-model="addressForm.country_code"
                @change="
                  addressForm.city = null;
                  fetchCityList();
                "
                required
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field label="Address 1"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field label="Address 2"></v-text-field>
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="addressForm.city"
                :items="cities"
                :loading="cityLoader"
                :search-input.sync="searchCity"
                hide-no-data
                item-text="name"
                item-value="id"
                label="Select city"
                placeholder="Start typing to Search"
                return-object
                required
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <p class="body-1 font-weight-bold">Service Threshold Limits</p>
              <v-radio-group row mandatory class="ml-4">
                <v-radio label="Daily" value="Daily"></v-radio>
                <v-radio label="Fortnightly" value="Fortnightly"></v-radio>
                <v-radio label="Weekly" value="Weekly"></v-radio>
                <v-radio label="Monthly" value="Monthly"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="py-0">
              <v-card elevation="0">
                <v-card-title>Undelivered Packages</v-card-title>
                <v-card-text>
                  <v-text-field
                    label="Maximum number of packages undelivered"
                  ></v-text-field>
                  <v-text-field
                    label="Maximum number of package with no delivered"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="py-0">
              <v-card elevation="0">
                <v-card-title>Uncleared Packages</v-card-title>
                <v-card-text>
                  <v-text-field
                    label="Maximum number of packages uncleared"
                  ></v-text-field>
                  <v-text-field
                    label="Maximum number of days to wait for a status"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-expansion-panels :value="[0, 1, 2]" multiple>
          <v-expansion-panel>
            <v-expansion-panel-header class="body-1 font-weight-bold"
              >IT Contact</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="Name"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="LandLine"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="Email"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="Mobile"></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header class="body-1 font-weight-bold"
              >Finance Contact</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="Name"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="LandLine"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="Email"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="Mobile"></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header class="body-1 font-weight-bold"
              >Business Contact</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="Name"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="LandLine"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="Email"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="Mobile"></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row class="mb-3">
      <v-col>
        <v-divider class="my-4"></v-divider>
        <v-row>
          <v-col cols="12">
            <p class="pa-0 ma-0 mr-4 d-flex">
              <span class="body-1 font-weight-bold"> API details </span>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="createApi()"
                ><v-icon dark left> mdi-plus </v-icon> Add</v-btn
              >
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-expansion-panels v-if="apis.length" v-model="panel" accordion>
            <v-expansion-panel v-for="(api, i) in apis" :key="i">
              <v-expansion-panel-header class="body-1 font-weight-bold">
                <template v-slot:default="{ open }">
                  <v-row v-if="!open" no-gutters>
                    <v-col cols="6">
                      {{ api.description }}
                    </v-col>
                    <v-col cols="6"
                      ><strong>Category: </strong>{{ api.category }}</v-col
                    >
                  </v-row>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" md="1" sm="4">
                    <v-select
                      v-model="api.method"
                      :items="['GET', 'POST']"
                      label="Method"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="9" sm="8">
                    <v-text-field
                      v-model="api.url"
                      label="API URL"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2" sm="4" class="text-center">
                    <v-btn
                      color="primary"
                      class="ma-2"
                      small
                      @click="requestApi(api)"
                      :loading="api.loader"
                      >Send</v-btn
                    >
                    <v-btn
                      color="error"
                      class="ma-2"
                      small
                      @click="deleteApi(i)"
                      >Remove API</v-btn
                    >
                  </v-col>
                  <v-col cols="12" md="3" sm="4">
                    <v-select
                      v-model="api.category"
                      :items="[
                        'Tracking',
                        'Label',
                        'Manifest',
                        'PickUp',
                        'Other',
                      ]"
                      label="Category"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="9" sm="8">
                    <v-text-field
                      v-model="api.description"
                      label="API Purpose"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6" sm="6">
                    <strong>Request</strong>
                    <v-tabs show-arrows>
                      <v-tab> Params </v-tab>
                      <v-tab> Authorization </v-tab>
                      <v-tab> Headers </v-tab>
                      <v-tab> Body </v-tab>
                      <v-tab-item>
                        <v-card flat>
                          <v-card-text>
                            <v-row v-for="(p, pi) in api.params" :key="pi">
                              <v-col class="py-0">
                                <v-text-field
                                  label="Key"
                                  v-model="p.key"
                                  hide-details
                                ></v-text-field>
                              </v-col>
                              <v-col class="py-0">
                                <v-text-field
                                  label="Value"
                                  v-model="p.value"
                                  hide-details
                                ></v-text-field>
                              </v-col>
                              <v-col>
                                <v-btn
                                  color="primary"
                                  small
                                  @click="addParam(api.params)"
                                  ><v-icon>mdi-plus</v-icon></v-btn
                                >
                                <v-btn
                                  color="error"
                                  small
                                  class="ml-2"
                                  v-if="api.params.length > 1"
                                  @click="removeParam(api.params, pi)"
                                  ><v-icon>mdi-minus</v-icon></v-btn
                                >
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item>
                        <v-card flat>
                          <v-card-text>
                            <v-row>
                              <v-col>
                                <v-select
                                  label="Type"
                                  v-model="api.authorization.type"
                                  :items="authTypes"
                                ></v-select>
                              </v-col>
                            </v-row>
                            <v-row
                              v-if="api.authorization.type === 'bearerToken'"
                            >
                              <v-col>
                                <v-text-field
                                  label="Token"
                                  v-model="api.authorization.token"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row
                              v-if="api.authorization.type === 'basicAuth'"
                            >
                              <v-col>
                                <v-text-field
                                  label="Username"
                                  v-model="api.authorization.username"
                                ></v-text-field>
                              </v-col>
                              <v-col>
                                <v-text-field
                                  label="Password"
                                  v-model="api.authorization.password"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item>
                        <v-card flat>
                          <v-card-text>
                            <v-row v-for="(h, hi) in api.headers" :key="hi">
                              <v-col class="py-0">
                                <v-text-field
                                  label="Key"
                                  v-model="h.key"
                                  hide-details
                                ></v-text-field>
                              </v-col>
                              <v-col class="py-0">
                                <v-text-field
                                  label="Value"
                                  v-model="h.value"
                                  hide-details
                                ></v-text-field>
                              </v-col>
                              <v-col>
                                <v-btn
                                  color="primary"
                                  small
                                  @click="addParam(api.headers)"
                                  ><v-icon>mdi-plus</v-icon></v-btn
                                >
                                <v-btn
                                  color="error"
                                  small
                                  class="ml-2"
                                  v-if="api.headers.length > 1"
                                  @click="removeParam(api.headers, hi)"
                                  ><v-icon>mdi-minus</v-icon></v-btn
                                >
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item>
                        <v-card flat>
                          <v-card-text>
                            <v-row>
                              <v-col cols="8"
                                ><v-radio-group v-model="api.body.type" row>
                                  <v-radio
                                    label="Form-data"
                                    value="form-data"
                                  ></v-radio>
                                  <v-radio
                                    label="x-www-form-urlencoded"
                                    value="x-www-form-urlencoded"
                                  ></v-radio>
                                  <v-radio
                                    label="raw"
                                    value="raw"
                                  ></v-radio> </v-radio-group
                              ></v-col>
                              <v-col cols="4" v-if="api.body.type === 'raw'">
                                <v-select
                                  label="Raw Body Type"
                                  v-model="api.body.textType"
                                  :items="['TEXT', 'JSON', 'XML']"
                                ></v-select>
                              </v-col>
                            </v-row>
                            <template v-if="api.body.type !== 'raw'">
                              <v-row
                                v-for="(bp, bpi) in api.body.params"
                                :key="bpi"
                              >
                                <v-col class="py-0">
                                  <v-text-field
                                    label="Key"
                                    v-model="bp.key"
                                    hide-details
                                  ></v-text-field>
                                </v-col>
                                <v-col class="py-0">
                                  <v-text-field
                                    label="Value"
                                    v-model="bp.value"
                                    hide-details
                                  ></v-text-field>
                                </v-col>
                                <v-col>
                                  <v-btn
                                    color="primary"
                                    small
                                    @click="addParam(api.body.params)"
                                    ><v-icon>mdi-plus</v-icon></v-btn
                                  >
                                  <v-btn
                                    color="error"
                                    small
                                    class="ml-2"
                                    v-if="api.body.params.length > 1"
                                    @click="removeParam(api.body.params, bpi)"
                                    ><v-icon>mdi-minus</v-icon></v-btn
                                  >
                                </v-col>
                              </v-row>
                            </template>
                            <v-row v-else>
                              <v-col>
                                <v-textarea
                                  solo
                                  v-model="api.body.text"
                                  label="Body"
                                ></v-textarea>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <strong>Response</strong>
                    <pre :inner-html.prop="api.response | jsonBeautify"></pre>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <p class="text-center w-100" v-else>
            Please create API using Add button.
          </p>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { countries, serviceTypes } from "@/config/data";
import { mapActions } from "vuex";
export default {
  computed: {
    allCountries() {
      return Object.keys(countries).map((i) => {
        return {
          text: countries[i],
          value: i,
        };
      });
    },
    allServiceTypes() {
      return Object.keys(serviceTypes).map((i) => {
        return {
          text: serviceTypes[i],
          value: i,
        };
      });
    },
    sampleResponse() {
      return this.formatJson(
        {
          a: 1,
          b: "foo",
          c: [false, "false", null, "null", { d: { e: 1.3e5, f: "1.3e5" } }],
        },
        null,
        2
      );
    },
  },
  data() {
    return {
      apis: [],
      apiObj: {
        description: "API",
        method: "GET",
        url: null,
        params: [
          {
            key: null,
            value: null,
          },
        ],
        authorization: {
          type: "noAuth",
          token: null,
          username: null,
          password: null,
        },
        headers: [
          {
            key: null,
            value: null,
          },
        ],
        body: {
          type: "raw",
          params: [
            {
              key: null,
              value: null,
            },
          ],
          text: null,
          textType: "JSON",
        },
        response: null,
        loader: false,
        category: "Other",
      },
      panel: 0,
      authTypes: [
        {
          text: "No Auth",
          value: "noAuth",
        },
        {
          text: "Bearer Token",
          value: "bearerToken",
        },
        {
          text: "Basic Auth",
          value: "basicAuth",
        },
      ],
      cityLoader: false,
      searchCity: null,
      cities: [],
      addressForm: {
        country_code: null,
        street: null,
        street2: null,
        city: null,
        phone: null,
        email: null,
      },
    };
  },
  watch: {
    searchCity(val) {
      val && val !== this.addressForm.city?.name && this.fetchCityList();
    },
  },
  created() {
    this.fetchCityList();
  },
  methods: {
    ...mapActions(["getCities", "snackBar"]),
    formatJson(obj) {
      return JSON.stringify(obj, undefined, 2);
    },
    createApi() {
      this.apis.push(Object.assign({}, this.apiObj));
      this.panel = this.apis.length - 1;
    },
    deleteApi(i) {
      this.apis.splice(i, 1);
      if (this.panel >= this.apis.length) this.panel = 0;
    },
    requestApi(api) {
      api.response = null;
      api.loader = true;
      setTimeout(() => {
        api.response = this.formatJson(api);
        api.loader = false;
      }, 1500);
    },
    addParam(params) {
      params.push({
        key: null,
        value: null,
      });
    },
    removeParam(params, i) {
      params.splice(i, 1);
    },
    fetchCityList() {
      if (!this.addressForm.country_code) return;
      this.cityLoader = true;
      this.getCities({
        countryCode: this.addressForm.country_code.toLowerCase(),
        params: {
          search: this.searchCity,
        },
      })
        .then((res) => {
          this.cityLoader = false;
          this.cities = res.data.records;
          const settings = this.node?.carrier_settings?.find(
            (cs) => cs.entity_id === this.selectedCarrier?.id
          );
          if (
            settings?.address?.city_id &&
            this.cities.findIndex((c) => c.id === settings.address.city_id) ===
              -1
          ) {
            this.cities.unshift({
              id: settings.address.city_id,
              name: settings.address.city_name,
            });
          }
        })
        .catch(() => {
          this.cityLoader = false;
        });
    },
  },
};
</script>
<style lang="scss">
pre {
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
  background-color: #f5f5f5;
  height: 300px;
  overflow-y: auto;
  .string {
    color: green;
  }
  .number {
    color: darkorange;
  }
  .boolean {
    color: blue;
  }
  .null {
    color: magenta;
  }
  .key {
    color: red;
  }
}
.w-100 {
  width: 100%;
}
</style>
