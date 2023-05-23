<template>
  <footer class="c-site-footer" v-if="isLoginOrSignUpPage">
    <div class="l-wrap">
      <div class="footer-logo">
        <a href="/">
          <img src="/static/images/cesppa-blue-logo.svg" alt="Footer Logo" />
        </a>
      </div>
      <p>
        &copy; Inspectiv 2021. All Rights Reserved.
        <br />
        <a href="https://www.inspectiv.com/PrivacyPolicy.html">Privacy Policy</a> |
        <a href="https://www.inspectiv.com/TermsOfUse.html">Terms &amp; Conditions</a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'CaFooter',
  data() {
    return {}
  },
  computed: {
    isLoginOrSignUpPage() {
      if (this.$route.path === '/log-in' || this.$route.path === '/sign-up') {
        return true
      }
      return false
    },
  },
}
</script>
