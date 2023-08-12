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
        <v-alert v-if="successMessage" color="success" text type="success">{{
          successMessage
        }}</v-alert>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class>SignUp</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon>mdi-account-plus</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="signUpData.name"
                label="Full name"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                :rules="[(v) => (v && !!v.trim()) || 'Name is required']"
                class="required"
              ></v-text-field>
              <v-text-field
                v-model="signUpData.email"
                label="Email address"
                name="email"
                prepend-icon="mdi-mail"
                type="text"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Email address is required',
                  (v) => /.+@.+\..+/.test(v) || 'E-mail address must be valid',
                ]"
                class="required"
              ></v-text-field>
              <v-text-field
                v-model="signUpData.company"
                label="Company name"
                name="company"
                prepend-icon="mdi-domain"
                type="text"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Company name is required',
                ]"
                class="required"
              ></v-text-field>
              <v-text-field
                v-model="signUpData.phone"
                label="Phone number"
                name="phone"
                prepend-icon="mdi-phone"
                type="text"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Phone number is required',
                  (v) =>
                    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
                      v
                    ) || 'Phone number must be valid',
                ]"
                class="required"
              ></v-text-field>
              <v-text-field
                v-model="signUpData.password"
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
            <router-link :to="{ name: 'Login' }"> &lt;&lt; Login </router-link>
            <v-spacer></v-spacer>
            <v-btn
              class="mr-1"
              color="primary"
              @click="validate()"
              :loading="loader"
              >Sign Up</v-btn
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
      signUpData: {
        name: null,
        email: null,
        company: null,
        phone: null,
        password: null,
      },
      showPass: false,
      loader: false,
      successMessage: null,
      errorMessage: null,
    };
  },

  methods: {
    ...mapActions(["doSignUp"]),
    validate() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loader = true;
      this.doSignUp(this.signUpData)
        .then((res) => {
          this.loader = false;
          this.successMessage = res.message;
          this.$refs.form.reset();
        })
        .catch(() => {
          this.loader = false;
        });
    },
  },
};
</script>
