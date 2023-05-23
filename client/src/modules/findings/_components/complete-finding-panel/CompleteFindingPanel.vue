<template>
  <div id="complete-finding-panel" class="ca-dialog" :class="{ active: visible }" @click="clickOutside">
    <div class="ca-dialog__content complete-finding-panel">
      <div class="ca-dialog__header">
        <h4>Mark Complete?</h4>
        <i class="fal fa-times" @click="cancelButtonClick"></i>
      </div>
      <div class="ca-dialog__body">
        <div>
          <p class="complete-finding-panel__instructions">Please choose a resolution for this finding.</p>
          <ul class="resolution-list">
            <li class="resolution-list__list-item" @click="setResolution(2)">
              <div class="radioContainer">
                <input
                  type="radio"
                  value="resolution-remediated"
                  name="resolution-remediated"
                  id="resolution-remediated"
                  :checked="selectedResolution === 2"
                />
                <label for="resolution-remediated"></label>
              </div>
              <div class="resolution-option">
                <div class="resolution-name">Finding has been Remediated</div>
                <p class="resolution-description">This vulnerability has been addressed by our team.</p>
              </div>
            </li>
            <li class="resolution-list__list-item" @click="setResolution(3)">
              <div class="radioContainer">
                <input
                  type="radio"
                  value="resolution-risk-accepted"
                  name="resolution-risk-accepted"
                  id="resolution-risk-accepted"
                  :checked="selectedResolution === 3"
                />
                <label for="resolution-risk-accepted"></label>
              </div>
              <div class="resolution-option">
                <div class="resolution-name">Risk Accepted Without Remediating</div>
                <p class="resolution-description">
                  This vulnerability will not be addressed by our team. I understand this vulnerability may negatively
                  impact our application, and I have chosen to accept the risk.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="buttons">
          <button
            class="button button-dynamic"
            :disabled="loading || !selectedResolution || selectedResolution === 0"
            @click="completeFindingClick"
          >
            Complete Finding
          </button>
          <button class="button programManager outline" @click="cancelButtonClick">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompleteFindingPanel',
  data() {
    return {
      selectedResolution: 0,
    }
  },
  props: {
    visible: {
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
  computed: {},
  methods: {
    cancelButtonClick() {
      if (this.visible) {
        this.$emit('on-cancel-click')
      }
    },
    completeFindingClick() {
      this.$emit('on-complete-finding', this.selectedResolution)
    },
    setResolution(resolution) {
      this.selectedResolution = resolution
    },
    clickOutside(e) {
      if (!e || !e.target) {
        return
      }

      const targetId = e && e.target && e.target.id ? e.target.id : ''
      if (targetId === 'complete-finding-panel') {
        this.$emit('on-cancel-click')
      }
    },
  },
}
</script>
