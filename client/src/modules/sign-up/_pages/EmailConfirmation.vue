<template>
  <div class="c-signup-successful">
    <div class="u-mb-40">
      <a href="/">
        <img src="/static/images/site-logos/logo-blue-h.svg" alt="Logo Blue Horizontal" width="190" />
      </a>
    </div>
    <div class="c-signup-successful__box">
      <header class="c-signup-successful__box-header">
        <img src="/static/images/envelope-illustration.svg" alt="Envelope Illustration" />
      </header>
      <div class="c-signup-successful__box-body">
        <h6 class="o-h6">Email verification on the way!</h6>
        <p class="o-text o-text--grey o-text--sm">
          You’re almost there. <br />
          Please check your email and verify your address to get started.
        </p>
      </div>
      <footer class="c-signup-successful__footer">
        <p class="o-text o-text--mute o-text--sm">
          Don’t see the message in your inbox? <br />
          Double check your spam folder. If it's not there, shoot us an email at
          <a href="mailto:help@inspectiv.com">help@inspectiv.com</a> and we'll track it down for you.
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailConfirmation',
  data: () => {
    return {}
  },
}
</script>
