<template>
  <div class="c-submenu-container u-display-if" v-click-outside="hideProgramSettingsSubmenu">
    <button
      class="u-ml-15 o-btn o-btn--lightgray o-btn--rounded o-btn--sm"
      :class="{ 'is-open': showProgramSettingsSubmenu }"
      @click="toggleMenu"
      v-if="showEditButton"
    >
      <div class="l-flex u-ai-center" v-if="userIsProgramManager()">
        <i class="program-details-icon fal fa-sliders-h o-btn--icon-sm"></i> <span>Settings</span>
      </div>
    </button>
    <transition name="submenu">
      <ul
        class="c-submenu c-submenu--md c-submenu--right u-text-left c-submenu--fw-400 u-br-4"
        v-show="showProgramSettingsSubmenu"
      >
        <li class="c-submenu__item" v-if="userIsProgramManager()">
          <router-link
            class="c-submenu__link"
            :to="{
              name: 'ProgramEdit',
              params: { uuid: this.$route.params.uuid },
            }"
          >
            <i class="fal fa-pen"></i>
            <span class="c-submenu__link-text">Edit Description</span>
          </router-link>
        </li>
        <li class="c-submenu__item" v-if="userIsProgramManager()">
          <span class="c-submenu__link">
            <i class="fal fa-eye"></i>
            <span class="c-submenu__link-text">Active Program</span>
            <label class="c-switch c-switch--xsm">
              <input
                type="checkbox"
                ref="activateProgramCheckbox"
                @change="activateProgramSwitchOnChange"
                :checked="programIsActive"
                :disabled="programSettingsLoading"
              />
              <span class="c-switch__slider"></span>
            </label>
          </span>
        </li>
        <li class="c-submenu__item" v-if="userIsProgramManager()">
          <span class="c-submenu__link">
            <i class="fal fa-lock-alt"></i>
            <span class="c-submenu__link-text">Private Program</span>
            <label class="c-switch c-switch--xsm">
              <input
                type="checkbox"
                ref="privateProgramCheckbox"
                @change="toggleVisibilitySwitchOnChange"
                :checked="programIsPrivate"
                :disabled="programSettingsLoading"
              />
              <span class="c-switch__slider"></span>
            </label>
          </span>
        </li>
        <!-- Frozen program -->
        <li class="c-submenu__item" v-if="userIsProgramManager()">
          <span class="c-submenu__link">
            <i class="fal fa-snowflake"></i>
            <span class="c-submenu__link-text">Frozen Program</span>
            <label class="c-switch c-switch--xsm">
              <input
                type="checkbox"
                ref="frozenProgramCheckbox"
                @change="toggleFrozenProgram"
                :checked="programIsFrozen"
                :disabled="programSettingsLoading"
              />
              <span class="c-switch__slider"></span>
            </label>
          </span>
        </li>
        <li class="c-submenu__item" v-if="userIsProgramManager()">
          <router-link
            class="c-submenu__link"
            :to="{
              name: 'ProgramSettingsSubmissionTemplate',
              params: { uuid: this.$route.params.uuid },
            }"
          >
            <i class="fal fa-file"></i>
            <span class="c-submenu__link-text">Submission Template</span>
          </router-link>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import { STORE_KEY as ACCOUNT_STORE_KEY, LOAD_PROFILE } from '@/stores/account/types'

import { AccountMixin } from '@/mixins/account'
import { NavbarMixin } from '@/mixins/navbar'
import { clickOutside } from '@/directives/click-outside'
import { ProgramSettingsMixin } from '@/modules/programs/_mixins/program-settings-mixin'

export default {
  name: 'ProgramSettingsMenu',
  mixins: [AccountMixin, NavbarMixin, ProgramSettingsMixin],
  data() {
    return {
      showProgramSettingsSubmenu: false,
    }
  },
  props: {
    program: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  directives: {
    clickOutside,
  },
  computed: {
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
    async activateProgramSwitchOnChange() {
      await this.onActiveProgramToggle()
    },
    toggleVisibilitySwitchOnChange() {
      this.onVisibilityToggle()
    },
    async toggleFrozenProgram() {
      try {
        const res = await this.toggleFreeze(this.program.uuid)
        this.$caAlert.success(`This program is now <b>${res.data.frozen ? 'frozen' : 'unfrozen'}</b>`)
      } catch (error) {
        this.$caAlert.error('Error updating Program frozen status')
      }
    },
    toggleMenu() {
      this.showProgramSettingsSubmenu = !this.showProgramSettingsSubmenu
    },
    hideProgramSettingsSubmenu() {
      this.showProgramSettingsSubmenu = false
    },
    setProgram(program) {
      this.$emit('on-set-program', program)
    },
  },
  async mounted() {},
}
</script>
