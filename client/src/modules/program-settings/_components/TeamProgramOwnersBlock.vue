<template>
  <div>
    <div class="c-box u-p-0">
      <div class="c-box__header">
        <div class="c-box__header__text">Team</div>
      </div>
      <!-- /.c-box__header -->
      <div class="c-box__body">
        <h6 class="u-fs-14 o-text--500 u-mb-10">Team members</h6>
        <div v-show="showProgramOwnersBlock">
          <ul class="c-media-list" v-dynamic-color>
            <li
              class="c-media-list__item u-pl-0 u-pr-0"
              v-for="(programOwner, index) in program.app_owners"
              :key="`program-owner-${index}`"
            >
              <div class="u-space-between u-ai-center u-width-full">
                <div class="c-media c-media--sm">
                  <img
                    class="c-media__img c-media__img--circle"
                    :src="programOwner.profile_picture || defaultUserImage"
                    :alt="programOwner.user_name"
                  />
                  <div class="c-media__body">
                    <div class="u-fs-12 o-text--500 u-mb-3">
                      {{ `${programOwner.first_name} ${programOwner.last_name}` }}
                    </div>
                    <div class="u-fs-12 o-text--gray">{{ `${programOwner.email}` }}</div>
                  </div>
                </div>
                <div class="l-flex u-ai-center">
                  <div
                    class="u-cursor-pointer u-mr-20"
                    data-tooltip-title="Remove User"
                    @click.stop="onRemove(programOwner)"
                  >
                    <i class="fal fa-trash-alt u-fs-18 o-text--gray"></i>
                  </div>
                  <!-- TODO: user management -->
                  <!-- <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
                    <div
                      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
                      tabindex="0"
                      :class="[{ 'is-open': expanded }]"
                      @click="toggleDropdownMenu"
                    >
                      <span>Can View</span>
                    </div>
                    <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
                      <li class="u-text-center">
                        <span>Can View</span>
                      </li>
                      <li class="u-text-center">
                        <span>Can Edit</span>
                      </li>
                    </ul>
                  </div> -->
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-show="program.pending_invites && program.pending_invites.length > 0">
          <ul class="c-media-list c-media-list--pending" v-dynamic-color>
            <li
              class="c-media-list__item u-pl-0 u-pr-0"
              v-for="(invite, index) in program.pending_invites"
              :key="`pending-invite-${index}`"
            >
              <div class="u-space-between u-ai-center u-width-full">
                <div class="c-media c-media--sm">
                  <img class="c-media__img c-media__img--circle" :src="defaultUserImage" :alt="invite.email" />
                  <div class="c-media__body">
                    <div class="u-fs-12 o-text--500 u-mb-3">
                      {{ invite.email }}
                    </div>
                    <div class="u-fs-12 o-text--gray">
                      Invitation sent
                      {{ invite.date_modified | elapsedTime(now) }}
                    </div>
                  </div>
                </div>
                <div class="l-flex u-ai-center">
                  <div class="u-cursor-pointer u-mr-20">
                    <a class="o-text--500" @click="cancelInvitation(invite.email)">Cancel Invite</a>
                  </div>
                  <!-- <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
                    <div
                      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
                      tabindex="0"
                      :class="[{ 'is-open': expanded }]"
                      @click="toggleDropdownMenu"
                    >
                      <span>Can View</span>
                    </div>
                    <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
                      <li class="u-text-center">
                        <span>Can View</span>
                      </li>
                      <li class="u-text-center">
                        <span>Can Edit</span>
                      </li>
                    </ul>
                  </div> -->
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="u-mt-20">
          <h6 class="u-fs-14">Invite members</h6>
          <div class="c-form__group">
            <div class="u-position-relative">
              <CaTagTextInput
                :placeholder="'Type a name or email'"
                :text-value="searchText"
                :tags="pendingInvites"
                :text-input-style="textInputStyle"
                @on-tag-click="onTagClick"
                @on-text-input="onSearchTextInput"
                @on-text-input-click="onSearchTextInputClick"
                @on-text-input-enter-key-down="onSearchTextInputEnterKeyDown"
              />
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
        :disabled="pendingInvites.length === 0"
      >
        Send Invite
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
  name: 'TeamProgramOwnersBlock',
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
    pendingInvites: {
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
    addPendingInviteFromUser(user) {
      const tag = {
        id: user.uuid,
        text: `${user.first_name} ${user.last_name}`,
        loading: false,
      }
      this.$emit('on-add-pending-invite', tag)
    },
    addPendingInviteFromEmail(email) {
      const tag = { id: email, text: email, loading: false }
      this.$emit('on-add-pending-invite', tag)
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

      this.addPendingInviteFromUser(this.searchResults[0])
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
    teamMemberAction(action, teamMember) {
      const data = {
        action,
        teamMember,
        programUuid: this.program.uuid,
        userType: 'application_owner',
      }
      this.$emit('on-team-member-action', data)
    },
    resendInvitation(invite) {
      this.$emit('on-resend-invitation-click', invite)
    },
    cancelInvitation(email) {
      this.$emit('on-cancel-invitation-click', email)
    },
    onRemove(teamMember) {
      // show confirm modal
      this.$caDialog.confirm({
        id: 'remove-user',
        title: 'Remove Team Member',
        text: `Are you sure you want to remove ${teamMember.first_name} ${teamMember.last_name || ''} from ${
          this.program.title
        }`,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Remove',
        hasCancelButton: true,
        confirmCallback: () => {
          this.teamMemberAction('remove', teamMember)
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
    showProgramOwnersBlock() {
      return this.program.app_owners && this.program.app_owners.length > 0
    },
    existingProgramOwnerUuids() {
      return this.program.app_owners.map((x) => x.uuid)
    },
    filteredSearchResults() {
      return this.searchResults.filter((x) => !this.existingProgramOwnerUuids.includes(x.uuid) && !this.tag)
    },
    textInputStyle() {
      if (this.loading || !this.pendingInvites || this.pendingInvites.length > 0) {
        return {}
      }

      return { width: '100%' }
    },
  },
}
</script>
