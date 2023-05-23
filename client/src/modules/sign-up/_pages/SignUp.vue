<template>
  <div class="c-signup-container">
    <aside class="c-signup-aside">
      <div class="c-signup-aside__content">
        <a href="/">
          <img
            src="/static/images/site-logos/logo-white-h.svg"
            alt="Logo White Horizontal"
            class="c-signup-aside__logo"
          />
        </a>
        <section class="c-signup-aside__text">
          <div>
            <h1 class="o-h2 u-color-white u-fw-700">Welcome to Inspectiv</h1>
            <p>
              Inspectiv is an application security platform fueled by security researchers from around the globe who
              help developers stay ahead of security. Companies from all sectors, including U.S. Government service
              providers, EdTech, FinTech, Gaming, and more trust Inspectiv and its security community to keep them
              secure.
              <br />
              Our mission is to #SecureTheInternet
            </p>
          </div>
        </section>
      </div>
    </aside>
    <main>
      <form class="c-signup-form" autocomplete="off" action="POST" @submit.prevent="register">
        <header class="c-signup-form__header u-mb-20">
          <h2 class="u-fw-700">Create account</h2>
          <p class="o-text o-text--grey o-text--sm">Become a security researcher</p>
        </header>

        <!-- 
          emailFieldClass will add one of 4 possible classes (loading, correct, incorrect, warning). These classes are used heavily in `_c-signup-form.scss` file. 
        -->

        <div class="l-stack l-stack--form">
          <div class="c-signup-form__field c-form__group" :class="emailFieldClass">
            <label for="email" class="c-form__label c-form__label--small">Email</label>
            <input
              id="email"
              type="email"
              class="o-input"
              v-model="emailAddress"
              @change="checkEmailAvailability()"
              placeholder="Enter your email"
            />
            <p class="o-text o-text--error o-text--sm o-text--700 u-mt-5">Please enter a valid email address.</p>
            <p class="o-text o-text--warning o-text--sm o-text--700 u-mt-5">
              This email address is already in use. Would you like to
              <router-link :to="{ path: '/account/recovery' }">resend the email verification?</router-link>
            </p>
          </div>
        </div>
        <!-- To be removed after confirming that usertype is hard coded
        User type
<div class="u-mt-30">
          <div class="c-user-type">
            <div>
              <input type="radio" name="user_type" id="securityResearcher" @change="updateUserType('researcher')" class="u-hide-input" checked>
              <label class="u-text-400 u-m-0" for="securityResearcher">
                <h6 class="o-h6">I am a Security Researcher</h6>
                <p class="u-mt-5">I am a security researcher here to help #SecureTheInternet.</p>
                <i class="far fa-check-circle"></i>
                <i class="far fa-circle"></i>
              </label>
            </div>
          </div>
        </div> 
         /.c-user-type -->

        <!-- Vue ReCaptcha -->
        <div>
          <vue-recaptcha
            id="recaptcha"
            ref="recaptcha"
            @verify="onVerifyRecaptcha"
            @expired="onExpiredRecaptcha"
            size="invisible"
            :sitekey="siteKey"
          >
          </vue-recaptcha>
        </div>

        <!-- Submit Button -->
        <div class="u-mt-25">
          <input
            type="submit"
            @click.prevent="register"
            :disabled="!formValid || loading"
            value="Create Account"
            class="o-btn o-btn--primary o-btn--rounded o-btn--block"
            :class="submitButtonClass"
          />
        </div>

        <footer class="u-mt-25">
          <p class="o-text u-fs-11">
            Already have an account?
            <router-link :to="{ name: 'Login' }"> <span class="u-ml-5 o-text--500"> Log in </span> </router-link>
          </p>
          <p class="o-text u-fs-11">
            Not a security researcher and looking to protect your application?
            <a class="u-ml-5 o-text--500" href="mailto:sales@inspectiv.com">Let us know</a>.
          </p>
        </footer>
      </form>
    </main>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha'
import validators from '@/mixins/validators'
import TextFilters from '@/filters/text-filters'
import store from '@/stores/account'
import { STORE_KEY, CHECK_EMAIL, REGISTER_ACCOUNT } from '@/stores/account/types'

