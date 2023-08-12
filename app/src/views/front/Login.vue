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
            <v-toolbar-title class>Login</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon>mdi-login</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="authData.email"
                label="Email Address"
                name="email"
                prepend-icon="mdi-mail"
                type="text"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Email address is required',
                ]"
                @keyup="lower()"
                class="required"
              ></v-text-field>
              <v-text-field
                v-model="authData.password"
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                autocomplete="off"
                :rules="[(v) => (v && !!v.trim()) || 'Password is required']"
                :type="showPass ? 'text' : 'password'"
                class="required"
                @click:append="showPass = !showPass"
                @keyup.enter="validate()"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <router-link :to="{ name: 'ForgotPassword' }"
              >&lt;&lt; Forgot Password?</router-link
            >
            <v-spacer></v-spacer>
            <v-btn
              class="mr-1"
              color="primary"
              @click="validate()"
              :loading="loader"
              >Login</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      authData: {
        email: null,
        password: null,
      },
      showPass: false,
      loader: false,
      errorMessage: null,
    };
  },

  methods: {
    ...mapMutations([
      "setUserToken",
      "setUserTokenDate",
      "setUser",
      "setScreens",
      "setPermissions",
      "setUserRole",
    ]),
    ...mapActions(["doLogin", "snackBar"]),
    validate() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loader = true;
      this.doLogin(this.authData)
        .then((res) => {
          this.loader = false;
          this.setUserToken(res.data.token);
          this.setUserTokenDate(res.data.expire_at);
          // this.setPermissions(res.data.user.access_rights.permissions);
          // this.setScreens(res.data.user.access_rights.screens);
          // this.setUserRole(res.data.user.access_rights.role);
          delete res.data.user.access_rights;
          this.setUser(res.data.user);
          this.$store.dispatch("getPermissions");
          this.$router.replace({ name: "Home" });
          this.snackBar({
            color: "success",
            message: "Login Successfully.",
          });
        })
        .catch(() => {
          this.loader = false;
        });
    },
    lower() {
      this.authData.email = this.authData.email.toLowerCase();
    },
  },
};
</script>
