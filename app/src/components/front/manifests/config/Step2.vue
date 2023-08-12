<template>
  <v-col class="mx-4">
    <v-row class="d-flex align-center">
      <v-col cols="4">
        <p class="body-1 mb-0 font-weight-bold">Package Fields</p>
        <p class="body-2 mt-0">
          The list below are all the attributes about a package available in the
          system.
        </p>
        <v-text-field
          v-model="search1"
          append-icon="mdi-magnify"
          label="Search..."
          hide-details
        ></v-text-field>
        <v-list
          class="elevation-2 body-1 font-weight-bold overflow-y-auto"
          height="400px"
          dense
        >
          <v-list-item-group mandatory v-model="selectedIndex1" color="primary">
            <draggable
              v-model="allFields"
              group="people"
              class="list-group"
              ghost-class="ghost"
              @end="resetSelection"
            >
              <template v-for="(item, i) in packageFields">
                <div
                  v-if="
                    item.name &&
                    item.name.toLowerCase().includes(search1.toLowerCase())
                  "
                  :key="i"
                >
                  <v-list-item :value="i" @dblclick="moveRight()">
                    <v-list-item-icon>
                      <v-icon>mdi-arrow-all</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </div>
              </template>
            </draggable>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col cols="2" class="text-center align-center">
        <v-btn
          color="primary"
          class="mb-2 btn-transafer"
          :disabled="selectedIndex1 === -1"
          @click="moveRight()"
        >
          <v-icon>mdi-chevron-double-right</v-icon>
        </v-btn>
        <br />
        <v-btn
          color="error"
          class="mt-2 btn-transafer"
          :disabled="selectedIndex2 === -1"
          @click="moveLeft()"
        >
          <v-icon>mdi-chevron-double-left</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <p class="body-1 mb-0 font-weight-bold">Manifest</p>
        <p class="body-2 mt-0">
          The list below are all the attributes that will appear on the carrier
          manifest alert file.
        </p>
        <v-text-field
          v-model="search2"
          append-icon="mdi-magnify"
          label="Search..."
          hide-details
        ></v-text-field>
        <v-list
          class="elevation-2 body-1 font-weight-bold overflow-y-auto"
          height="400px"
          dense
        >
          <v-list-item-group mandatory v-model="selectedIndex2" color="primary">
            <draggable
              v-model="selectedPFields"
              group="people"
              class="list-group"
              ghost-class="ghost"
              @end="resetSelection"
            >
              <template v-for="(item, i) in selectedPFields">
                <div
                  v-if="
                    item.name &&
                    item.name.toLowerCase().includes(search2.toLowerCase())
                  "
                  :key="i"
                >
                  <v-list-item :value="i" @dblclick="moveLeft()">
                    <v-list-item-icon>
                      <v-icon>mdi-arrow-all</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </div>
              </template>
            </draggable>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import draggable from "vuedraggable";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    draggable,
  },
  computed: {
    selectedPFields: {
      get() {
        return this.packageFields?.filter((i) =>
          this.manifestObj?.fields_ids?.includes(i.id)
        );
      },
      set(value) {
        this.manifestObj.fields_ids = value.map((i) => i.id);
        this.$store.commit("setManifestObj", this.manifestObj);
      },
    },
    allFields: {
      get() {
        return this.packageFields;
      },
      set() {
        this.$store.commit("setPackageFields", this.packageFields);
      },
    },
    ...mapGetters(["packageFields", "manifestObj"]),
  },
  data() {
    return {
      selectedIndex1: -1,
      selectedIndex2: -1,
      search1: "",
      search2: "",
    };
  },
  created() {
    this.getPackageFields();
  },
  methods: {
    ...mapActions(["getPackageFields", "snackBar"]),
    moveRight() {
      if (
        this.selectedIndex1 !== -1 &&
        this.manifestObj?.fields_ids?.findIndex(
          (id) => id === this.packageFields[this.selectedIndex1].id
        ) === -1
      ) {
        this.manifestObj?.fields_ids.push(
          this.packageFields[this.selectedIndex1].id
        );
      } else {
        this.snackBar({
          color: "error",
          message: `${
            this.packageFields[this.selectedIndex1].name
          } is already added`,
        });
      }
      this.resetSelection();
    },
    moveLeft() {
      if (this.selectedIndex2 !== -1) {
        this.manifestObj?.fields_ids?.splice(this.selectedIndex2, 1);
      }
      this.resetSelection();
    },
    resetSelection() {
      this.selectedIndex1 = -1;
      this.selectedIndex2 = -1;
    },
  },
};
</script>
