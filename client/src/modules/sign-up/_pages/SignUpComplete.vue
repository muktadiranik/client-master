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
          <h2 class="-fw-700">Almost there!</h2>
          <p class="o-text o-text--grey">Please complete the form for {{ registrationForm.email }}</p>
        </header>

        <div class="l-stack l-stack--form">
          <!-- full-name field -->
          <div class="c-signup-form__field c-form__group" :class="nameFieldClass">
            <label for="fullname" class="c-form__label c-form__label--small">Fullname</label>
            <div class="c-input-icon">
              <input
                id="fullname"
                type="text"
                v-model.lazy="registrationForm.name"
                class="o-input"
                placeholder="Enter your full-name"
              />
              <i class="far fa-variable-icon"></i>
            </div>
            <div class="o-text o-text--error o-text--700 u-mt-5">Please enter first and last name.</div>
          </div>
          <!-- email field -->
          <!-- <input
            type="hidden"
            class="o-input"
            v-model.lazy="registrationForm.email"
            :disabled="!confirmationCheckLoading"
            hidden
          /> -->

          <!-- username field -->
          <div class="c-signup-form__field c-form__group" :class="usernameFieldClass">
            <label for="username" class="c-form__label c-form__label--small">Username</label>
            <div class="c-input-icon">
              <input
                id="username"
                type="text"
                v-model.lazy="registrationForm.username"
                placeholder="Choose a username"
                class="o-input"
                @change="checkUsernameAvailability()"
              />
              <i class="far fa-variable-icon" :class="{ 'fa-spin': usernameCheckLoading }"></i>
            </div>
            <div class="o-text o-text--error o-text--700 u-mt-5">Invalid username.</div>
            <div class="o-text o-text--warning o-text--700 u-mt-5">This username is already in use.</div>
          </div>

          <!-- password field -->
          <div class="c-signup-form__field c-form__group" :class="passwordFieldClass">
            <label for="password" class="c-form__label c-form__label--small">Password</label>

            <div class="c-input-icon">
              <input
                id="password"
                type="password"
                v-model.lazy="registrationForm.password"
                placeholder="Create a password"
                class="o-input"
              />
              <i class="far fa-variable-icon"></i>
            </div>
            <div class="o-text o-text--error o-text--700 u-mt-5">Passwords must at least 8 characters long.</div>
          </div>

          <!-- repeat password field -->
          <div class="c-signup-form__field c-form__group" :class="passwordRepeatFieldClass">
            <label for="confirmPassword" class="c-form__label c-form__label--small">Confirm Password</label>
            <div class="c-input-icon">
              <input
                id="confirmPassword"
                type="password"
                v-model.lazy="registrationForm.passwordRepeat"
                placeholder="Re-enter the password"
                class="o-input"
              />
              <i class="far fa-variable-icon"></i>
            </div>
            <div class="o-text o-text--error o-text--700 u-mt-5">
              These passwords do not match. Please check your spelling and try again.
            </div>
          </div>
        </div>

        <!-- upload photo -->
        <div class="u-mt-25 o-upload-photo">
          <input
            type="file"
            accept="image/*"
            class="o-upload-photo__input u-hide-input"
            id="upload-photo"
            ref="attachment"
            @change="handlePhotoChange($event)"
          />

          <!-- upload box -->
          <label for="upload-photo" class="o-upload-photo__label">
            <img :src="profilePhotoBase64 ? profilePhotoBase64 : '/static/images/avatar-person.svg'" />
          </label>
        </div>

        <!-- terms and conditions checkbox -->
        <div class="u-mt-20">
          <input type="checkbox" id="accept-terms" class="" v-model="registrationForm.accept_terms" />
          <label for="accept-terms" class="">
            I accept the
            <a
              :href="
                userType === 'researcher'
                  ? 'https://www.inspectiv.com/researchertermsandconditions.html'
                  : 'https://www.inspectiv.com/customertermsandconditions.html'
              "
              target="_blank"
              rel="noreferrer noopener"
            >
              terms and conditions
            </a>
          </label>
        </div>

        <!-- researcher agreement checkbox -->
        <div class="" v-if="userType !== 'application_owner'">
          <input
            type="checkbox"
            id="researcher-agreement"
            class=""
            v-model="registrationForm.accept_researcher_terms"
          />
          <label for="researcher-agreement" class="">
            I accept the
            <a href="https://www.inspectiv.com/ResearcherAgreement.html" target="_blank" rel="noreferrer noopener"
              >researcher agreement</a
            >
          </label>
        </div>

        <!-- form submit -->
        <div class="u-mt-25">
          <button
            type="submit"
            class="o-btn o-btn--primary o-btn--rounded o-btn--block"
            :class="continueButtonClass"
            :disabled="!formValid"
            @click.prevent="register"
          >
            Continue
          </button>
        </div>

        <!-- form footer -->
        <footer class="c-signup-form__footer u-mt-25">
          <p class="o-text o-text--grey">
            Already have an account?
            <router-link :to="{ name: 'LogIn' }"><span class="u-ml-5 o-text--500">Log in</span></router-link>
          </p>
        </footer>
      </form>
    </main>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
