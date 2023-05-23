<template>
  <div id="complete-submission-panel" class="c-modal" :class="{ 'u-hidden': !visible }">
    <div class="c-modal__inner">
      <h6 class="u-font-18">Close Finding</h6>
      <div class="c-modal__close u-fs-20 u-cursor-pointer">
        <i class="fal fa-times" @click="cancelButtonClick"></i>
      </div>

      <div class="c-modal__body">
        <div>
          <p class="o-text o-text--sm">Excellent! One more thing...</p>
          <div class="c-form">
            <div class="c-form__group u-mt-10">
              <form class="l-flex u-fd-column u-ai-start">
                <div
                  class="u-mt-20"
                  v-for="(resolution, index) in displayResolutions"
                  :key="`info-status-option-${index}`"
                >
                  <div class="c-custom-control c-custom-control--radio">
                    <input
                      type="radio"
                      v-model="selectedResolution"
                      :value="resolution.id"
                      :name="`resolution-${index}`"
                      :id="`resolution-${index}`"
                    />
                    <label class="u-fs-14 o-text--dark" :for="`resolution-${index}`">{{ resolution.name }}</label>
                  </div>
                  <div class="u-br-3 u-bgc-gray2 o-text--gray u-p-10 l-flex u-text-left u-mt-10">
                    <i class="fal fa-info-circle u-fs-14 u-mr-8"></i>
                    <span class="u-fs-11">{{ resolution.helpText }}</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="c-modal__footer u-mt-10">
        <div class="u-flex-buttons u-jc-center">
          <button class="o-btn o-btn--outline o-btn--outline-primary o-btn--rounded-sm" @click="cancelButtonClick">
            <span>Cancel</span>
          </button>
          <button
            class="o-btn o-btn--primary o-btn--rounded-sm"
            :disabled="closeSubmissionDisabled"
            @click="completeSubmissionClick"
          >
            <span>Close Finding</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { AccountMixin } from '@/mixins/account'
import { STORE_KEY, GET_USER, GET_PROFILE } from '@/stores/account/types'
export default {
  name: 'FindingsKanbanModal',
  data() {
    return {
      closeResolutionsAO: [
        { name: 'Remediated', id: 2, helpText: 'Mark the Finding as fixed on your end.' },
        {
          name: 'Risk Accepted',
          id: 3,
          helpText: 'You do not consider this issue a business risk and choose to accept it.',
        },
      ],
      closeResolutionsPM: [
        { name: 'Remediated', id: 2, helpText: 'Mark the Finding as fixed on your end.' },
        {
          name: 'Risk Accepted',
          id: 3,
          helpText: 'You do not consider this issue a business risk and choose to accept it.',
        },
        { name: 'Verified', id: 6, helpText: 'Issue has been verified as a valid vulnerability.' },
      ],
      selectedResolution: '',
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  mixins: [AccountMixin],
  computed: {
    ...mapGetters(STORE_KEY, {
      profile: GET_PROFILE,
      user: GET_USER,
    }),
    closeSubmissionDisabled() {
      return !this.selectedResolution
    },
    displayResolutions() {
      return this.userIsAppOwner() ? this.closeResolutionsAO : this.closeResolutionsPM
    },
  },
  methods: {
    cancelButtonClick() {
      this.selectedResolution = ''
      this.$emit('cancel-click')
    },
    completeSubmissionClick() {
      this.$emit('on-complete-submission', this.selectedResolution)
      this.selectedResolution = ''
    },
    formFieldChanged(id) {
      this.selectedResolution = id
    },
  },
}
</script>
