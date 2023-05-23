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
      <div v-if="migratedUser">
        <header class="u-text-center u-mb-30">
          <h2 class="u-fw-700">You have been migrated!</h2>
          <p>Follow the link below to take you to your new Inspectiv dashboard</p>
          <a href="https://dashboard.inspectiv.io">
            <button
              type="button"
              class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm u-mt-10"
            >
              Dashboard App
            </button>
          </a>
        </header>
      </div>
      <form v-else class="c-signup-form" action="POST" @submit.prevent="logIn">
        <!-- Form header -->
        <header class="c-signup-form__header u-mb-30">
          <h2 class="u-fw-700">Login to your account</h2>
        </header>

        <div class="l-stack l-stack--form">
          <!-- Username field -->
          <div class="c-signup-form__field c-form__group">
            <label for="email" class="c-form__label c-form__label--small">Email or Username</label>
            <input
              id="email"
              type="email"
              v-model="username"
              v-on:keyup.enter="logIn()"
              class="o-input"
              placeholder="Enter your email"
            />
          </div>

          <!-- Password field -->
          <div class="c-signup-form__field c-form__group">
            <div class="l-flex u-jc-sb">
              <label for="password" class="c-form__label c-form__label--small">Password</label>
              <!-- Reset password link -->
              <div>
                <p class="o-text o-text--sm u-fs-11 o-text--500">
                  <router-link tabindex="-1" :to="{ path: '/account/recovery' }">Forgot your password?</router-link>
                </p>
              </div>
            </div>
            <input
              id="password"
              type="password"
              v-model="password"
              v-on:keyup.enter="logIn()"
              class="o-input"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <!-- ReCaptcha -->
        <div id="recaptcha_badge">
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

        <!-- Submit button -->
        <div class="u-mt-25">
          <button
            type="button"
            @click="logIn()"
            v-on:keyup.enter="logIn()"
            :disabled="submitDisabled"
            class="o-btn o-btn--primary o-btn--rounded o-btn--block"
          >
            Log In
          </button>
        </div>

        <!-- Form footer -->
        <footer class="u-mt-25">
          <p class="o-text o-text--mute o-text--sm u-fs-11">
            Don't have an account?
            <router-link :to="{ name: 'SignUp' }"><span class="u-ml-5 o-text--500">Sign Up</span></router-link>
          </p>
        </footer>
      </form>
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'
import { STORE_KEY, LOGIN } from '@/stores/account/types'
import { AccountMixin } from '@/mixins/account'
import { NotificationsMixin } from '@/mixins/notifications'
import { APPLICATION_OWNER, PROGRAM_MANAGER, RESEARCHER, BANKER } from '@/modules/core/models/user-types'

export default {
  name: 'LogIn',
  components: {
    VueRecaptcha,
  },
  mixins: [AccountMixin, NotificationsMixin],
  data() {
    return {
      username: '',
      password: '',
      siteKey: RECAPTCHA_SITE_KEY,
      recaptchaCode: '',
      loading: false,
      migratedUser: false
    }
  },
  methods: {
    ...mapActions(STORE_KEY, {
      login: LOGIN,
    }),
    async logIn() {
      this.$solar.show()
      this.loading = true

      if (!this.recaptchaCode) {
        this.$refs.recaptcha.execute()
        return
      }

      await this.logInPost()
    },
    async logInPost() {
      const postData = {
        username: this.username,
        password: this.password,
        recaptcha_code: this.recaptchaCode,
      }

      let success = false
      let error = ''

      try {
        const response = await this.login(postData)
        if (response.status === 202){
          this.migratedUser = true
          return
        }
        if (!response || response.status !== 200) {
          this.recaptchaCode = ''
          this.$refs.recaptcha.reset()

          error = response.data && response.data.error ? response.data.error : 'Login failed'

          this.$caAlert.error(error)
        } else {
          success = true
          await this.getNotifications()
        }
      } catch (e) {
        error = e.data && e.data.error ? e.data.error : 'Login failed'
      } finally {
        if (!this.migratedUser) {
          this.recaptchaCode = ''
          this.$solar.hide()
          this.loading = false

          if (!success) {
            this.username = ''
            this.password = ''
            this.$refs.recaptcha.reset()
            this.$caAlert.error(error)
          } else {
            this.recaptchaCode = ''
            const programUuid = this.$route.params.programUuid || ''

            let routeOptions
            switch (this.getUserType()) {
              case APPLICATION_OWNER:
              case PROGRAM_MANAGER:
                routeOptions = {name: 'Findings'}
                break
              case RESEARCHER:
                routeOptions = {name: 'Submissions'}
                break
              case BANKER:
                routeOptions = {name: 'Transactions'}
                break
            }
            if (programUuid) {
              routeOptions = this.userIsResearcher()
                ? {path: `/submissions/${programUuid}/create`}
                : {path: `/programs/${programUuid}`}
            }
            if (this.getEntryRedirect) {
              routeOptions = {path: this.getEntryRedirect}
            }
            this.$router.push(routeOptions)
            this.startPoll()
          }
        }
      }
    },
    vueRecaptchaApiLoaded() {},
    async onVerifyRecaptcha(response) {
      this.recaptchaCode = response
      await this.logInPost()
    },
    onExpiredRecaptcha() {
      this.recaptchaCode = ''
      this.username = ''
      this.password = ''
    },
  },
  computed: {
    submitDisabled() {
      return !this.username || !this.password || this.loading
    },
  },
  async created() {
    try {
      if (Object.keys(this.$route.query).length === 0) return
      // get params from route
      const { code, username, redirect } = this.$route.query
      // synthetic login endpoint
      await this.actionSyntheticLogin({ code, username })
      // redirect
      this.$router.push({ name: redirect })
    } catch (error) {}
  },
}
</script>
