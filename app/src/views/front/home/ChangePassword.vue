<!-- #15 -->
<template>
  <v-col cols="12" md="4" sm="6" xs="12" class="ma-4 mx-auto">
    <v-card class="elevation-2">
      <v-toolbar flat>
        <v-toolbar-title class
          >Change Password
          <i class="caption red--text ml-4">
            * required field</i
          ></v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-icon>mdi-lock</v-icon>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-text-field
            v-model="authData.old_password"
            label="Old Password"
            prepend-icon="mdi-lock"
            :rules="[(v) => (v && !!v.trim()) || 'Old Password is required']"
            type="password"
            class="required"
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            v-model="authData.new_password"
            label="Password"
            prepend-icon="mdi-lock"
            :rules="[(v) => (v && !!v.trim()) || 'Password is required']"
            type="password"
            class="required"
            @keyup.enter="validate()"
          ></v-text-field>
          <v-text-field
            v-model="confirm_password"
            label="Confirm Password"
            prepend-icon="mdi-lock"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[
              (v) => (v && !!v.trim()) || 'Confirm Password is required',
              (v) =>
                v === authData.new_password ||
                'Password and Confirm password must match',
            ]"
            :type="showPass ? 'text' : 'password'"
            class="required"
            @click:append="showPass = !showPass"
            @keyup.enter="validate()"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-1"
          color="primary"
          @click="validate()"
          :loading="loader"
          >Change Password</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      authData: {
        old_password: null,
        new_password: null,
      },
      confirm_password: null,
      showPass: false,
      loader: false,
    };
  },

  methods: {
    ...mapActions(["changePassword", "snackBar"]),
    validate() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loader = true;
      this.changePassword(this.authData)
        .then((res) => {
          this.loader = false;
          this.$refs.form.reset();
          this.snackBar({
            color: "success",
            message: res.data.message,
          });
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
