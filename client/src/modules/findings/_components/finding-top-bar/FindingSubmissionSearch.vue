<template>
  <div v-show="visible">
    <div class="c-input-icon c-input-icon--left c-input-icon--sm c-clear-input u-mb-15">
      <input
        type="text"
        class="o-input"
        placeholder="Search to link submission..."
        :value="searchTerms"
        @input="onSearchTermsInput($event.target.value)"
      />
      <i class="far fa-search c-input-icon__element"></i>
      <i class="fal fa-times-circle c-clear-input__icon" @click="clearSearch" v-show="showClearIcon"></i>
    </div>
    <ul class="c-popover__submissions-list u-mb-15" v-if="searchResults.length > 0">
      <li v-for="(result, index) in searchResults" :key="`submission-result-${index}`">
        <input
          type="radio"
          class="u-hide-input"
          :name="`submission-result-${index}`"
          :id="`submission-result-${index}`"
          @input="setSelectedSubmissionUuid(result.uuid)"
          :checked="selectedSubmissionUuid === result.uuid"
        />
        <label :for="`submission-result-${index}`">
          <h6 class="o-h6 u-font-12">{{ result.title }}</h6>
          <div class="u-space-between u-ai-center u-mt-10">
            <span class="c-badge" :class="`c-badge c-badge--severity-${result.priority.toLowerCase()}`">{{
              result.priority
            }}</span>
            <span v-if="result.public_id">{{ result.public_id }}</span>
          </div>
        </label>
      </li>
    </ul>
    <div class="u-mb-20" v-if="searchResults.length === 0">
      <p class="o-text o-text--sm u-text-mute u-fw-600">No submission to show.</p>
    </div>
    <div class="u-flex-buttons u-jc-sb">
      <button
        class="o-btn o-btn--sm o-btn--rounded-sm o-btn--outline o-btn--outline-coolgrey"
        @click="cancelSubmissionSearch"
      >
        Cancel
      </button>
      <button
        class="o-btn o-btn--sm o-btn--rounded-sm o-btn--primary"
        :disabled="!selectedSubmissionUuid"
        @click="linkFindingClick"
      >
        Link Submission
      </button>
    </div>
  </div>
</template>

<script>
import { FindingMixin } from '@/modules/findings/_mixins/finding'

export default {
  name: 'FindingSubmissionSearch',
  components: {},
  mixins: [FindingMixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    searchResults: {
      type: Array,
      default: () => [],
      required: true,
    },
    searchTerms: {
      type: String,
      default: '',
      required: false,
    },
    selectedSubmissionUuid: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    showClearIcon() {
      return this.searchTerms && this.searchTerms.length > 0
    },
  },
  methods: {
    cancelSubmissionSearch() {
      this.$emit('on-cancel-search')
    },
    clearSearch() {
      this.$emit('on-clear-search')
    },
    linkFindingClick() {
      this.$emit('on-link-finding-to-submission', this.selectedSubmissionUuid)
    },
    async onSearchTermsInput(val) {
      this.$emit('on-search-terms-input', val)
    },
    setSelectedSubmissionUuid(val) {
      this.$emit('on-set-selected-submission', val)
    },
  },
}
</script>
