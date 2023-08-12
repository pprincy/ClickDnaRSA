<template>
  <v-col class="mx-4">
    <v-row>
      <v-col cols="2">
        <p class="body-1 font-weight-bold pt-4">Available Fields</p>
        <v-list
          class="elevation-2 body-1 font-weight-bold overflow-y-auto"
          height="400px"
          dense
        >
          <template v-for="(item, i) in packageFields">
            <div :key="i">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </div>
          </template>
        </v-list>
      </v-col>
      <v-col cols="10">
        <p class="body-1 font-weight-bold pt-4">Sort the Manifest Fields</p>
        <v-data-table
          :headers="headers"
          :items="sortFields"
          class="elevation-1 table-no-border"
          hide-default-footer
          disable-pagination
          dense
        >
          <template v-slot:body="props">
            <draggable v-model="sortFields" tag="tbody">
              <tr v-for="(item, index) in props.items" :key="item.id">
                <td>
                  <v-icon class="float-left" small> mdi-arrow-all </v-icon>
                  <span class="ml-10">
                    {{ item.priority }}
                  </span>
                </td>
                <td>
                  <v-autocomplete
                    :items="packageFields"
                    item-value="id"
                    item-text="name"
                    v-model="item.manifest_field"
                  ></v-autocomplete>
                </td>
                <td>
                  <v-autocomplete
                    :items="allSortOrders"
                    item-value="value"
                    item-text="text"
                    v-model="item.sorting_order"
                  ></v-autocomplete>
                </td>
                <td class="text-center">
                  <v-icon color="primary" class="mr-2" @click="addSort(index)">
                    mdi-plus
                  </v-icon>
                  <v-icon
                    v-if="sortFields.length > 1"
                    color="error"
                    @click="removeSort(index)"
                  >
                    mdi-close
                  </v-icon>
                </td>
              </tr>
            </draggable>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import draggable from "vuedraggable";
import { mapActions, mapGetters } from "vuex";
import { sortOrders } from "@/config/data";
export default {
  components: {
    draggable,
  },
  computed: {
    allSortOrders() {
      return Object.keys(sortOrders).map((i) => {
        return {
          text: sortOrders[i],
          value: i,
        };
      });
    },
    sortFields: {
      get() {
        return (
          this.manifestObj?.fields_sorting || [
            {
              id: +new Date(),
              manifest_field: null,
              priority: 1,
              sorting_order: 1,
            },
          ]
        );
      },
      set(value) {
        this.manifestObj.fields_sorting = value.map((i, index) => {
          i.priority = index + 1;
          return i;
        });
        this.$store.commit("setManifestObj", this.manifestObj);
      },
    },
    ...mapGetters(["packageFields", "manifestObj"]),
  },
  data() {
    return {
      headers: [
        {
          text: "Priority",
          align: "center",
          value: "priority",
          class: "body-1 font-weight-bold",
          sortable: false,
        },
        {
          text: "Select a Field",
          value: "manifest_field",
          class: "body-1 font-weight-bold",
          sortable: false,
        },
        {
          text: "Sorting Order",
          value: "sorting_order",
          class: "body-1 font-weight-bold",
          sortable: false,
        },
        {
          text: "Actions",
          value: "actions",
          class: "body-1 font-weight-bold",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
  created() {
    this.getPackageFields();
  },
  methods: {
    ...mapActions(["getPackageFields", "snackBar"]),
    resetSort() {
      this.sortFields.forEach((i, index) => {
        i.priority = index + 1;
      });
      this.manifestObj.fields_sorting = this.sortFields;
      this.$store.commit("setManifestObj", this.manifestObj);
    },
    addSort(index) {
      this.sortFields.splice(index + 1, 0, {
        id: +new Date(),
        priority: "",
        manifest_field: "",
        sorting_order: "",
      });
      this.resetSort();
    },
    removeSort(index) {
      this.sortFields.splice(index, 1);
      this.resetSort();
    },
  },
};
</script>
