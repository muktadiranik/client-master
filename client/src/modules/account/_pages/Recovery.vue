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
            Inspectiv is an application security platform fueled by security researchers from around the globe who help
            developers stay ahead of security. Companies from all sectors, including U.S. Government service providers,
            EdTech, FinTech, Gaming, and more trust Inspectiv and its security community to keep them secure.
            <br />
            Our mission is to #SecureTheInternet
          </p>
          </div>
        </section>
      </div>
    </aside>
    <main>
      <form action="#" class="c-signup-form">
        <header class="c-signup-form__header u-mb-20">
          <h2 class="u-fw-700">Reset Your Password</h2>
        </header>

        <div class="l-stack l-stack--form">
          <!-- password field -->
          <div class="c-signup-form__field c-form__group">
            <label for="newPassword" class="c-form__label c-form__label--small">New Password</label>
            <input
              id="newPassword"
              type="password"
              @keydown.enter.prevent="submitPasswordResetForm()"
              v-model="changePasswordForm.password"
              class="o-input"
              placeholder="New Password"
            />
          </div>

          <!-- confirm password field -->
          <div class="c-signup-form__field c-form__group">
            <label for="confirmPassword" class="c-form__label c-form__label--small">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              @keydown.enter.prevent="submitPasswordResetForm()"
              v-model="changePasswordForm.confirmPassword"
              class="o-input"
              placeholder="Confirm Password"
            />
          </div>
        </div>

        <div class="u-mt-25">
          <button
            type="button"
            :disabled="submitButtonDisabled"
            class="o-btn o-btn--primary o-btn--rounded o-btn--block o-btn--sm"
            @click="submitPasswordResetForm()"
          >
            Change Password
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { STORE_KEY, RESET_PASSWORD, GET_USER } from '@/stores/account/types'

export default {
  name: 'Recovery',
  data() {
    return {
      loading: false,
      changePasswordForm: {
        token: '',
        password: '',
        confirmPassword: '',
      },
    }
  },
  methods: {
    ...mapActions(STORE_KEY, {
      resetPassword: RESET_PASSWORD,
    }),
    onPasswordResetSuccess() {
      this.loading = false
      this.$solar.hide()

      this.$caAlert.success('Your password has been reset. Please login to continue using the platform.')

      this.$router.push({ name: 'LogIn' })
    },
    onPasswordResetFail(response) {
      this.loading = false
      this.$solar.hide()

      const error =
        response && response.data && response.data.error
          ? response.data.error
          : "Sorry, we're having trouble processing your request right now."

      this.$caAlert.error(error)
    },
    submitPasswordResetForm() {
      this.loading = true
      this.$solar.show()
      const payload = {
        token: this.changePasswordForm.token,
        password_1: this.changePasswordForm.password,
        password_2: this.changePasswordForm.confirmPassword,
      }
      this.resetPassword(payload)
        .then(response => {
          if (response.status !== 200) {
            this.onPasswordResetFail(response)
            return
          }

          this.onPasswordResetSuccess(response)
          this.$solar.hide()
        })
        .catch(response => {
          this.onPasswordResetFail(response)
        })
    },
  },
  computed: {
    ...mapGetters(STORE_KEY, {
      user: GET_USER,
    }),
    submitButtonDisabled() {
      return this.loading || !this.changePasswordForm.password || !this.changePasswordForm.confirmPassword
    },
  },
  mounted() {
    const isAuthenticated = this.user && this.user.token
    if (isAuthenticated) {
      this.$router.push({ name: 'Programs' })
    }

    this.changePasswordForm.token = this.$route.params.token || ''
  },
}
</script>
