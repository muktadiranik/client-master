<template>
  <div class="c-popover c-popover--width-365 c-popover--for-related-findings c-popover--no-arrow">
    <div class="c-popover__header u-text-center">
      <h6 class="o-h6 c-popover__title u-text-single-line">Findings matching "{{ searchTerms }}"</h6>
    </div>
    <div class="c-popover__body">
      <ul class="c-popover__findings-list" v-if="findings">
        <li class="u-text-center u-text-mute u-fw-600" v-show="!filteredFindings || filteredFindings.length === 0">
          <span>No findings found.</span>
        </li>
        <li
          v-for="(f, index) in filteredFindings"
          @click="findingResultsListItemClick(f.uuid)"
          :class="{ selected: selectedFindingUuid === f.uuid }"
          v-show="!findingIsLinked(f.uuid) && f.uuid != finding.uuid"
          :key="`finding-${index}`"
        >
          <input
            class="u-hide-input"
            type="radio"
            :id="`finding-result-${index}`"
            :value="f.uuid"
            :name="`finding-result-{index}`"
            v-model="selectedFindingUuid"
          />
          <label :for="`finding-result-{index}`">
            <h6 class="o-h6 u-font-12">{{ f.title }}</h6>
            <div class="u-space-between u-ai-center u-mt-10">
              <div class="c-badge" :class="`c-badge--status-${f.resolution.toLowerCase()}`">
                <span>{{ f.resolution }}</span>
              </div>
              <div class="u-text-mute" v-show="finding.public_id">{{ finding.public_id }}</div>
            </div>
          </label>
        </li>
      </ul>
    </div>
    <div class="c-popover__footer">
      <div class="u-flex-buttons u-jc-sb">
        <button class="o-btn o-btn--sm o-btn--outline o-btn--outline-coolgrey o-btn--rounded-sm" @click="onCancel">
          <span>Cancel</span>
        </button>
        <button
          class="o-btn o-btn--primary o-btn--sm o-btn--rounded-sm"
          @click="linkFinding"
          :disabled="!selectedFindingUuid || selectedFindingUuid.length === 0"
        >
          <span>Link Finding</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FindingMixin } from '@/modules/findings/_mixins/finding'

export default {
  name: 'FindingSearchResults',
  mixins: [FindingMixin],
  props: {
    findings: {
      type: Array,
      default: () => [],
      required: true,
    },
    selectedFindingUuid: {
      type: String,
      default: '',
      required: true,
    },
    searchTerms: {
      type: String,
      default: 'Findings',
      required: true,
    },
  },
  data() {
    return {
      linkFindingLoading: false,
    }
  },
  computed: {
    filteredFindings() {
      if (!this.findings || !this.findings.length) {
        return []
      }

      const filtered = this.findings.filter(x => !this.findingIsLinked(x.uuid) && x.uuid !== this.finding.uuid)

      return filtered || []
    },
  },
  methods: {
    onCancel() {
      this.$emit('on-cancel')
    },
    findingResultsListItemClick(val) {
      this.$emit('set-selected-finding-uuid', val)
    },
    async linkFinding() {
      this.linkFindingLoading = true
      try {
        const payload = {
          findingUuid: this.finding.uuid,
          linkFindingUuid: this.selectedFindingUuid,
        }
        await this.actionLinkFinding(payload)
        this.$caAlert.success('Finding Linked Successfully')
      } catch (e) {
        this.$caAlert.error('Failed to link finding')
      } finally {
        this.linkFindingLoading = false
        this.$emit('on-finding-linked')
      }
    },
  },
}
</script>
