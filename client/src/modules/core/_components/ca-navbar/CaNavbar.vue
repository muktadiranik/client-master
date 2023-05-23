<template>
  <header class="c-site-header">
    <!-- PAGE OVERLAY -->
    <div class="c-page-overlay" ref="pageOverlay" @click="pageOverlayClickHandler"></div>
    <!-- /.c-page-overlay -->

    <!-- MOBILE HEADER -->
    <div class="c-header-mobile" v-if="isMobile">
      <div class="c-header-mobile__toolbar">
        <button class="c-header-mobile__toolbar-toggler" @click="sidebarTogglerClickHandler">
          <i class="far fa-align-justify"></i>
        </button>
        <button class="c-header-mobile__toolbar-toggler" @click="toggleProgramMenuBar" v-if="isProgramPage">
          <i class="far fa-align-right"></i>
        </button>
      </div>
      <div class="c-header-mobile__logo">
        <a href="/" class="c-header-mobile__logo-link">
          <img src="/static/images/site-logos/inspectiv-logo.svg" alt="Inspectiv Logo" class="c-header-mobile__logo-img" />
        </a>
      </div>
      <div class="c-header__topbar" v-if="showAuthenticatedNavbar">
        <div class="c-header__topbar-item">
          <div class="u-position-relative" @click="toggleProfileMenu" v-click-outside="hideProfileMenu">
            <div class="c-header__topbar-user-media u-ml-15 l-flex u-ai-center">
              <div class="u-text-right u-mr-10">
                <div class="c-header__topbar-user-fullname">
                  {{ fullName }}
                </div>
                <div class="c-header__topbar-user-username u-text-mute">
                  {{ userUsername }}
                </div>
              </div>
              <img :src="userImage" :alt="userUsername" class="c-header__topbar-user-img" />
            </div>

            <transition name="submenu">
              <ul
                class="c-submenu c-submenu--for-user c-submenu--270 c-submenu--right c-submenu--top-right-arrow"
                :class="{ active: showProfileMenu }"
                v-if="showProfileMenu"
              >
                <li class="c-submenu__item">
                  <div class="c-submenu__user-media l-flex u-ai-fs">
                    <img :src="userImage" :alt="userUsername" class="c-submenu__user-media-img" width="64" />
                    <div class="u-ml-10">
                      <div class="c-submenu__user-media-fullname u-fw-700 u-text-dark">
                        {{ fullName }}
                      </div>
                      <div class="c-submenu__user-media-username u-text-mute">
                        {{ userUsername }}
                      </div>
                      <div class="u-mt-10">
                        <span class="c-badge">Researcher</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="c-submenu__item">
                  <a href="/#/account" class="c-submenu__link" v-if="active && appOwnerCheck"
                    ><i class="far fa-user-alt"></i>My Profile</a
                  >
                </li>
                <li class="c-submenu__item">
                  <a href="#" class="c-submenu__link" @click.prevent="logoutClick" id="log-out-button"
                    ><i class="far fa-sign-out-alt"></i>Sign Out</a
                  >
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <!-- /.c-header-mobile -->

    <!-- MAIN HEADER -->
    <div class="c-header" v-if="!isMobile">
      <div class="c-header-navbar">
        <div class="c-navbar__brand">
          <div class="c-navbar__brand-logo">
            <a href="/" class="c-navbar__brand-logo-link">
              <img
                src="/static/images/site-logos/inspectiv-logo.svg"
                alt="Inspectiv Logo"
                class="c-navbar__brand-logo-icon"
              />
            </a>
          </div>
        </div>
      </div>
      <Navbar/>

      <!-- HEADER TOPBAR -->
      <div class="c-header__topbar" v-if="showAuthenticatedNavbar">
        <div class="c-header__topbar-item">
          <NotificationPanel
            :notifications-list-visible="notificationsListVisible"
            @on-toggle="toggleNotificationsList"
            :app-owner-check="appOwnerCheck"
            v-click-outside="hideNotificationsList"
          />
        </div>
        <div class="c-header__topbar-item">
          <div class="u-position-relative" @click="toggleProfileMenu" v-click-outside="hideProfileMenu">
            <div class="c-header__topbar-user-media u-ml-15 l-flex u-ai-center">
              <div class="u-text-right u-mr-10">
                <div class="c-header__topbar-user-fullname">{{ fullName }}</div>
                <div class="c-header__topbar-user-username u-text-mute">
                  {{ userUsername }}
                </div>
              </div>
              <img :src="userImage" :alt="userUsername" class="c-header__topbar-user-img" />
            </div>
            <transition name="submenu">
              <ul
                class="c-submenu c-submenu--right c-submenu--top-right-arrow c-submenu--for-user"
                :class="{ active: showProfileMenu }"
                v-if="showProfileMenu"
              >
                <li class="c-submenu__item">
                  <a href="/#/account" class="c-submenu__link" v-if="active && appOwnerCheck"
                    ><i class="fal fa-user-circle"></i>My Profile</a
                  >
                </li>
                <li class="c-submenu__item">
                  <a href="#" class="c-submenu__link" @click.prevent="logoutClick" id="log-out-button"
                    ><i class="fal fa-power-off"></i>Sign Out</a
                  >
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </div>
      <!-- /.c-header__topbar -->

      <nav class="c-menu c-menu--login" v-if="!showAuthenticatedNavbar">
        <ul class="c-menu__list c-menu__list--inline">
          <li class="c-menu__item">
            <a href="#/log-in" class="c-menu__link">
              <span class="c-menu__link-text">Log in</span>
            </a>
          </li>
          <li class="c-menu__item">
            <a href="#/sign-up" class="c-menu__link">
              <span class="c-menu__link-text">Sign up</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <!-- /.c-header -->

    <!-- SUB HEADER FOR PROGRAM PAGE -->
    <!-- <div class="c-subheader" v-if="isProgramPage">
      <nav class="c-menu c-menu--secondary u-jc-center">
        <ul class="c-menu__list c-menu__list--inline">
          <li class="c-menu__item c-menu__item--program-switcher" v-if="isMobile">
            <div class="u-position-relative">
              <span
                class="c-menu__text u-cursor-pointer"
                @click="toggleProgramMenu"
                v-click-outside="hideProgramMenu"
                >{{ navbarProgram.title }}</span
              >
              <CaNavbarProgramSelect v-if="showProgramMenu" />
            </div>
          </li>
          <li class="c-menu__item" :class="{ 'c-menu__item--active': isPage('Program') }">
            <router-link class="c-menu__link" :to="{ name: 'Program', params: { uuid: programUuid } }">
              <span class="c-menu__link-text">Description</span>
            </router-link>
          </li>
          <li
            class="c-menu__item"
            v-if="!userIsResearcher()"
            :class="{
              'c-menu__item--active': $route.name === 'ProgramFindings',
            }"
          >
            <router-link class="c-menu__link" :to="{ name: 'ProgramFindings', params: { uuid: programUuid } }">
              <span class="c-menu__link-text">Findings</span>
            </router-link>
          </li>
          <li
            class="c-menu__item"
            v-if="!userIsResearcher() && !userIsAppOwner()"
            :class="{ 'c-menu__item--active': isPage('ProgramSubmissions') }"
          >
            <router-link
              class="c-menu__link"
              :to="{
                name: 'ProgramSubmissions',
                params: { uuid: programUuid },
              }"
            >
              <span class="c-menu__link-text">Submissions</span>
            </router-link>
          </li>
          <li
            class="c-menu__item"
            v-if="!userIsResearcher() && !userIsAppOwner()"
            :class="{ 'c-menu__item--active': isPage('ProgramTransactions') }"
          >
            <router-link
              class="c-menu__link"
              :to="{
                name: 'ProgramTransactions',
                params: { uuid: programUuid },
              }"
            >
              <span class="c-menu__link-text">Payments</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div> -->
    <!-- /.c-subheader -->

    <!-- SUB HEADER FOR TRANSACTION PAGE -->
    <div class="c-subheader" v-if="isTransactionsPage">
      <nav class="c-menu c-menu--secondary">
        <ul class="c-menu__list c-menu__list--inline">
          <li class="c-menu__item" :class="{ 'c-menu__item--active': isPage('TransactionsPending') }">
            <router-link class="c-menu__link" :to="{ name: 'TransactionsPending' }">
              <span class="c-menu__link-text">Pending</span>
            </router-link>
          </li>
          <li
            class="c-menu__item"
            :class="{
              'c-menu__item--active': isPage('TransactionsHistorical'),
            }"
          >
            <router-link class="c-menu__link" :to="{ name: 'TransactionsHistorical' }">
              <span class="c-menu__link-text">Historical</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
    <!-- /.c-subheader -->

    <Navbar v-if="isMobile" />
  </header>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { STORE_KEY, GET_USER, GET_PROFILE, LOGOUT } from '@/stores/account/types'
