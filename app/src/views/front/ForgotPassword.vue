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
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class>Forgot Password</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon>mdi-mail</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" @submit.prevent="validate" lazy-validation>
              <v-text-field
                v-model="email"
                label="Email Address"
                name="email"
                prepend-icon="mdi-mail"
                type="text"
                :rules="[
                  (v) => (v && !!v.trim()) || 'Email address is required',
                  (v) => /.+@.+\..+/.test(v) || 'E-mail address must be valid',
                ]"
                @keyup="lower()"
                class="required"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <router-link :to="{ name: 'Login' }">&lt;&lt; Login</router-link>
            <v-spacer></v-spacer>
            <v-btn
              class="mr-1"
              color="primary"
              @click="validate"
              :loading="loader"
              >Submit</v-btn
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
      email: null,
      loader: false,
    };
  },
  methods: {
    ...mapActions(["forgotPassword", "snackBar"]),
    validate() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loader = true;
      this.forgotPassword({
        email: this.email,
      })
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
    lower() {
      this.email = this.email.toLowerCase();
    },
  },
};
</script>
