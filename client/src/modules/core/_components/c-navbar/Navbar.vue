<template>
  <div class="u-height-full">
    <div class="c-navbar-desktop c-navbar__menu-wrapper">
      <ul class="c-navbar__menu-list" v-show="userIsActive()">
        <li class="c-navbar__menu-item" v-if="false">
          <a href="#/dashboard" class="c-navbar__menu-link">
            <span class="c-navbar__menu-link-text">Dashboard</span>
          </a>
        </li>
        <AllProgramsMenu />
        <li
          class="c-navbar__menu-item"
          :class="isPage('submission') && !isPage('programs') ? 'c-navbar__menu-item--active' : ''"
          v-show="showSubmissionsLink"
        >
          <a href="#/submissions" class="c-navbar__menu-link">
            <span class="c-navbar__menu-link-text">Submissions</span>
          </a>
        </li>
        <li
          class="c-navbar__menu-item"
          :class="isPage('finding') && !isPage('programs') ? 'c-navbar__menu-item--active' : ''"
          v-show="showFindingsLink"
        >
          <a href="#/findings" class="c-navbar__menu-link">
            <span class="c-navbar__menu-link-text">Vulnerabilities</span>
          </a>
        </li>
        <li
          class="c-navbar__menu-item"
          :class="isPage('reports') ? 'c-navbar__menu-item--active' : ''"
          v-show="showReportsLink"
        >
          <a href="#/reports/templates" class="c-navbar__menu-link">
            <span class="c-navbar__menu-link-text">Reports</span>
          </a>
        </li>
        <li
          class="c-navbar__menu-item"
          :class="isPage('my-payments') ? 'c-navbar__menu-item--active' : ''"
          v-show="showPaymentsLink"
        >
          <a href="#/bank/my-payments" class="c-navbar__menu-link">
            <span class="c-navbar__menu-link-text">Payments</span>
          </a>
        </li>
        <li
          class="c-navbar__menu-item"
          :class="isPage('bank') && !isPage('programs') ? 'c-navbar__menu-item--active' : ''"
        >
          <a
            class="c-navbar__menu-link u-cursor-pointer"
            v-show="userIsBanker() || userIsProgramManager()"
            @click.stop="onBankIconClick"
          >
            <span class="c-navbar__menu-link-text">Bank</span>
          </a>
        </li>
        <!-- <li class="c-navbar__menu-item" :class="isPage('account') ? 'c-navbar__menu-item--active' : ''">
        <a href="/#/account" class="c-navbar__menu-link">
          <span class="c-navbar__menu-link-text">My Profile</span>
        </a>
      </li>
      <li class="c-navbar__menu-item">
        <a href="#" class="c-navbar__menu-link" @click.prevent="logoutClick">
          <span class="c-navbar__menu-link-text">Sign Out</span>
        </a>
      </li> -->
      </ul>
    </div>

    <div class="c-navbar-mobile">
      <ul class="c-navbar__menu-list" v-show="userIsActive()">
        <li class="c-navbar__menu-item" v-if="false">
          <a href="#/dashboard" class="c-navbar__menu-link">
            <span class="c-navbar__menu-link-text">Dashboard</span>
          </a>
        </li>
        <AllProgramsMenu />
        <li
          class="c-navbar__menu-item"
          :class="isPage('submission') ? 'c-navbar__menu-item--active' : ''"
          v-show="showSubmissionsLink"
        >
          <a href="#/submissions" class="c-navbar__menu-link">
            <span class="c-navbar__menu-link-text">Submissions</span>
          </a>
        </li>
        <li
          class="c-navbar__menu-item"
          :class="isPage('finding') ? 'c-navbar__menu-item--active' : ''"
          v-show="showFindingsLink"
        >
          <a href="#/findings" class="c-navbar__menu-link">
            <span class="c-navbar__menu-link-text">Vulnerabilities</span>
          </a>
        </li>
        <li
          class="c-navbar__menu-item"
          :class="isPage('reporttemplates') ? 'c-navbar__menu-item--active' : ''"
          v-show="showReportsLink"
        >
          <a href="#/reports/templates" class="c-navbar__menu-link">
            <span class="c-navbar__menu-link-text">Reports</span>
          </a>
        </li>
        <li
          class="c-navbar__menu-item"
          :class="isPage('UserProfileTransactions') ? 'c-navbar__menu-item--active' : ''"
          v-show="showPaymentsLink"
        >
          <a href="#/bank/my-payments" class="c-navbar__menu-link">
            <span class="c-navbar__menu-link-text">Payments</span>
          </a>
        </li>
        <li class="c-navbar__menu-item" :class="isPage('bank') ? 'c-navbar__menu-item--active' : ''">
          <a
            class="c-navbar__menu-link u-cursor-pointer"
            v-show="userIsBanker() || userIsProgramManager()"
            @click.stop="onBankIconClick"
          >
            <span class="c-navbar__menu-link-text">Bank</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { STORE_KEY, LOGOUT } from '@/stores/account/types'

import { AccountMixin } from '@/mixins/account'
import { NavbarMixin } from '@/mixins/navbar'
import { NotificationsMixin } from '@/mixins/notifications'
import AllProgramsMenu from '@/modules/core/_components/c-navbar/AllProgramsMenu'

export default {
  name: 'Navbar',
  components: {
    AllProgramsMenu,
  },
  mixins: [AccountMixin, NavbarMixin, NotificationsMixin],
  data() {
    return {}
  },
  computed: {
    appOwnerCheck() {
      if (!this.userIsAppOwner()) {
        return true
      }
      return this.assignedPrograms && this.assignedPrograms.length > 0
    },
    showFindingsLink() {
      return !this.userIsResearcher() && this.appOwnerCheck
    },
    showPaymentsLink() {
      return this.userIsResearcher()
    },
    showProgramsLink() {
      return this.appOwnerCheck
    },
    showSubmissionsLink() {
      return !this.userIsAppOwner()
    },
    showReportsLink() {
      return this.userIsProgramManager()
    },
    notificationIconClass() {
      return !this.hasUnreadNotifications ? '' : 'unread'
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      logout: LOGOUT,
    }),
    isPage(str) {
      const path = this.$route.path
      return path.toLowerCase().includes(str.toLowerCase())
    },
    onBankIconClick() {
      if (this.userIsBanker() || this.userIsProgramManager()) {
        this.$router.push({
          name: 'Transactions',
        })
      }
    },
    logoutClick() {
      this.logout().then(() => {
        this.$store.dispatch('RESET_ALL_STORES')

        this.resetNotificationStore().then(() => {
          this.$router.push({ name: 'LogIn' })
        })
      })
    },
  },
}
</script>
