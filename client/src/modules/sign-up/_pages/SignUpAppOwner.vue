<template>
  <div class="c-signup--ao">
    <main class="l-wrap">
      <img class="c-signup-logo" src="/static/images/site-logos/inspectiv-logo.svg" alt="Inspectiv logo" />
      <form class="c-signup-form" autocomplete="off" action="POST">
        <header class="c-signup-form__header">
          <h2 class="u-fw-700">Create your free account</h2>
          <p class="o-text o-text--grey">
            Already have an account?
            <router-link :to="{ name: 'LogIn' }"><span>Sign in</span></router-link>
          </p>

          <!-- close/back button -->
          <div class="c-signup-close">
            <i class="fal fa-times"></i>
          </div>
        </header>

        <div class="l-stack l-stack--form">
          <!-- domain field -->
          <div class="c-signup-form__field c-form__group">
            <label for="domain" class="c-form__label c-form__label--small">Primary Domain</label>
            <div class="c-input-icon">
              <input id="domain" type="text" class="o-input" placeholder="Enter your primary domain" />
            </div>
          </div>

          <div class="l-stack l-stack--form l-stack--two-col">
            <!-- first name field -->
            <div class="c-signup-form__field c-form__group">
              <label for="first-name" class="c-form__label c-form__label--small">First name</label>

              <input id="first name" type="text" class="o-input" placeholder="Enter your first name" />
            </div>
            <!-- last name field -->
            <div class="c-signup-form__field c-form__group">
              <label for="last-name" class="c-form__label c-form__label--small">Last name</label>
              <input id="last-name" type="text" class="o-input" placeholder="Enter your last name" />
            </div>
          </div>

          <!-- email field -->
          <div class="c-signup-form__field c-form__group">
            <label for="email" class="c-form__label c-form__label--small">Email</label>
            <input id="email" type="password" placeholder="Enter your email" class="o-input" />
          </div>

          <!-- password field -->
          <div class="c-signup-form__field c-form__group">
            <label for="password" class="c-form__label c-form__label--small">Password</label>

            <div class="c-input-icon">
              <input id="password" type="password" placeholder="Create Password" class="o-input" />
              <i class="far fa-variable-icon"></i>
            </div>
            <div class="o-text o-text--error o-text--700 u-mt-5">Password error message.</div>
          </div>

          <!-- repeat password field -->
          <!-- <div class="c-signup-form__field c-form__group">
            <label for="confirmPassword" class="c-form__label c-form__label--small">Confirm Password</label>
            <div class="c-input-icon">
              <input id="confirmPassword" type="password" placeholder="Re-enter the password" class="o-input" />
              <i class="far fa-variable-icon"></i>
            </div>
            <div class="o-text o-text--error o-text--700 u-mt-5">
              These passwords do not match. Please check your spelling and try again.
            </div>
          </div> -->
        </div>

        <!-- form submit -->
        <div class="u-mt-25">
          <button type="submit" class="o-btn o-btn--primary o-btn--rounded o-btn--block">Register</button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
export default {
  name: 'SignUpAppOwner',
  components: {},
  data: () => {
    return {}
  },
  methods: {},
  computed: {},
  mounted() {},
}
</script>
