<template>
  <div class="report-icon-menu submission-report-icon-menu">
    <ul>
      <li
        class="hasDropdown"
        :class="{ hasTooltip: !submissionIsComplete && !createFindingEnabled }"
        v-click-outside="closeFindingMenu"
        v-if="userIsProgramManager()"
        :data-title="'Complete this submission before creating or linking a finding.'"
      >
        <i :class="shieldIconClass" @click="toggleFindingMenu"></i>
        <div class="dropdownMenu center width-365" v-show="findingMenuExpanded">
          <div class="dropdownMenuHeader">
            <h4 class="title">Finding</h4>
          </div>
          <div class="dropdownMenuBody u-p-0">
            <div class="finding-dropdown-content none-linked" v-show="!submissionHasFinding && !searchMode">
              <p>There is no finding linked to the submission.</p>
              <div class="buttons">
                <button
                  class="button programManager block"
                  @click="createFindingFromSubmission"
                  :disabled="!createFindingEnabled"
                >
                  Create Finding
                </button>
                <button class="button outline block" @click="enableSearchMode">Search for Existing Finding</button>
              </div>
            </div>
            <div class="finding-dropdown-content linked-finding" v-show="submissionHasFinding">
              <ul>
                <li v-for="(finding, index) in submission.findings" :key="`submission-finding-${index}`">
                  <div class="finding" @click="linkedFindingClick">
                    <h4 class="finding__title">{{ finding.title }}</h4>
                    <div class="finding__id" v-show="finding.public_id">{{ finding.public_id }}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="finding-dropdown-content search-mode" v-show="searchMode && !submissionHasFinding">
              <form class="form">
                <div class="input-wrapper before clearable">
                  <input
                    type="text"
                    class="form__control"
                    placeholder="Search to link finding..."
                    :value="searchTerms"
                    @input="onSearchSubmit($event.target.value)"
                  />
                  <i class="fal fa-times-circle clear-input" @click="clearSearchTerms" v-show="searchTerms"></i>
                </div>
              </form>
              <div class="search-results" v-show="searchMode">
                <div class="radio-list">
                  <div
                    class="radio"
                    v-for="(finding, index) in searchResults"
                    :key="`finding-result-${index}`"
                    @click="setSelectedFindingUuid(finding.uuid)"
                  >
                    <input
                      type="radio"
                      class="hidden"
                      name="`finding-result-${index}`"
                      :id="`finding-result-${index}`"
                    />
                    <label :for="`finding-result-${index}`">
                      <div class="title">{{ finding.title }}</div>
                      <div class="space-between meta">
                        <div>{{ finding.priority }}</div>
                        <div v-if="finding.public_id">{{ finding.public_id }}</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="dropdownMenuFooter text-right" v-show="submissionHasFinding">
            <button class="button text" @click="toggleFindingLinkClick">
              <i class="far fa-unlink icon left"></i>Unlink Finding
            </button>
          </div>
          <div class="dropdownMenuFooter" v-show="!submissionHasFinding && searchMode">
            <div class="buttons u-flex-nowrap">
              <button
                class="button small programManager"
                :disabled="!selectedFindingUuid"
                @click="toggleFindingLinkClick"
              >
                Link Finding
              </button>
              <button class="button small outline" @click="disableSearchMode">Cancel</button>
            </div>
          </div>
        </div>
      </li>
      <li class="hasDropdown" v-click-outside="closeActionMenu">
        <i class="far fa-ellipsis-h" @click="toggleActionMenu"></i>
        <div class="dropdownMenu center" v-show="actionMenuExpanded">
          <div class="dropdownMenuBody u-p-0">
            <ul class="option-list">
              <li @click="editSubmissionClick">Edit</li>
              <li @click="deleteSubmissionClick" v-if="userIsProgramManager()">
                {{ submission.deleted ? 'Recover' : 'Delete' }}
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { FindingMixin } from '@/modules/findings/_mixins/finding'
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'SubmissionShieldMenu',
  directives: { clickOutside },
  mixins: [AccountMixin, FindingMixin],
  data() {
    return {
      actionMenuExpanded: false,
      findingMenuExpanded: false,
      searchMode: false,
      searchResults: [],
      searchTerms: '',
      selectedFindingUuid: '',
    }
  },
  props: {
    submission: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    createFindingEnabled() {
      return this.submission.status === 3 && this.submission.resolution === 2
    },
    submissionHasFinding() {
      const findings = this.submission.findings
      return findings && findings.length > 0
    },
    shieldIconClass() {
      return {
        'fas fa-shield': this.submissionHasFinding,
        'fal fa-shield': !this.submissionHasFinding,
        incomplete: !this.submissionIsComplete,
      }
    },
    submissionIsComplete() {
      if (!this.submission || !this.submission.status) {
        return false
      }

      return this.submission.status === 3
    },
  },
  methods: {
    toggleFindingLinkClick() {
      this.$emit('on-toggle-finding-link', this.selectedFindingUuid)
      this.searchMode = false
      this.searchTerms = ''
      this.searchResults = []
    },
    clearSearchTerms() {
      this.searchTerms = ''
      this.searchResults = []
      this.selectedFindingUuid = ''
    },
    closeActionMenu() {
      this.actionMenuExpanded = false
    },
    closeFindingMenu(e) {
      const targetId = e && e.target && e.target.id ? e.target.id : ''
      if (!targetId.includes('ca-alert')) {
        this.findingMenuExpanded = false
        this.searchMode = false
        this.searchTerms = ''
      }
    },
    async createFindingFromSubmission() {
      this.$router.push({
        name: 'CreateFinding',
        params: {
          submission: this.submission,
          uuid: this.submission.program.uuid,
        },
      })
    },
    deleteSubmissionClick() {
      this.$emit('on-delete-submission')
    },
    disableSearchMode() {
      this.searchMode = false
      this.searchTerms = ''
      this.searchResults = []
    },
    editSubmissionClick() {
      this.$router.push({
        name: 'SubmissionEdit',
        params: {
          programUuid: this.submission.program.uuid,
          submissionUuid: this.submission.uuid,
        },
      })
    },
    enableSearchMode() {
      this.searchMode = true
    },
    linkedFindingClick() {
      this.$router.push({
        name: 'Finding',
        params: {
          uuid: this.submission.findings[0].uuid,
        },
      })
    },
    async onSearchSubmit(val) {
      this.searchTerms = val
      if (!this.searchTerms) {
        this.searchResults = []
        return
      }

      const response = await this.actionSearchFindings({
        programUuid: this.submission.program.uuid,
        title: this.searchTerms,
        origin: 'submission',
      })
      this.searchResults = response.data.results
      if (!this.selectedFindingUuid) {
        return
      }

      const selectedInSearchResults = this.searchResults.findIndex(x => x.uuid === this.selectedFindingUuid)
      if (selectedInSearchResults <= -1) {
        this.selectedFindingUuid = ''
      }
    },
    setSelectedFindingUuid(val) {
      this.selectedFindingUuid = val
    },
    toggleFindingMenu() {
      if (!this.submissionIsComplete) {
        return
      }
      this.findingMenuExpanded = !this.findingMenuExpanded
    },
    toggleActionMenu() {
      this.actionMenuExpanded = !this.actionMenuExpanded
    },
  },
}
</script>
