<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <p class="text-white h2">
            {{ $t("dashboards.magic-is-in-the-details") }}
          </p>
          <p class="white mb-0">
            Please use your credentials to login.
            <br />If you are not a member, please
            <router-link to="/user/register" class="white">register</router-link
            >.
          </p>
        </div>
        <div class="form-side">
          <router-link to="/">
            <span class="logo-single" />
          </router-link>
          <h6 class="mb-4">{{ $t("user.login-title") }}</h6>

          <b-form
            @submit.prevent="formSubmit"
            class="av-tooltip tooltip-label-bottom"
          >
            <b-form-group
              :label="$t('user.email')"
              class="has-float-label mb-4"
            >
              <b-form-input
                type="text"
                ref="email"
                v-model="$v.form.email.$model"
                :state="!$v.form.email.$error"
              />
              <b-form-invalid-feedback v-if="!$v.form.email.required"
                >Please enter your email address</b-form-invalid-feedback
              >
              <b-form-invalid-feedback v-else-if="!$v.form.email.email"
                >Please enter a valid email address</b-form-invalid-feedback
              >
              <b-form-invalid-feedback v-else-if="!$v.form.email.minLength"
                >Your email must be minimum 4
                characters</b-form-invalid-feedback
              >
            </b-form-group>

            <b-form-group
              :label="$t('user.password')"
              class="has-float-label mb-4"
            >
              <b-form-input
                type="password"
                autocomplete="on"
                v-model="$v.form.password.$model"
                :state="!$v.form.password.$error"
              />
              <b-form-invalid-feedback v-if="!$v.form.password.required"
                >Please enter your password</b-form-invalid-feedback
              >
              <b-form-invalid-feedback
                v-else-if="
                  !$v.form.password.minLength || !$v.form.password.maxLength
                "
                >Your password must be between 4 and 16
                characters</b-form-invalid-feedback
              >
            </b-form-group>
            <div class="d-flex justify-content-between align-items-center">
              <router-link to="/user/forgot-password">{{
                $t("user.forgot-password-question")
              }}</router-link>
              <b-button
                type="submit"
                variant="primary"
                size="lg"
                
                :class="{
                  'show-spinner': _loginProcessing,
                  'btn-multiple-state btn-shadow': true,
                  'show-success': !_loginProcessing && loginError === false,
                  'show-fail': !_loginProcessing && loginError
                }"
              >
                <span class="spinner d-inline-block">
                  <span class="bounce1"></span>
                  <span class="bounce2"></span>
                  <span class="bounce3"></span>
                </span>
                <span class="icon success">
                  <i class="simple-icon-check"></i>
                </span>
                <span class="icon fail">
                  <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">{{ $t("user.login-button") }}</span>
              </b-button>
            </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { adminRoot } from "../../constants/config";
import { setCurrentLanguage, getCurrentUser } from "../../utils";
import { defaultLocale } from "../../constants/config";
import { getLanguages } from "../../utils";
const {
  required,
  maxLength,
  minLength,
  email
} = require("vuelidate/lib/validators");

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      password: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(4)
      },
      email: {
        required,
        email,
        minLength: minLength(4)
      }
    }
  },
  computed: {
    ...mapGetters(["currentUser", "_loginProcessing", "processing", "loginError"])
  },
  beforeMount() {
    setCurrentLanguage(defaultLocale);
   
  },
  created(){
      getLanguages();
     this.getBlock_Categories({
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
  },
  methods: {
    ...mapActions(["login", "getBlock_Categories"]),
     
    formSubmit() {
      // window.top.close();
      this.$v.$touch();
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        this.login({
          email: this.form.email,
          password: this.form.password
        });
      }
    }
  },
  watch: {
    processing: function(value) {},
    currentUser(val) {
      const role = getCurrentUser();
      
      console.log('role is here ', role);
      console.log('role.role[0]', role.role[0]);
      if (role.role[0] === 'owner') {
        
        console.log('owner condition', role.role[0])
        this.$router.push(`${adminRoot}/static/owner`);
      }else if (role.role[0] === 'marketer') {
        console.log('marketer condition', role.role[0])
        this.$router.push(`${adminRoot}/static/marketer`);
      }else {
        console.log('other condition', role.role[0])
        this.$router.push(`${adminRoot}/static/start`);
      }
    },
    loginError(val) {
      if (val != null) {
        this.$notify(
          "error",
          "Login Error",
          "Invalid credentials. Please try again.",
          {
            duration: 3000,
            permanent: false
          }
        );
      }
    }
  }
};
</script>
