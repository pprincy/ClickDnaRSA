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
          class="mx-auto"
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
                v-model="authData.username"
                label="Username"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                :rules="[(v) => (v && !!v.trim()) || 'Username is required']"
                class="required"
              ></v-text-field>
              <v-text-field
                v-model="authData.password"
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[(v) => (v && !!v.trim()) || 'Password is required']"
                :type="showPass ? 'text' : 'password'"
                class="required"
                @click:append="showPass = !showPass"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="validate()" :loading="loader"
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
        username: "",
        password: "",
      },
      showPass: false,
      loader: false,
      errorMessage: null,
    };
  },
  methods: {
    ...mapMutations(["setAdminToken"]),
    ...mapActions(["doAdminLogin", "snackBar"]),
    validate() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loader = true;
      this.doAdminLogin(this.authData)
        .then((res) => {
          this.loader = false;
          this.setAdminToken(res["token"]);
          this.$router.replace({ name: "Customers" });
          this.snackBar({
            color: "success",
            message: "Login successfully.",
          });
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
