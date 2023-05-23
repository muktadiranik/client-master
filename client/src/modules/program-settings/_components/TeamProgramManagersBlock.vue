<template>
  <div class="c-box u-mt-20">
    <div class="c-box__header">
      <h6 class="o-h6">Program Managers</h6>
    </div>
    <div class="c-box__body">
      <ul class="c-media-list c-media-list--bordered u-mb-20" v-show="showProgramManagersBlock" v-dynamic-color>
        <li
          class="c-media-list__item"
          v-for="(programManager, index) in program.program_managers"
          :key="`program-manager-${index}`"
        >
          <div class="u-space-between u-ai-center u-width-full">
            <div class="c-media c-media--sm">
              <img
                class="c-media__img c-media__img--circle"
                :src="programManager.profile_picture || defaultUserImage"
                :alt="programManager.user_name"
              />
              <div class="c-media__body">
                <div>
                  {{ `${programManager.first_name} ${programManager.last_name}` }}
                </div>
                <div>{{ `${programManager.email}` }}</div>
              </div>
            </div>
            <div
              class="u-cursor-pointer"
              data-tooltip-title="Remove User"
              v-show="userIsProgramManager()"
              @click="teamMemberAction('remove', programManager)"
            >
              <i class="fal fa-times-circle"></i>
            </div>
          </div>
        </li>
      </ul>
      <div v-show="userIsProgramManager()">
        <h6 class="o-h6 u-mb-10">Add Program Managers</h6>
        <div class="u-position-relative">
          <input
            type="text"
            placeholder="Type a name or email address..."
            :value="searchText"
            @input="onSearchTextInput($event.target.value)"
            @click="onSearchTextInputClick"
            class="o-input"
          />
          <div
            class="c-popover c-popover--no-arrow"
            v-show="searchResultsVisible"
            v-click-outside="onClickOutsideSearchResults"
          >
            <div class="c-popover__header u-text-center u-pl-15 u-pr-15">
              <h6 class="o-h6 u-single-line">Send invitation to...</h6>
            </div>
            <div class="c-popover__body u-p-15">
              <ul class="c-media-list c-media-list--bordered" v-if="filteredSearchResults.length > 0">
                <li
                  class="c-media-list__item"
                  v-for="(programManager, index) in filteredSearchResults"
                  :key="`pm-search-result-${index}`"
                  @click="teamMemberAction('add', programManager)"
                >
                  <div class="c-media c-media--sm">
                    <img
                      class="c-media__img c-media__img--circle"
                      :src="programManager.profile_picture || defaultUserImage"
                      :alt="programManager.user_name"
                    />
                    <div class="c-media__body">
                      <div>
                        {{ `${programManager.first_name} ${programManager.last_name} ${programManager.email}` }}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="u-text-center" v-show="filteredSearchResults.length === 0">
                No results found!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { clickOutside } from '@/directives/click-outside'
import { dynamicColor } from '@/directives/dynamic-color'

export default {
  name: 'TeamProgramManagersBlock',
  directives: {
    clickOutside,
    dynamicColor,
  },
  mixins: [AccountMixin],
  props: {
    program: {
      type: Object,
      // eslint-disable-next-line camelcase
      default: () => {},
      required: true,
    },
    searchText: {
      type: String,
      default: '',
      required: true,
    },
    searchResults: {
      type: Array,
      default: () => [],
      required: true,
    },
    searchResultsVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      defaultUserImage: DEFAULT_USER_IMAGE,
    }
  },
  methods: {
    onSearchTextInput(val) {
      this.$emit('on-search-text-input', val)
    },
    onSearchTextInputClick() {
      this.$emit('on-search-text-input-clicked')
    },
    onClickOutsideSearchResults() {
      this.$emit('on-click-outside-search-results')
    },
    teamMemberAction(action, teamMember) {
      const data = {
        action,
        teamMember,
        programUuid: this.program.uuid,
        userType: 'program_manager',
      }
      this.$emit('on-team-member-action', data)
    },
  },
  computed: {
    showProgramManagersBlock() {
      return this.program.program_managers && this.program.program_managers.length > 0
    },
    existingProgramManagerUuids() {
      return this.program.program_managers.map(x => x.uuid)
    },
    filteredSearchResults() {
      return this.searchResults.filter(x => !this.existingProgramManagerUuids.includes(x.uuid))
    },
  },
}
</script>
