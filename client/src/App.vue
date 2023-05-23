<template>
  <div
    id="inspectiv-app"
    class="wrapper"
    ondragstart="return false;"
    ondrop="return false;"
    ondragover="return false;"
    v-dynamic-color
  >
    <!-- Header -->
    <CaNavbar v-if="!isLoggedOutPage" />

    <CaSolar v-if="!isLoggedOutPage" />
    <div class="ca-alerts-top" ref="CaAlertsTop" />

    <!-- Main -->
    <router-view :key="$route.fullPath"></router-view>

    <modals-container />

    <!-- Footer -->
    <CaFooter v-if="!isLoggedOutPage" />

    <CaAlerts />
    <div ref="CaAlerts" />
    <CaDialogs />
    <!-- <NotificationController /> -->
  </div>
</template>

<script>
import store from '@/stores'
import CaAlerts from '@/plugins/ca-alerts/components/CaAlerts'
import CaDialogs from '@/plugins/ca-dialogs/components/CaDialogs'
import CaFooter from '@/modules/core/_components/ca-footer/CaFooter'
import CaNavbar from '@/modules/core/_components/ca-navbar/CaNavbar'
import CaSolar from '@/plugins/ca-solar/components/CaSolar'
// import NotificationController from '@/modules/notifications/components/NotificationController'
import { dynamicColor } from '@/directives/dynamic-color'

export default {
  name: 'App',
  store: store,
  data() {
    return {}
  },
  computed: {
    isProgramPage() {
      const programRouteNames = [
        'Program',
        'ProgramEdit',
        'ProgramEditPreview',
        'ProgramCreate',
        'ProgramSubmissions',
        'ProgramTransactions',
        'ProgramFindings',
        'ProgramSettings',
        'ProgramSettingsSubmissionTemplate',
        'ProgramSettingsTeam',
        'ProgramSettingsIntegrations',
      ]
      return programRouteNames.includes(this.$route.name)
    },
    isTransactionsPage() {
      if (!this.$route || !this.$route.name) {
        return false
      }
      const transactionsRouteNames = ['Transactions', 'TransactionsPending', 'TransactionsHistorical']
      return transactionsRouteNames.includes(this.$route.name)
    },
    isLoggedOutPage() {
      if (!this.$route || !this.$route.name) {
        return true
      }
      const routeName = this.$route.name || ''
      const unauthenticatedPages = [
        'Default',
        'LogIn',
        'SignUp',
        'Confirm',
        'RecoveryRequest',
        'Recovery',
        'EmailConfirmation',
        'SignUpComplete',
        'SignUpAppOwner',
      ]
      return unauthenticatedPages.includes(routeName)
    },
  },
  methods: {
    updateBodyClass() {
      const body = document.body
      const mql = window.matchMedia('(max-width: 1023px)')
      const pageOverlay = body.querySelector('.c-page-overlay')

      body.className = ''
      if (pageOverlay) {
        pageOverlay.className = 'c-page-overlay'
      }

      if (mql.matches) {
        body.classList.add('is-mobile')
      }

      if (mql.matches && !this.isLoggedOutPage) {
        body.classList.add('c-header-mobile--enabled')
      }

      if (!mql.matches && !this.isLoggedOutPage) {
        body.classList.add('c-header--enabled')
        body.classList.add('c-navbar--enabled')
      }

      if (this.isTransactionsPage && !mql.matches) {
        body.classList.add('c-subheader--enabled')
      }
    },
  },
  components: {
    // NotificationController,
    CaAlerts,
    CaDialogs,
    CaFooter,
    CaNavbar,
    CaSolar,
  },
  directives: { dynamicColor },
  mounted() {
    window.addEventListener('resize', this.updateBodyClass)
  },
  watch: {
    $route: function () {
      this.updateBodyClass()
    },
  },
}
</script>
