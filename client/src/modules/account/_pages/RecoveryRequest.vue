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
      <form class="c-signup-form">
        <header class="c-signup-form__header u-mb-20">
          <h2 class="u-fw-700">Recover your account</h2>
          <p class="o-text o-text--sm o-text--grey">
            Enter your email address and we will send you a link to reset your password.
          </p>
        </header>

        <div class="l-stack l-stack--form">
          <!-- reset password field -->
          <div class="c-signup-form__field c-form__group">
            <label for="email" class="c-form__label c-form__label--small">Email</label>
            <input
              id="email"
              type="email"
              @keyup.enter="submitRecoveryRequest()"
              v-model="emailAddress"
              class="o-input"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <!-- vue recaptcha -->
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

        <div class="u-mt-25">
          <button
            type="submit"
            :disabled="!submitButtonEnabled"
            class="o-btn o-btn--primary o-btn--rounded o-btn--block o-btn--sm"
            @click.prevent="submitRecoveryRequest()"
          >
            Send Reset Link
          </button>
          <footer class="u-mt-25">
            <p class="o-text u-fs-11 u-text-center">
              <router-link :to="{ name: 'LogIn' }">
                <span class="u-ml-5 o-text--500">Back to Log In</span>
              </router-link>
            </p>
          </footer>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'
import { GET_USER, STORE_KEY, REQUEST_RECOVERY } from '@/stores/account/types'

export default {
  name: 'RecoveryRequest',
  components: {
    'vue-recaptcha': VueRecaptcha,
  },
  data() {
    return {
      loading: false,
      emailAddress: '',
      siteKey: RECAPTCHA_SITE_KEY,
      recaptchaCode: '',
    }
  },
  methods: {
    vueRecaptchaApiLoaded() {},
    async onVerifyRecaptcha(response) {
      this.recaptchaCode = response
      await this.submitRecoveryPost()
    },
    onExpiredRecaptcha() {
      this.recaptchaCode = ''
    },
    onPasswordResetFail() {
      this.$caAlert.error('Sorry, an error has occurred.')
    },
    resetRecaptcha() {
      this.$refs.recaptcha.reset()
    },
    onRecoveryRequestFail() {
      this.$caAlert.error('Sorry, an error has occurred.')
    },
    onRecoveryRequestSuccess() {
      this.$caAlert.success('Request successful. An email will be sent with instructions to reset your password')
      this.emailAddress = ''
    },
    async submitRecoveryRequest() {
      if (!this.recaptchaCode) {
        this.$refs.recaptcha.execute()
        return
      }
      await this.submitRecoveryPost()
    },

    async submitRecoveryPost() {
      this.loading = true

      try {
        await this.$store.dispatch(`${STORE_KEY}/${REQUEST_RECOVERY}`, {
          email: this.emailAddress,
          recaptcha_code: this.recaptchaCode,
        })
        this.onRecoveryRequestSuccess()
      } catch (error) {
        this.loading = false
        this.onRecoveryRequestFail()
      }
    },
  },
  computed: {
    ...mapGetters(STORE_KEY, {
      user: GET_USER,
    }),
    submitButtonEnabled() {
      return !this.loading && this.emailAddress
    },
  },
  mounted() {
    if (this.user && this.user.token) {
      this.$router.push({ name: 'Programs' })
    }
  },
}
</script>