export default {
  name: 'SignUp',
  mixins: [validators],
  filters: TextFilters,
  components: {
    VueRecaptcha,
  },
  data: () => {
    return {
      siteKey: RECAPTCHA_SITE_KEY,
      //      userType: '',
      userType: 'researcher',
      emailAddress: '',
      emailIsTaken: false,
      emailCheckLoading: false,
      recaptchaCode: '',
      loading: false,
    }
  },
  methods: {
    checkEmailAvailability() {
      if (!this.emailIsValid(this.emailAddress)) {
        return
      }

      this.emailCheckLoading = true
      this.$store
        .dispatch(`${STORE_KEY}/${CHECK_EMAIL}`, this.emailAddress)
        .then(
          (response) => {
            this.emailCheckLoading = false
            if (!response || !response.data || !response.data.message) {
              return
            }

            this.emailIsTaken = response.data.message === 'taken'
          },
          (response) => {
            this.emailCheckLoading = false
            this.emailIsTaken = false
          }
        )
        .catch((e) => {
          this.emailCheckLoading = false
          this.emailIsTaken = false
        })
    },
    getReasonsForFailure(response) {
      if (!response || !response.data) {
        return `<p>Sorry, there was an error
                processing your request.
                Please contact support for assistance.</p>`
      }

      const reasons = Object.keys(response.data)
        .map((key) => `<li>${key} - ${response.data[key]}</li>`)
        .join('')
      return `<ul>${reasons}</ul>`
    },
    async register() {
      if (!this.recaptchaCode) {
        this.$refs.recaptcha.execute()
      } else {
        await this.postSignUp()
      }
    },
    updateUserType(userType) {
      this.userType = userType
    },
    async postSignUp() {
      this.$solar.show()
      this.loading = true

      let success = false
      let error = 'Sign up failed'
      let payload = {
        email: this.emailAddress,
        user_type: this.userType,
        recaptcha_code: this.recaptchaCode,
      }
      try {
        const response = await this.$store.dispatch(`${STORE_KEY}/${REGISTER_ACCOUNT}`, payload)
        if (!response || response.status !== 201) {
          this.recaptchaCode = ''
          this.$refs.recaptcha.reset()

          error = response.data && response.data.error ? response.data.error : 'Sign up failed'

          this.$caAlert.error(error)
        } else {
          success = true
        }
      } catch (e) {
        error = e.data && e.data.error ? e.data.error : 'Sign up failed'
      } finally {
        this.$solar.hide()
        this.loading = false
        this.recaptchaCode = ''

        if (!success) {
          this.$caAlert.error(error)
        } else {
          this.$caAlert.success('Signup successful.')
          this.recaptchaCode = ''
          this.$router.push({ name: 'EmailConfirmation' })
        }
      }
    },
    vueRecaptchaApiLoaded() {},
    async onVerifyRecaptcha(response) {
      this.recaptchaCode = response
      await this.postSignUp()
    },
    onExpiredRecaptcha() {
      this.recaptchaCode = ''
    },
  },
  computed: {
    isResearcher() {
      return this.userType === 'researcher'
    },
    isCompany() {
      return this.userType === 'application_owner'
    },
    formValid() {
      return this.emailIsValid(this.emailAddress) && (this.isResearcher || this.isCompany) && !this.emailIsTaken
    },
    emailFieldClass() {
      if (this.emailCheckLoading) {
        return 'is-checking'
      }

      return {
        'is-correct': this.emailAddress && this.emailIsValid(this.emailAddress) && !this.emailIsTaken,
        'has-warning': this.emailAddress && this.emailIsValid(this.emailAddress) && this.emailIsTaken,
        'is-incorrect': this.emailAddress && !this.emailIsValid(this.emailAddress),
      }
    },
    submitButtonClass() {
      return {
        researcher: this.userType === 'researcher',
        appOwner: this.userType === 'application_owner',
      }
    },
  },
  mounted() {
    if (!([STORE_KEY] in this.$store._modules.root._children)) {
      this.$store.registerModule([STORE_KEY], store)
    }
  },
}
</script>

<style lang="scss" scoped>
// @import '../../../scss/variables/_variables.scss';
</style>
