<template>
  <div class="pm-editor">
    <div class="pm-editor__title">
      <span>Reviewed By</span>
    </div>
    <ul class="pm-list">
      <li v-for="(pm, index) in programManagers" :key="`pm-${index}`">
        <div class="submission-attribution has-actions">
          <div class="submission-attribution__thumb-container">
            <div class="submission-attribution__thumb">
              <img :src="defaultAvatar" alt="Attribution Thumb" />
            </div>
          </div>
          <div class="submission-attribution-details">
            <div class="submission-attribution-details__label">
              <strong>{{ pm.user_name }}</strong>
            </div>
          </div>
          <div class="submission-attribution__actions">
            <button type="button" class="button text removeButton" @click="removeProgramManager(pm)">
              <span><i class="fal fa-times-circle"></i></span>
            </button>
          </div>
        </div>
      </li>
    </ul>
    <div class="pm-search">
      <form class="form pm-search-form" v-show="allowPmAssignment">
        <div class="form__group">
          <input
            class="form__control"
            type="text"
            placeholder="Type to search for a Program Manager..."
            @input="pmSearchChanged($event.target.value)"
            :value="searchTerms"
          />
        </div>
      </form>
      <div class="no-pms-assigned">
        <div class="buttons" v-show="!assignedToSelf">
          <button
            v-show="allowPmAssignment"
            class="button text self-assign-button"
            @click="assignToSelf()"
            v-dynamic-color
          >
            Assign to me
          </button>
        </div>
      </div>
      <div class="pm-search-results-container">
        <div class="pm-search-results" v-show="searchResultsVisible" v-click-outside="hideSearchResults">
          <div class="pm-search-results__title">
            Program Managers
          </div>
          <ul class="pm-list" v-show="searchResults && searchResults.length > 0">
            <li v-for="(pm, index) in searchResults" :key="`pm-${index}`" @click="addProgramManager(pm)">
              <div class="submission-attribution">
                <div class="submission-attribution__thumb-container">
                  <div class="submission-attribution__thumb">
                    <img :src="pm.profile_picture || defaultAvatar" alt="Attribution Thumb" />
                  </div>
                </div>
                <div class="submission-attribution-details">
                  <div class="submission-attribution-details__label">
                    <strong>{{ pm.user_name }}</strong>
                  </div>
                </div>
                <div class="submission-attribution__actions">
                  <button type="button" class="button text removeButton">
                    <span><i class="fal fa-plus-circle"></i></span>
                  </button>
                </div>
              </div>
            </li>
          </ul>
          <div class="no-results-found" v-show="showNoSearchResultsFound">
            <span>No results found</span>
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
  name: 'SubmissionProgramManagerEditor',
  mixins: [AccountMixin],
  directives: {
    clickOutside,
    dynamicColor,
  },
  props: {
    submission: {
      type: Object,
      default: () => {},
    },
    programManagers: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      searchTerms: '',
      searchResults: [],
      searchResultsVisible: false,
      allowPmAssignment: false,
    }
  },
  computed: {
    defaultAvatar() {
      return DEFAULT_USER_IMAGE
    },
    showNoSearchResultsFound() {
      return (
        this.searchResultsVisible === true &&
        this.searchResults &&
        this.searchResults.length === 0 &&
        this.searchTerms &&
        this.searchTerms.length > 0
      )
    },
    assignedToSelf() {
      let selfAssigned = false
      const profile = this.getProfile()
      for (let i = 0, len = this.programManagers.length; i < len; i++) {
        if (this.programManagers[i].uuid !== profile.uuid) {
          continue
        }
        selfAssigned = true
        break
      }
      return selfAssigned
    },
  },
  methods: {
    assignToSelf() {
      const profile = this.getProfile()
      this.$emit('on-pm-add', profile)
    },
    removeProgramManager(programManager) {
      this.$emit('on-pm-remove', programManager)
      this.hideSearchResults()
    },
    addProgramManager(programManager) {
      this.$emit('on-pm-add', programManager)
      this.hideSearchResults()
    },
    clearSearchResults() {
      this.searchResults = []
    },
    hideSearchResults() {
      this.searchResultsVisible = false
    },
    async pmSearchChanged(searchTerms) {
      this.searchResults = []
      this.searchTerms = searchTerms
      if (!searchTerms || searchTerms.length === 0) {
        this.clearSearchResults()
        this.hideSearchResults()
        return
      }

      this.searchResultsVisible = true

      const response = await this.$store.dispatch('SUBMISSIONS/SEARCH_PMS', {
        searchTerms,
        userType: 'program_manager',
      })

      const pms = response.data
      if (!pms || !pms.length) {
        return
      }

      this.searchResults = []
      for (let pm of pms) {
        const existingPm = this.programManagers.find(x => x.uuid === pm.uuid)
        if (!existingPm) {
          this.searchResults.push(pm)
        }
      }
    },
    togglePmAssignmentEnabled() {
      if (this.programManagers && this.programManagers.length > 0) {
        this.allowPmAssignment = false
        this.searchTerms = ''
        return
      }

      this.allowPmAssignment = true
    },
  },
  mounted() {
    this.togglePmAssignmentEnabled()
  },
  watch: {
    programManagers(newVal, oldVal) {
      this.togglePmAssignmentEnabled()
    },
  },
}
</script>
