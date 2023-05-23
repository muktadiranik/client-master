<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20" v-show="program && program.uuid">
      <div class="l-wrap">
        <router-link :to="{ name: 'Programs' }">
          <button class="u-ml--16 u-mb-10 o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center">
            <i class="fal fa-arrow-left o-btn--icon-sm"></i>
            Back
          </button>
        </router-link>
        <div class="l-flex u-ai-center u-jc-sb">
          <div class="c-media c-media--sm u-mb-20">
            <div class="c-media__img c-media__img--circle">
              <img :src="programImage" :alt="programTitle" />
            </div>
            <div class="l-flex u-ai-base">
              <div class="c-media__body u-overflow-hidden">
                <h6 class="u-fs-22 u-single-line u-mb-8" v-if="program">{{ programTitle }}</h6>
                <div class="u-fs-12 u-text-italic" v-if="companyName">{{ companyName }}</div>
              </div>
              <div class="c-program-bar__status" v-if="program.status !== 'Active'">
                <span class="c-badge c-badge--program-status">
                  <i class="fal fa-lock-alt u-mr-5"></i>
                  {{ program.status }}
                </span>
              </div>
              <ProgramFavoriteButton
                :program-uuid="program.uuid"
                v-if="this.userIsProgramManager() || this.userIsResearcher()"
              />
            </div>
          </div>

          <program-settings-menu :program="program" />
          <button
            class="o-btn o-btn--primary o-btn--sm o-btn--rounded-sm o-btn--nowrap"
            @click="createSubmissionClick"
            v-if="showAddSubmissionButton"
          >
            Submit Report
          </button>
        </div>

        <!-- TAB NAVIGATION -->
        <nav class="c-tab-nav u-mb-20">
          <ul class="c-tab-nav__list">
            <li @click="currentTab = 'description'" :class="{ 'is-active': currentTab === 'description' }">
              <span>Description</span>
            </li>
            <li
              v-if="!userIsResearcher()"
              @click="currentTab = 'users'"
              :class="{ 'is-active': currentTab === 'users' }"
            >
              <span>Users</span>
            </li>
            <li
              v-if="userIsProgramManager() && this.program.private"
              @click="currentTab = 'researchers'"
              :class="{ 'is-active': currentTab === 'researchers' }"
            >
              <span>Researchers</span>
            </li>
            <li
              v-if="!userIsResearcher()"
              @click="currentTab = 'integrations'"
              :class="{ 'is-active': currentTab === 'integrations' }"
            >
              <span>Integrations</span>
            </li>
          </ul>
        </nav>

        <article
          v-show="currentTab === 'description'"
          :class="{ 'l-program-details': !userIsAppOwner() }"
          class="u-mt-20"
        >
          <!-- CONTENT -->
          <div class="c-box">
            <div class="c-box__header">
              <div class="c-box__header__text">Description</div>
            </div>
            <div class="c-box__body">
              <div class="c-markdown-content">
                <vue-markdown v-if="program && program.details" :source="program.details"></vue-markdown>
              </div>
            </div>
          </div>

          <!-- ASIDE -->
          <aside v-if="!userIsAppOwner()" class="u-order-1-below-768">
            <div class="c-box u-mb-20">
              <div class="c-box__header">
                <h6 class="c-box__header__text">Payout</h6>
              </div>
              <div class="c-box__body" v-if="program && program.payout_display">
                <table class="o-table--payout u-text-left">
                  <thead>
                    <tr>
                      <th>Severity</th>
                      <th>Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span class="c-badge u-mr-15 c-badge--severity-critical">Critical</span>
                      </td>
                      <td>
                        <span class="o-text--dark">{{ program.payout_display.critical }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="c-badge u-mr-15 c-badge--severity-high">High</span>
                      </td>
                      <td>
                        <span class="o-text--dark">{{ program.payout_display.high }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="c-badge u-mr-15 c-badge--severity-medium">Medium</span>
                      </td>
                      <td>
                        <span class="o-text--dark">{{ program.payout_display.medium }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="c-badge u-mr-15 c-badge--severity-low">Low</span>
                      </td>
                      <td>
                        <span class="o-text--dark">{{ program.payout_display.low }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="c-badge u-mr-15 c-badge--severity-info">Info</span>
                      </td>
                      <td>
                        <span class="o-text--dark">{{ program.payout_display.informational }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- /.c-box -->
            <div class="c-box">
              <div class="c-box__header">
                <h6 class="c-box__header__text">Hall of Fame</h6>
              </div>
              <div class="c-box__body">
                <ul class="c-media-list c-media-list--spaced">
                  <li v-for="(entry, index) in hof" :key="`entry-${index}`">
                    <div class="c-media c-media--sm">
                      <img
                        :src="entry.photo || defaultUserImage"
                        :alt="entry.username"
                        class="c-media__img c-media__img--circle"
                      />
                      <div class="c-media__body">
                        <p>
                          <span class="u-fs-12 o-text--dark o-text--500">{{ entry.username }}</span>
                          <small class="u-d-b u-fs-10 o-text--gray u-mt-2">{{ entry.category }}</small>
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- /.c-box -->
          </aside>
        </article>

        <article class="u-width-50" v-show="currentTab === 'users'" v-if="!userIsResearcher()">
          <program-settings-team />
        </article>

        <article
          class="u-width-50"
          v-show="currentTab === 'researchers'"
          v-if="userIsProgramManager() && this.program.private"
        >
          <program-settings-researchers />
        </article>

        <article class="u-width-50" v-show="currentTab === 'integrations'" v-if="!userIsResearcher()">
          <program-settings-integrations />
        </article>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapActions } from 'vuex'
import { STORE_KEY, GET_PROGRAM, TOGGLE_FOLLOWING } from '@/modules/programs/_store/types'
import { STORE_KEY as ACCOUNT_STORE_KEY, LOAD_PROFILE } from '@/stores/account/types'
import store from '@/modules/programs/_store'
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { NavbarMixin } from '@/mixins/navbar'
import { clickOutside } from '@/directives/click-outside'
import ProgramSettingsTeam from '../../program-settings/_pages/ProgramSettingsTeam.vue'
import ProgramSettingsResearchers from '../../program-settings/_pages/ProgramSettingsResearchers.vue'
import ProgramSettingsIntegrations from '../../program-settings/_pages/ProgramSettingsIntegrations.vue'
import ProgramFavoriteButton from '../_components/ProgramFavoriteButton'
import ProgramSettingsMenu from '../_components/ProgramSettingsMenu.vue'
export default {
  name: 'ProgramDetails',
  components: {
    VueMarkdown,
    ProgramSettingsTeam,
    ProgramSettingsIntegrations,
    ProgramFavoriteButton,
    ProgramSettingsMenu,
    ProgramSettingsResearchers,
  },
  mixins: [AccountMixin, BreadcrumbsMixin, NavbarMixin],
  data() {
    return {
      defaultUserImage: DEFAULT_USER_IMAGE,
      program: {},
      currentTab: 'description',
    }
  },
  directives: {
    clickOutside,
  },
  computed: {
    hof() {
      if (!this.program || !this.program.hall_of_fame) {
        return null
      }
      return this.program.hall_of_fame.filter(x => !!x.username)
    },
    programBackdropTextStyle() {
      if (!this.program || !this.program.color) {
        return ''
      }
      const bgColor = this.program.color.replace('#', '')
      const r = parseInt(bgColor.substr(0, 2), 16)
      const g = parseInt(bgColor.substr(2, 2), 16)
      const b = parseInt(bgColor.substr(4, 2), 16)
      const lightness = r * 299 + g * 587 + (b * 114) / 1000
      const color = lightness >= 128 ? '#000' : '#fff'
      return `color: ${color} !important`
    },

    companyNameTextStyle() {
      if (!this.program || !this.program.color) {
        return ''
      }
      const bgColor = this.program.color.replace('#', '')
      const r = parseInt(bgColor.substr(0, 2), 16)
      const g = parseInt(bgColor.substr(2, 2), 16)
      const b = parseInt(bgColor.substr(4, 2), 16)
      const lightness = r * 299 + g * 587 + (b * 114) / 1000
      const color = lightness >= 128 ? '#666' : '#f9f9f9'
      return `color: ${color} !important`
    },
    backdropStyle() {
      if (!this.program || !this.program.color) {
        return {}
      }

      return { backgroundColor: this.program.color }
    },
    programTitle() {
      return this.program && this.program.title ? this.program.title : ''
    },
    companyName() {
      return this.program && this.program.company_name ? this.program.company_name : ''
    },
    programImage() {
      return this.program && this.program.image ? this.program.image : DEFAULT_PROGRAM_IMAGE
    },
    showAddSubmissionButton() {
      if (!this.program) {
        return false
      }

      return !this.program.frozen && this.userIsResearcher()
    },
    showEditButton() {
      if (this.userIsProgramManager()) {
        return true
      }

      const assignedToProgram = this.isAssignedToProgram(this.$route.params.uuid)
      return this.userIsAppOwner() && assignedToProgram
    },
    showFollowButton() {
      return this.userIsResearcher()
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      getProgram: GET_PROGRAM,
      toggleFollowing: TOGGLE_FOLLOWING,
    }),
    async loadProgram() {
      this.$solar.show()
      try {
        const response = await this.getProgram(this.$route.params.uuid)
        this.program = response.data
      } catch (e) {
        this.$caAlert.error(e.data.error || 'Failed to load program')
      } finally {
        this.$solar.hide()
      }
    },
    async followClick(event) {
      const iconEl = event.target.querySelector('i')
      if (iconEl.classList.contains('far')) {
        iconEl.classList.replace('far', 'fas')
      } else {
        iconEl.classList.replace('fas', 'far')
      }
      this.$solar.show()
      try {
        const response = await this.toggleFollowing(this.$route.params.uuid)
        this.program = response.data

        await this.$store.dispatch(`${ACCOUNT_STORE_KEY}/${LOAD_PROFILE}`)
      } catch (e) {
        this.$caAlert.error('Failed to update following preference.')
      } finally {
        this.$solar.hide()
      }
    },
    createSubmissionClick() {
      this.$router.push({
        name: 'SubmissionCreate',
        uuid: this.$route.params.uuid,
      })
    },
    editClick() {
      this.$router.push({
        name: 'ProgramEdit',
        uuid: this.$route.params.uuid,
      })
    },
    onSetProgram(program) {
      this.program = program
    },
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }

    await this.loadProgram()
    await this.actionLoadProgramForNavbar(this.program)
    document.title = `Inspectiv | ${this.program.title}`
    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Programs' }).route,
      },
      child: {
        title: this.program.title,
        route: this.$route,
        copyValue: this.program.uuid,
      },
    })
  },
}
</script>
