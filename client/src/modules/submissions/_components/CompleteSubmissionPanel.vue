<template>
  <div id="complete-submission-panel" class="c-modal" :class="{ 'u-hidden': !visible }">
    <div class="c-modal__inner u-br-3">
      <div class="c-modal__header">
        <h6 class="o-h6 u-color-white u-font-16">Close Submission?</h6>
        <div class="u-fs-20 u-cursor-pointer">
          <i class="fal fa-times" @click="cancelButtonClick"></i>
        </div>
      </div>
      <div class="c-modal__body">
        <div>
          <p class="o-text o-text--sm">Are you sure you want to mark this submission as Complete?</p>
          <p class="o-text o-text--sm">Please review the following fields before proceeding.</p>
          <div class="c-form">
            <div class="c-form__group u-mt-30">
              <label for="severity-select" class="c-form__label c-form__label--small">Severity</label>
              <div class="c-select-container">
                <select
                  class="o-input o-input--select"
                  id="severity-select"
                  v-model="form.priority"
                  @change="formFieldChanged($event.target.value, 'priority')"
                >
                  <option
                    v-for="(priority, index) in submissionPriorities"
                    :value="priority.id"
                    :key="`info-priority-option-${index}`"
                    >{{ priority.name }}</option
                  >
                </select>
              </div>
            </div>
            <div class="c-form__group u-mt-30">
              <label for="resolution-select" class="c-form__label c-form__label--small">Resolution</label>
              <div class="c-select-container">
                <select
                  class="o-input o-input--select"
                  id="resolution-select"
                  v-model="form.resolution"
                  @change="formFieldChanged(Number($event.target.value), 'resolution')"
                >
                  <option value="1">Select a resolution</option>
                  <option
                    v-for="(resolution, index) in filteredSubmissionResolutions"
                    :value="resolution.id"
                    :key="`info-status-option-${index}`"
                    >{{ resolution.name }}</option
                  >
                </select>
              </div>
            </div>
            <div class="c-form__group u-mt-30" v-show="resolutionIsAccepted">
              <label class="c-form__label c-form__label--small">Payout</label>
              <input
                class="o-input"
                type="text"
                @change="formFieldChanged($event.target.value, 'payout')"
                :value="form.payout"
              />
            </div>
          </div>
        </div>
        <div class="c-alert c-alert--warning u-mt-30" v-show="resolutionIsAccepted">
          <div class="u-d-f u-ai-center">
            <i class="far fa-exclamation-circle u-mr-15"></i>
            <span>Marking this submission as Closed will submit payment request to the banking team.</span>
          </div>
        </div>
      </div>
      <div class="c-modal__footer">
        <div class="u-flex-buttons u-jc-sb">
          <button class="o-btn o-btn--outline o-btn--outline-coolgrey o-btn--rounded-sm" @click="cancelButtonClick">
            <span>Cancel</span>
          </button>
          <button
            class="o-btn o-btn--primary o-btn--rounded-sm"
            :disabled="closeSubmissionDisabled"
            @click="completeSubmissionClick"
          >
            <span>Close Submission</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/stores/submissions'
import {
  STORE_KEY,
  GET_SUBMISSION_PRIORITIES,
  GET_SUBMISSION_RESOLUTIONS,
  LOAD_SUBMISSION_RESOLUTIONS,
  LOAD_SUBMISSION_PRIORITIES,
} from '@/stores/submissions/types'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CompleteSubmissionPanel',
  data() {
    return {
      form: {
        priority: -1,
        payout: -1,
        resolution: -1,
        status: 3,
      },
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    submission: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    ...mapGetters(STORE_KEY, {
      submissionResolutions: GET_SUBMISSION_RESOLUTIONS,
      submissionPriorities: GET_SUBMISSION_PRIORITIES,
    }),
    closeSubmissionDisabled() {
      return !this.form.resolution || this.form.resolution === 1
    },
    filteredSubmissionResolutions() {
      if (!this.submissionResolutions) {
        return []
      }
      return this.submissionResolutions.filter(x => x.name !== 'Unresolved')
    },
    resolutionIsAccepted() {
      const acceptedResolution = this.submissionResolutions.find(x => x.name === 'Accepted')
      if (!acceptedResolution) {
        return false
      }

      return this.form.resolution === acceptedResolution.id
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      loadSubmissionResolutions: LOAD_SUBMISSION_RESOLUTIONS,
      loadSubmissionPriorities: LOAD_SUBMISSION_PRIORITIES,
    }),
    cancelButtonClick() {
      this.resetForm()
      this.$emit('cancel-click')
    },

    completeSubmissionClick() {
      this.$emit('on-complete-submission', this.form)
    },
    formFieldChanged(value, field) {
      if (value && value.number) {
        this.form[field] = value.number
      } else {
        this.form[field] = value || (field === 'payout' ? 0 : '')
      }
    },
    resetForm() {
      this.form = {
        priority: this.submission.priority,
        payout: this.submission.payout,
        resolution: this.submission.resolution,
      }
    },
  },
  async mounted() {
    this.resetForm()
    await this.loadSubmissionPriorities()
    await this.loadSubmissionResolutions()
  },
  created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  watch: {
    submission(newValue, oldValue) {
      this.form.resolution = newValue.resolution
      this.form.priority = newValue.priority
      this.form.payout = newValue.payout
    },
  },
}
</script>
