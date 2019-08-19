<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container>
      <v-layout text-center wrap>
        <v-flex xs12>
          <h1><br>Sign in</h1>
        </v-flex>
      </v-layout>
      <v-row justify="center">
        <v-col :cols="cols" :sm="smCols" :md="mdCols">
          <v-snackbar v-model="snackbar" color="error" multi-line :timeout="6000" top>
            The credentials you provided are not correct
            <v-btn
              class="mx-2"
              color="error"
              fab
              small
              dark
              elevation="0"
              @click="snackbar = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-snackbar>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col :cols="cols" :sm="smCols" :md="mdCols">
          <v-text-field
            ref="email"
            v-model="email"
            prepend-icon="person_outlined"
            :rules="emailRules"
            label="E-mail"
            required
            @blur="validateEmail"
            @keypress.enter="onEnterPressedOnEmail"
            @input="clearEmailRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col :cols="cols" :sm="smCols" :md="mdCols">
          <v-text-field
            ref="password"
            v-model="password"
            prepend-icon="lock_outlined"
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            required
            @click:append="showPassword = !showPassword"
            @keypress.enter="validateFields"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col :cols="cols" :sm="smCols" :md="mdCols">
          <div class="text-center">
            <v-btn :disabled="!valid" color="primary" class="mr-4" @click="validateFields">LOGIN</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: "login-vuex",
  data() {
    return {
      //form status
      valid: true,

      //credential status
      err0: true,

      //email props
      email: "",
      emailRules: [],

      //password props
      showPassword: false,
      password: "",
      passwordRules: [],

      //snackbar props
      snackbar: false,

      //layout props
      cols: 12,
      mdCols: 5,
      smCols: 5
    };
  },
  methods: {
    login: function() {
      let data_to_send = {
        email: this.email,
        password: this.password,
        login_url: this.$loginUrl()
      };
      this.$store
        .dispatch("auth_request", data_to_send)
        .then(res => {
          //hide snackbar
          this.snackbar = "true";
          //goto /home
          this.$router.push("/home");
        })
        .catch(err => {
          //show snackbar
          this.snackbar = "true";
          //set focus on password
          this.$refs.password.focus();
        });
    }, //end: login()
    validateFields() {
      /*
        Validate fields:
          - email
          - password

        Logic:
          1. Validate email:
            if ok: next; else: show error

          2. Validate password:
            if ok: next; else: show error

          3. login()
      */
      /*
        Clear rules
      */
      this.passwordRules = [];
      this.emailRules = [];
      /*
        Validate email
      */
      //isEmpty?
      if (!this.email) {
        //set rule
        this.emailRules = [v => !!v || "E-mail is required"];
        //show error
        this.$refs.form.validate();
        //done
      } else {
        //isFormatOk?
        if (!/.+@.+\..+/.test(this.email)) {
          //set rule
          this.emailRules = [
            v =>
              /.+@.+\..+/.test(v) ||
              "Please enter a valid e-mail (example: myemail@company.com)"
          ];
          //show error
          this.$refs.form.validate();
          //done
        } else {
          /*
            2. Validate password
          */
          //isEmpty?
          if (!this.password) {
            //set rule
            this.passwordRules = [v => !!v || "Password is required"];
            //show error
            this.$refs.form.validate();
            //done
          } else {
            //do login
            this.login();
          }
        } //end: validation
      } //end: validation

      //done
      return;
    }, //end: validate()
    onEnterPressedOnEmail() {
      /*
        Validate fields:
          - email
          - password

        Logic:
          1. Validate email:
            if ok & password: login();
            if ok & !password: focus on password;
            else: show error;
      */
      /*
        Clear rules
      */
      this.passwordRules = [];
      this.emailRules = [];
      /*
        Validate email
      */
      //isEmpty?
      if (!this.email) {
        //set rule
        this.emailRules = [v => !!v || "E-mail is required"];
        //show error
        this.$refs.form.validate();
        //done
      } else {
        //isFormatOk?
        if (!/.+@.+\..+/.test(this.email)) {
          //set rule
          this.emailRules = [
            v =>
              /.+@.+\..+/.test(v) ||
              "Please enter a valid e-mail (example: myemail@company.com)"
          ];
          //show error
          this.$refs.form.validate();
          //done
        } else {
          /*
            2. Validate password
          */
          //isEmpty?
          if (!this.password) {
            //set focus on password
            this.$refs.password.focus();
            //done
          } else {
            //do login
            this.login();
          }
        } //end: validation
      } //end: validation

      //done
      return;
    }, //end: onEnterPressedOnEmail()
    validateEmail() {
      /*
        Validate field:
          - email
          
        Logic:
          1. Validate email:
            if ok: done; else: show error
      */
      /*
        Clear rules
      */
      this.emailRules = [];

      //check email
      if (this.email && !/.+@.+\..+/.test(this.email)) {
        //set rule
        this.emailRules = [
          v =>
            /.+@.+\..+/.test(v) ||
            "Please enter a valid e-mail (example: myemail@company.com)"
        ];
        //show error
        this.$refs.form.validate();
        //done
      }

      //done
      return;
    }, //end: validateEmail()
    clearEmailRules() {
      this.emailRules = [];
    }
  } //end: methods
};
</script>
