<template>
  <div class="c-box" v-if="userIsProgramManager()">
    <div class="c-box__header">
      <h6 class="o-h6">
        <span>Program Visibility:</span>
        <span class="u-color-primary" :class="programVisibility">{{ programVisibility }}</span>
      </h6>
    </div>
    <!-- /.c-box__header -->
    <div class="c-box__body">
      <p>
        Choose whether this program is visible to all researchers, or visible to only a specific list of researchers.
      </p>
      <div class="u-mt-20">
        <ul class="c-btn-group c-btn-group--sm">
          <li
            class="c-btn-group__btn c-btn-group__btn--long"
            :class="{ 'is-active': !program.private }"
            @click="toggleVisibilityClick"
          >
            Public
          </li>
          <li
            class="c-btn-group__btn c-btn-group__btn--long"
            :class="{ 'is-active': program.private }"
            @click="toggleVisibilityClick"
          >
            Private
          </li>
        </ul>
      </div>
    </div>
    <!-- /.c-box__body -->
    <div v-if="program.private">
      <div class="c-box__body u-pt-0" v-if="program.invited && program.invited.length > 0">
        <h6 class="o-h6 u-mb-20">Security Researchers</h6>
        <ul class="c-media-list c-media-list--bordered" v-dynamic-color>
          <li
            class="c-media-list__item"
            v-for="(researcher, index) in program.invited"
            :key="`researcher-invited-${index}`"
          >
            <div class="u-space-between u-ai-center u-width-full">
              <div class="c-media c-media--sm">
                <img
                  class="c-media__img c-media__img--circle"
                  :src="researcher.profile_picture || defaultProfileImage"
                  :alt="researcher.user_name"
                />
                <div class="c-media__body">
                  <div>{{ researcher.user_name }}</div>
                </div>
              </div>
              <div
                class="u-cursor-pointer"
                data-tooltip-title="Remove User"
                @click="onResearcherAction({ researcher: researcher, action: 'remove' })"
              >
                <i class="fal fa-times-circle"></i>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- /.c-box__body -->
      <div class="c-box__body u-pt-0" v-click-outside="hideDropdown" v-dynamic-color>
        <h6 class="o-h6">Invite Security Researchers</h6>
        <div class="u-position-relative u-mt-20">
          <div class="c-clear-input">
            <input
              type="text"
              placeholder="Type a name or email address..."
              class="o-input"
              :value="researcherSearchText"
              @input="onResearcherSearchTextInput($event.target.value)"
              @click="onResearcherSearchInputClick"
            />
            <i class="fal fa-times-circle c-clear-input__icon" @click="clearSearch" v-show="showClearIcon"></i>
          </div>
          <div class="c-popover c-popover--no-arrow" v-show="researcherSearchText && searchResultsVisible">
            <div class="c-popover__header u-text-center">
              <h6 class="o-h6 u-single-line">Security Researchers</h6>
            </div>
            <!-- /.c-popover__header -->
            <div class="c-popover__body u-p-0">
              <ul class="c-media-list c-media-list--font-sm c-media-list--smushed u-mt-10 u-mb-10">
                <li
                  class="c-media-list__item"
                  v-for="(researcher, index) in researcherSearchResults"
                  :key="`researcher-result-${index}`"
                  @click="onResearcherAction({ researcher: researcher, action: 'add' })"
                >
                  <div class="c-media c-media--sm">
                    <img
                      class="c-media__img c-media__img--circle"
                      :src="researcher.profile_picture || defaultProfileImage"
                      :alt="researcher.user_name"
                    />
                    <div class="c-media__body">
                      <div>{{ researcher.user_name }}</div>
                    </div>
                  </div>
                </li>
                <li class="u-text-center u-p-15" v-if="researcherSearchResults.length === 0">
                  <span>No researchers found!</span>
                </li>
              </ul>
            </div>
            <!-- /.c-popover__body -->
          </div>
          <!-- /.c-popover -->
        </div>
      </div>
      <!-- /.c-box__body -->
    </div>
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { dynamicColor } from '@/directives/dynamic-color'
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'ProgramVisibilityBlock',
  directives: {
    clickOutside,
    dynamicColor,
  },
  mixins: [AccountMixin],
  props: {
    program: {
      type: Object,
      default: () => {},
      required: true,
    },
    researcherSearchText: {
      type: String,
      default: '',
      required: true,
    },
    researcherSearchResults: {
      type: Array,
      default: () => [],
      required: true,
    },
    programActionsDisabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      searchResultsVisible: false,
    }
  },
  computed: {
    programVisibility() {
      return this.program.private ? 'Private' : 'Public'
    },
    defaultProfileImage() {
      return DEFAULT_USER_IMAGE
    },
    showClearIcon() {
      return this.researcherSearchText && this.researcherSearchText.length > 0
    },
  },
  methods: {
    toggleVisibilityClick() {
      if (this.programActionsDisabled) {
        return
      }
      this.$emit('on-toggle-visibility')
    },
    onResearcherSearchTextInput(value) {
      this.$emit('on-researcher-search-text-input', value)
    },
    onResearcherAction(data) {
      this.$emit('on-researcher-action', {
        researcher: data.researcher,
        action: data.action,
      })
    },
    clearSearch() {
      this.$emit('on-researcher-search-text-input', '')
    },
    hideDropdown() {
      this.searchResultsVisible = false
    },
    onResearcherSearchInputClick() {
      this.searchResultsVisible = this.researcherSearchText && this.researcherSearchText.length > 0
    },
  },
  watch: {
    researcherSearchText(newVal, oldVal) {
      this.searchResultsVisible = newVal && newVal.length > 0
    },
  },
}
</script>
