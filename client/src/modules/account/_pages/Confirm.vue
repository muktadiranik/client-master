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
      <form class="c-signup-form" action="#">
        <header class="c-signup-form__header u-mb-20">
          <h2 class="u-fw-700">Account confirmation</h2>
        </header>

        <div class="l-stack l-stack--form">
          <!-- Confirmation code field -->
          <div class="c-signup-form__field c-form__group">
            <label for="confirmation" class="c-form__label c-form__label--small">Fullname</label>
            <input id="confirmation" type="text" class="o-input" v-model="code" placeholder="Confirmation Code" />
          </div>
        </div>

        <!-- Submit button -->
        <div class="u-mt-25">
          <button
            type="button"
            class="o-btn o-btn--primary o-btn--rounded o-btn--block"
            id="submitButton"
            @click="confirmRequest()"
          >
            Confirm account
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Confirm',
  data: () => {
    return {
      code: '',
    }
  },
  mounted() {
    this.code = this.$route.params.code || ''
    if (this.code) {
      this.confirmRequest(this.code)
    }
  },
  methods: {
    async confirmRequest() {
      const url = `${API_BASE_URL}/accounts/email/confirm/`
      const postData = { token: this.code }

      this.$solar.show()
      try {
        await axios.post(url, postData)
        const msg = 'Thanks for verifying your account! You can now login and start using the platform.'
        this.$caAlert.createOrUpdate({
          id: 'log-in-success',
          closable: false,
          buttons: [
            {
              text: 'Log In',
              callback: () => {
                this.$router.push({ name: 'LogIn' })
                this.$caAlert.close('log-in-success')
              },
            },
          ],
          text: msg,
          type: 'success',
        })
      } catch (e) {
        this.$caAlert.error('There was an error confirming your account.')
      } finally {
        this.$solar.hide()
      }
    },
  },
}
</script>