import { AccountMixin } from '@/mixins/account'
import { NavbarMixin } from '@/mixins/navbar'
// import CaNavbarProgramSelect from '@/modules/core/_components/ca-navbar/CaNavbarProgramSelect'
import { NotificationsMixin } from '@/mixins/notifications'
import NotificationPanel from '@/modules/notifications/components/NotificationPanel'
import { clickOutside } from '@/directives/click-outside'
import Navbar from '@/modules/core/_components/c-navbar/Navbar'

export default {
  name: 'CaNavbar',
  props: {},
  data() {
    return {
      notificationsListVisible: false,
      showProfileMenu: false,
      showProgramMenu: false,
      isMobile: false,
    }
  },
  directives: {
    clickOutside,
  },
  mixins: [AccountMixin, NavbarMixin, NotificationsMixin],
  components: {
    NotificationPanel,
    // CaNavbarProgramsSelect,
    Navbar,
  },
  computed: {
    ...mapGetters(STORE_KEY, {
      profile: GET_PROFILE,
      user: GET_USER,
    }),
    appOwnerCheck() {
      if (!this.userIsAppOwner()) {
        return true
      }

      return this.assignedPrograms.length > 0
    },
    programUuid() {
      if (!this.$route || !this.$route.params) {
        return ''
      }
      const params = this.$route.params || ''
      return params.uuid || params.programUuid || ''
    },
    isProgramPage() {
      const programRouteNames = [
        'Program',
        'ProgramEdit',
        'ProgramEditPreview',
        'ProgramCreate',
        'ProgramSubmissions',
        'ProgramTransactions',
        'ProgramSettings',
        'ProgramFindings',
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
    showAuthenticatedNavbar() {
      const token = this.user && this.user.token ? this.user.token : ''
      return token.length > 0
    },
    active() {
      return this.user.active
    },
    userImage() {
      return this.profile && this.profile.profile_picture ? this.profile.profile_picture : '/static/images/avatar-person.svg'
    },
    userTypeDisplay() {
      if (!this.profile) {
        return ''
      }

      const userType = this.profile.user_type
      switch (userType) {
        case 'application_owner':
          return 'Application Owner'
        case 'program_manager':
          return 'Program Manager'
        case 'researcher':
          return 'Researcher'
        default:
          return ''
      }
    },
    userUsername() {
      return this.profile && this.profile.user_name ? this.profile.user_name : ''
    },
    notificationIconClass() {
      return !this.hasUnreadNotifications ? '' : 'unread'
    },
    fullName() {
      if (!this.profile || !this.profile.first_name) {
        return ''
      }
      if (!this.profile.last_name) {
        return `${this.profile.first_name}`
      }

      return `${this.profile.first_name} ${this.profile.last_name}`
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      logout: LOGOUT,
    }),
    logoutClick() {
      this.logout().then(() => {
        this.$store.dispatch('RESET_ALL_STORES')

        localStorage.clear()
        this.resetNotificationStore().then(() => {
          this.$router.push({ name: 'LogIn' })
        })
      })
    },
    isPage(str) {
      return this.$route.name === str
    },
    isMobileCheck() {
      const mql = window.matchMedia('(max-width: 1023px)')
      this.isMobile = mql.matches
    },
    pageOverlayClickHandler() {
      this.hidePageOverlay()
      this.hideSidebar()
    },
    sidebarTogglerClickHandler() {
      this.showPageOverlay()
      this.showSidebar()
    },
    hidePageOverlay() {
      this.$refs.pageOverlay.classList.remove('c-page-overlay--active')
    },
    showPageOverlay() {
      this.$refs.pageOverlay.classList.add('c-page-overlay--active')
    },
    showSidebar() {
      document.body.classList.add('c-navbar--enabled')
    },
    hideSidebar() {
      document.body.classList.remove('c-navbar--enabled')
    },
    toggleSidebar() {
      const body = document.body
      if (body.classList.contains('c-navbar--enabled')) {
        body.classList.remove('c-navbar--enabled')
      } else {
        body.classList.add('c-navbar--enabled')
      }
    },
    toggleShortSidebar() {
      const body = document.body
      if (body.classList.contains('c-navbar--short')) {
        body.classList.remove('c-navbar--short')
      } else {
        body.classList.add('c-navbar--short')
      }
    },
    // toggleProgramMenuBar() {
    //   const body = document.body
    //   if (body.classList.contains('c-subheader--enabled')) {
    //     body.classList.remove('c-subheader--enabled')
    //   } else {
    //     body.classList.add('c-subheader--enabled')
    //   }
    // },
    onBankIconClick() {
      if (this.userIsBanker() || this.userIsProgramManager()) {
        this.$router.push({
          name: 'Transactions',
        })
      }
    },
    toggleNotificationsList() {
      this.notificationsListVisible = !this.notificationsListVisible
    },
    toggleProgramMenu() {
      this.showProgramMenu = !this.showProgramMenu
    },
    hideNotificationsList() {
      this.notificationsListVisible = false
    },
    hideProgramMenu() {
      this.showProgramMenu = false
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu
    },
    hideProfileMenu() {
      this.showProfileMenu = false
    },
    copyToClipboard(text) {
      /* eslint-disable */
      // Copy to clipboard function.
      // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript

      if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData('Text', text)
      } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        var textarea = document.createElement('textarea')
        textarea.textContent = text
        textarea.style.position = 'fixed' // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy') // Security exception may be thrown by some browsers.
          this.$refs.copyIcon.setAttribute('data-title', 'Copied!')
          return
        } catch (ex) {
          console.warn('Copy to clipboard failed.', ex)
          return false
        } finally {
          document.body.removeChild(textarea)
        }
      }
    },
  },
  async mounted() {
    window.addEventListener('resize', this.isMobileCheck)
    this.isMobileCheck()
    await this.actionLoadProgramsListForNavbar()
  },
  watch: {
    $route: function () {
      this.$refs.pageOverlay.classList.remove('c-page-overlay--active')
    },
  },
}
</script>
