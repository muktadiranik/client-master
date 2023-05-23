<template>
  <div>
    <div class="c-box u-p-0">
      <div class="c-box__header">
        <div class="c-box__header__text">Researchers</div>
      </div>
      <!-- /.c-box__header -->
      <div class="c-box__body">
        <h6 class="u-fs-14 o-text--500 u-mb-10">Researchers</h6>
        <div v-show="showResearchersBlock">
          <ul class="c-media-list" v-dynamic-color>
            <li
              class="c-media-list__item u-pl-0 u-pr-0"
              v-for="(researcher, index) in program.invited"
              :key="`invited-researcher-${index}`"
            >
              <div class="u-space-between u-ai-center u-width-full">
                <div class="c-media c-media--sm">
                  <img
                    class="c-media__img c-media__img--circle"
                    :src="researcher.profile_picture || defaultUserImage"
                    :alt="researcher.user_name"
                  />
                  <div class="c-media__body">
                    <div class="u-fs-12 o-text--500 u-mb-3">
                      {{ researcher.user_name }}
                    </div>
                    <div class="u-fs-12 o-text--gray">{{ `${researcher.email}` }}</div>
                  </div>
                </div>
                <div class="l-flex u-ai-center">
                  <div
                    class="u-cursor-pointer u-mr-20"
                    data-tooltip-title="Remove User"
                    @click.stop="onRemove(researcher)"
                  >
                    <i class="fal fa-trash-alt u-fs-18 o-text--gray"></i>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="u-mt-20">
          <h6 class="u-fs-14">Invite researchers</h6>
          <div class="c-form__group">
            <div class="u-position-relative">
              <CaTagTextInput
                :placeholder="'Type a name or email'"
                :text-value="searchText"
                :tags="researchersSelected"
                :text-input-style="textInputStyle"
                @on-tag-click="onTagClick"
                @on-text-input="onSearchTextInput"
                @on-text-input-click="onSearchTextInputClick"
                @on-text-input-enter-key-down="onSearchTextInputEnterKeyDown"
              />
              <div
                class="c-popover c-popover--no-arrow"
                v-show="searchResultsVisible"
                v-click-outside="onClickOutsideSearchResults"
              >
                <div class="c-popover__header u-pl-15 u-pr-15 u-text-center">
                  <h6 class="u-fs-12">Send invitation to...</h6>
                </div>
                <div class="c-popover__body u-p-15">
                  <ul
                    class="c-media-list c-media-list--bordered"
                    v-show="filteredSearchResults && filteredSearchResults.length > 0"
                  >
                    <li
                      class="c-media-list__item"
                      v-for="(researcher, index) in filteredSearchResults"
                      :key="`po-search-result-${index}`"
                      @click="addResearcherToPending(researcher)"
                    >
                      <div class="c-media c-media--sm">
                        <img
                          class="c-media__img c-media__img--circle"
                          :src="researcher.profile_picture || defaultUserImage"
                          :alt="researcher.user_name"
                        />
                        <div class="c-media__body">
                          <div>
                            {{ `${researcher.user_name} ${researcher.email}` }}
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class="u-text-center" v-if="filteredSearchResults.length === 0">
                    <span>No results found!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /.c-box__body -->
    </div>
    <div class="u-mt-24">
      <button
        type="button"
        class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm"
        v-dynamic-color
        @click="sendInvites"
      >
        Send Invites
      </button>
    </div>
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { clickOutside } from '@/directives/click-outside'
import { dynamicColor } from '@/directives/dynamic-color'
import CaTagTextInput from '@/plugins/ca-elements/components/CaTagTextInput'
import validators from '@/mixins/validators'
import DateTimeFilters from '@/filters/date-time-filters'

export default {
  name: 'InviteResearchersBlock',
  components: {
    CaTagTextInput,
  },
  directives: { clickOutside, dynamicColor },
  filters: DateTimeFilters,
  mixins: [AccountMixin, validators],
  props: {
    program: {
      type: Object,
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
    researchersSelected: {
      type: Array,
      default: () => [],
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
      now: new Date(),
      expanded: false,
    }
  },
  methods: {
    hideDropdownMenu() {
      this.expanded = false
    },
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    addResearcherToPending(user) {
      const tag = {
        id: user.uuid,
        text: user.user_name,
        loading: false,
      }
      this.$emit('on-select-researcher-to-add', tag)
    },
    addPendingInviteFromEmail(email) {
      const tag = { id: email, text: email, loading: false }
      this.$emit('on-select-researcher-to-add', tag)
    },
    onSearchTextInput(val) {
      this.$emit('on-search-text-input', val)
    },
    onSearchTextInputClick() {
      this.$emit('on-search-text-input-clicked')
    },
    onSearchTextInputEnterKeyDown() {
      if (!this.searchText) {
        return
      }

      if (this.emailIsValid(this.searchText) && this.searchResults.length < 1) {
        this.addPendingInviteFromEmail(this.searchText)
        return
      }

      if (!this.searchResults || this.searchResults.length !== 1) {
        return
      }

      this.addResearcherToPending(this.searchResults[0])
    },
    onClickOutsideSearchResults() {
      this.$emit('on-click-outside-search-results')
    },
    onTagClick(tag) {
      this.$emit('on-tag-click', tag)
    },
    sendInvites() {
      if (this.loading) {
        return
      }

      this.$emit('on-send-invites-click')
    },
    researcherAction(action, researcher) {
      const data = {
        action,
        researcher,
        programUuid: this.program.uuid,
        userType: 'researcher',
      }
      this.$emit('on-researcher-action', data)
    },
    onRemove(researcher) {
      // show confirm modal
      this.$caDialog.confirm({
        id: 'remove-user',
        title: 'Remove Researcher',
        text: `Are you sure you want to remove ${researcher.user_name} from ${this.program.title}`,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Remove',
        hasCancelButton: true,
        confirmCallback: () => {
          this.researcherAction('remove', researcher)
          this.$caDialog.close('remove-user')
        },
        cancelCallback: () => {
          this.$caDialog.close('remove-user')
        },
      })
    },
  },
  computed: {
    dropdownMenuFooterClass() {
      return {
        invalid: this.emailIsValid(this.searchText),
      }
    },
    dropdownMenuFooterStyle() {
      return this.filteredSearchResults.length === 0 ? 'border-top: 0;' : ''
    },
    showResearchersBlock() {
      return this.program.invited && this.program.invited.length > 0
    },
    existingResearcherUuids() {
      return this.program.invited.map(x => x.uuid)
    },
    filteredSearchResults() {
      return this.searchResults.filter(x => !this.existingResearcherUuids.includes(x.uuid) && !this.tag)
    },
    textInputStyle() {
      if (this.loading || !this.researchersSelected || this.researchersSelected.length > 0) {
        return {}
      }

      return { width: '100%' }
    },
  },
}
</script>
