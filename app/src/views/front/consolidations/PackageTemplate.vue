<template>
  <v-col class="py-0">
    <p class="pt-5">
      <strong>Package Info Template</strong>
    </p>
    <v-combobox
      v-model="selectedTemplate"
      :items="packageTemplates"
      item-key="id"
      item-text="name"
      item-value="id"
      :loading="loader"
      return-object
    >
      <template v-slot:append>
        <v-btn icon text small @click="add()">
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
        <v-btn v-if="selectedTemplate" @click="edit()" icon text small>
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="selectedTemplate"
          @click="remove()"
          :loading="loader"
          icon
          text
          small
        >
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-combobox>
    <v-dialog
      v-model="dialog"
      width="600"
      @keydown.esc="dialog = false"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            selectedTemplate
              ? "Edit Template Information"
              : "Create Template Information"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="Name"
                  :rules="[(v) => (v && !!v.trim()) || 'Name is required.']"
                  class="required"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  label="Select fields"
                  clearable
                  multiple
                  small-chips
                  deletable-chips
                  outlined
                  :items="packageFields"
                  v-model="formData.column_ids"
                  item-key="id"
                  item-value="id"
                  item-text="name"
                ></v-autocomplete>
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
            :loading="saveLoader"
            @click="submit()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["packageFields"]),
  },
  data() {
    return {
      selectedTemplate: null,
      packageTemplates: [],
      loader: false,
      dialog: false,
      saveLoader: false,
      formData: {
        name: null,
        column_ids: [],
      },
    };
  },
  created() {
    this.fetchPackageTemplates();
    this.getPackageFields();
  },
  methods: {
    ...mapActions([
      "getPackageTemplates",
      "createPackageTemplates",
      "updatePackageTemplates",
      "deletePackageTemplates",
      "getPackageFields",
      "snackBar",
    ]),
    fetchPackageTemplates() {
      this.loader = true;
      this.getPackageTemplates()
        .then((res) => {
          this.loader = false;
          this.packageTemplates = res.data;
        })
        .catch(() => {
          this.loader = false;
        });
    },
    add() {
      this.selectedTemplate = null;
      this.formData = {
        name: null,
        column_ids: [],
      };
      this.dialog = true;
    },
    edit() {
      this.dialog = true;
      this.formData = {
        name: this.selectedTemplate.name,
        column_ids: this.selectedTemplate.column_ids.map((i) => i.id),
      };
    },
    remove() {
      this.loader = true;
      this.deletePackageTemplates(this.selectedTemplate.id)
        .then((res) => {
          this.loader = false;
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
          this.fetchPackageTemplates();
        })
        .catch(() => {
          this.loader = false;
        });
    },
    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      let Api;
      if (this.selectedTemplate) {
        Api = this.updatePackageTemplates({
          id: this.selectedTemplate.id,
          data: this.formData,
        });
      } else {
        Api = this.createPackageTemplates(this.formData);
      }
      this.saveLoader = true;
      Api.then((res) => {
        this.saveLoader = false;
        this.snackBar({
          color: "success",
          message: res.data.message,
        });
        this.dialog = false;
        this.selectedTemplate = null;
        this.fetchPackageTemplates();
      }).catch(() => {
        this.saveLoader = false;
      });
    },
  },
};
</script>