import store from '@/modules/sign-up/_store'
import { STORE_KEY, CHECK_CONFIRMATION, CHECK_USERNAME, COMPLETE_PROFILE } from '@/modules/sign-up/_store/types'
import { SET_USER, STORE_KEY as ACCOUNT_STORE_KEY } from '@/stores/account/types'

export default {
  name: 'SignUpFull',
  data() {
    return {
      isInvite: false,
      token: '',
      usernameIsTaken: false,
      usernameCheckLoading: false,
      usernameIsInvalid: false,
      userType: '',
      confirmationCheckLoading: false,
      profilePhotoFile: File,
      profilePhotoBase64: null,
      registrationForm: {
        email: '',
        name: '',
        username: '',
        password: '',
        passwordRepeat: '',
        accept_terms: false,
        accept_researcher_terms: false,
      },
      program: {},
    }
  },
  methods: {
    ...mapActions(STORE_KEY, {
      checkUsername: CHECK_USERNAME,
      checkConfirmation: CHECK_CONFIRMATION,
    }),
    async checkUsernameAvailability() {
      if (!this.registrationForm.username) {
        return
      }

      this.usernameCheckLoading = true
      let taken = false
      try {
        const username = this.registrationForm.username
        const response = await this.checkUsername(username)
        if (!response || !response.data || !response.data.message) {
          return
        }
        this.usernameIsInvalid = false
        taken = response.data.message === 'taken'
      } catch (e) {
        this.usernameIsInvalid = true
      } finally {
        this.usernameCheckLoading = false
        this.usernameIsTaken = taken
      }
    },
    confirmationCheckFailed() {
      const msg = `The confirmation token provided is invalid or has expired.
        Please sign up to request a new confirmation link.`

      this.$caAlert.createOrUpdate({
        id: 'sign-up-error',
        closable: false,
        buttons: [
          {
            text: 'Sign Up',
            callback: () => {
              this.$router.push({ name: 'SignUp' })
              this.$caAlert.close('sign-up-error')
            },
          },
        ],
        text: msg,
        type: 'warn',
      })
    },
    async confirmSignUpToken() {
      try {
        this.$solar.show()

        const response = await this.checkConfirmation(this.token)
        if (!response || !response.data || response.status !== 200) {
          return
        }

        const data = response.data

        this.registrationForm.email = data.email
        this.userType = data.user_type
        this.isInvite = data.is_invite
        this.program = data.program
      } catch (e) {
        this.confirmationCheckFailed()
      } finally {
        this.$solar.hide()
        this.confirmationCheckLoading = false
      }
    },
    handlePhotoChange(e) {
      const file = e.target.files[0] || null
      if (!file || !file.name || !/\.(jpe?g|png|gif)$/i.test(file.name)) {
        return
      }

      this.profilePhotoFile = file

      const reader = new FileReader()
      reader.onload = e => {
        this.profilePhotoBase64 = reader.result
      }

      reader.readAsDataURL(file)
    },
    register() {
      const split = this.registrationForm.name.split(' ')
      const fname = split[0]
      const lname = split[split.length - 1]

      const files = this.$refs.attachment.files
      const filename = files && files.length > 0 ? files[0].name : null

      let payload = {
        token: this.token,
        first_name: fname,
        last_name: lname,
        password_1: this.registrationForm.password,
        password_2: this.registrationForm.passwordRepeat,
        username: this.registrationForm.username,
        attachment: this.profilePhotoBase64,
        filename: filename,
        accept_terms: this.acceptedTerms,
      }

      this.$solar.show()

      this.$store
        .dispatch(`${STORE_KEY}/${COMPLETE_PROFILE}`, payload)
        .then(response => {
          const msg = 'Signup successful. You may now begin to use the platform.'
          this.$caAlert.success(msg)
          const user = response.data
          localStorage.setItem('inspectiv', user.token)
          this.$store.commit(`${ACCOUNT_STORE_KEY}/${SET_USER}`, user)
          this.$router.push({ name: 'Default' })
          this.$solar.hide()
        })
        .catch(response => {
          const error =
            response && response.data && response.data.error
              ? response.data.error
              : "Sorry, we're having trouble processing your request right now."
          this.registrationForm.password = ''
          this.registrationForm.passwordRepeat = ''
          this.$caAlert.error(error)
          this.$solar.hide()
        })
    },
  },
  computed: {
    continueButtonClass() {
      switch (this.userType) {
        case 'researcher':
          return 'researcher'
        case 'program_manager':
          return 'programManager'
        case 'application_owner':
          return 'appOwner'
        default:
          return ''
      }
    },
    acceptedTerms() {
      return this.userType === 'application_owner'
        ? this.registrationForm.accept_terms
        : this.registrationForm.accept_terms && this.registrationForm.accept_researcher_terms
    },
    formValid() {
      if (!this.acceptedTerms || !this.registrationForm.name) {
        return false
      }

      if (this.registrationForm.password.length < 8) {
        return false
      }

      if (
        !this.registrationForm.password ||
        !this.registrationForm.passwordRepeat ||
        this.registrationForm.password !== this.registrationForm.passwordRepeat
      ) {
        return false
      }

      if (this.usernameIsInvalid) {
        return false
      }

      return true
    },
    nameFieldClass() {
      if (!this.registrationForm.name) {
        return
      }

      const split = this.registrationForm.name.split(' ')
      if (split.length < 2) {
        return 'is-incorrect'
      }

      const fname = split[0]
      const lname = split[split.length - 1]

      return {
        'is-correct': this.registrationForm.name && fname && lname,
        'is-incorrect': this.registrationForm.name && (!fname || !lname),
      }
    },
    passwordFieldClass() {
      return {
        'is-correct': this.registrationForm.password && this.registrationForm.password.length >= 8,
        'is-incorrect': this.registrationForm.password && this.registrationForm.password.length < 8,
      }
    },
    passwordRepeatFieldClass() {
      return {
        'is-correct':
          this.registrationForm.password && this.registrationForm.passwordRepeat === this.registrationForm.password,
        'is-incorrect':
          this.registrationForm.password &&
          this.registrationForm.passwordRepeat &&
          this.registrationForm.passwordRepeat !== this.registrationForm.password,
      }
    },
    usernameFieldClass() {
      if (this.usernameCheckLoading) {
        return 'is-checking'
      }

      return {
        'is-correct':
          this.registrationForm.username && !this.usernameIsTaken && !this.registrationForm.username.includes(' '),
        'has-warning': this.registrationForm.username && this.usernameIsTaken,
        'is-incorrect': this.registrationForm.username && this.usernameIsInvalid,
      }
    },
  },
  mounted() {
    this.token = this.$route.params.token
    if (!this.token) {
      this.confirmationCheckFailed()
      return
    }

    if (!([STORE_KEY] in this.$store._modules.root._children)) {
      this.$store.registerModule([STORE_KEY], store)
    }

    this.confirmSignUpToken()
  },
  destroyed() {
    this.$caAlert.close('sign-up-error')
  },
}
</script>
