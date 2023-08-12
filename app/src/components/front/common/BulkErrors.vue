<template>
  <v-dialog
    v-model="localDialog"
    max-width="900px"
    @keydown.esc="$emit('close', false)"
    persistent
  >
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>{{ data.message }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('close', false)" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <template v-slot:extension>
          <v-tabs
            v-model="selectedTab"
            mandatory
            centered
            grow
            slider-color="primary"
          >
            <v-tab :href="`#success`"> Success </v-tab>
            <v-tab :href="`#failed`"> Failed </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-tabs-items v-model="selectedTab">
        <v-tab-item value="success">
          <v-card flat>
            <v-list v-if="data.success && data.success.length" nav dense>
              <div class="pa-4" v-if="other === 'verify'">
                <p class="text-center">Products found in the system.</p>
                <v-chip
                  color="green"
                  text-color="white"
                  class="mr-2"
                  v-for="(item, i) in data.success"
                  :key="i"
                >
                  {{ item }}
                </v-chip>
              </div>
              <template v-else>
                <v-list-item v-for="(item, i) in data.success" :key="i">
                  <v-list-item-icon>
                    <v-icon>mdi-dot</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
            <v-list v-else nav dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="text-center"
                    >No Data Found</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item value="failed">
          <v-card flat>
            <div
              v-if="data.with_error && Object.keys(data.with_error).length"
              class="ma-4 mx-6 d-flex justify-space-between"
            >
              <strong class="">ERROR DETAILS</strong>
              <div>
                <v-btn
                  class="mr-2"
                  color="success"
                  @click="$emit('add', true)"
                  v-if="other === 'add' && !data.product_flag"
                >
                  <v-icon>mdi-plus</v-icon> Add new products
                </v-btn>
                <v-btn color="error" @click="download()">
                  <v-icon>mdi-download</v-icon> Download
                </v-btn>
              </div>
            </div>
            <div
              class="pa-4"
              v-if="
                data.with_error &&
                Object.keys(data.with_error).length &&
                other === 'verify'
              "
            >
              <p class="text-center">Products not found in the system.</p>
              <v-chip
                color="red"
                text-color="white"
                class="mr-2"
                v-for="(value, name) in data.with_error"
                :key="name"
              >
                {{ name }}
              </v-chip>
            </div>
            <v-expansion-panels
              v-else-if="data.with_error && Object.keys(data.with_error).length"
              v-model="panel"
              multiple
            >
              <v-expansion-panel
                v-for="(value, name) in data.with_error"
                :key="name"
              >
                <v-expansion-panel-header>{{ name }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li class="red--text" v-for="(item, j) in value" :key="j">
                      {{ item.code }} - {{ item.message }}
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-list v-else nav dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="text-center"
                    >No Data Found</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
    other: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      localDialog: false,
      selectedTab: "success",
      panel: [],
    };
  },
  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
      if (newVal) {
        this.panel = Object.keys(this.data.with_error)?.map((k, i) => i);
        this.selectedTab = this.panel.length ? "failed" : "success";
      }
    },
  },
  methods: {
    download() {
      this.downloadXLSX(
        [
          ["NUMBER", "CODE", "ERROR"],
          ...Object.keys(this.data.with_error)
            .map((num) => {
              return this.data.with_error[num].map((i, index) => {
                return [index === 0 ? num : "", i.code, i.message];
              });
            })
            .flat(),
        ],
        this.fileName ? this.fileName : "Errors"
      );
    },
  },
};
</script>
