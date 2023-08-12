<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md3>
        <v-img
          src="@/assets/logo.svg"
          alt="RSA Logo"
          aspect-ratio="1"
          title="RSA Logo"
          max-height="50"
          max-width="175"
          class="mx-auto mb-4"
          contain
        ></v-img>
        <v-alert v-if="errorMessage" color="red" text type="error">{{
          errorMessage
        }}</v-alert>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class>Reset Password</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon>mdi-lock</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="authData.new_password"
                label="Password"
                prepend-icon="mdi-lock"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[(v) => (v && !!v.trim()) || 'Password is required']"
                type="password"
                class="required"
                @click:append="showPass = !showPass"
              ></v-text-field>
              <v-text-field
                v-model="confirm_password"
                label="Confirm Password"
                prepend-icon="mdi-lock"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Confirm password is required',
                  (v) =>
                    v === this.authData.new_password ||
                    'The password confirmation does not match',
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
              >Reset Password</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      authData: {
        new_password: null,
        token: this.$route.query.token,
      },
      confirm_password: null,
      showPass: false,
      loader: false,
      errorMessage: null,
    };
  },

  methods: {
    ...mapActions(["resetPassword", "snackBar"]),
    validate() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loader = true;
      this.resetPassword(this.authData)
        .then((res) => {
          this.loader = false;
          this.$router.replace({ name: "Login" });
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
