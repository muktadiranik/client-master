<template>
  <div class="severity-indicator hasDropdown" @click="toggleExpand" v-click-outside="clickOutside">
    <div class="icon">
      <i class="far fa-heartbeat"></i>
    </div>
    <div class="indicator">
      <span class="indicator__label">{{ currentSeverity }}</span>
      <span class="indicator__bar">
        <span class="severity-level" :style="severityProgressBarStyle"></span>
      </span>
    </div>
    <div class="dropdownMenu center" v-show="expanded">
      <div class="dropdownMenuHeader">
        <h4 class="title">Severity</h4>
      </div>
      <div class="dropdownMenuBody u-p-0">
        <ul class="option-list">
          <li
            v-for="(priority, index) in findingPriorities"
            :key="`finding-priority-${index}`"
            @click="setPriority(priority.id)"
          >
            {{ priority.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { FindingMixin } from '@/modules/findings/_mixins/finding'
import { AccountMixin } from 'mixins/account'
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'FindingSeverityDropdown',
  components: {},
  mixins: [AccountMixin, FindingMixin],
  directives: { clickOutside },
  props: {
    currentSeverity: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      expanded: false,
    }
  },
  computed: {
    severityProgressBarStyle() {
      const severity = this.finding.priority
      let width = '0%'
      switch (severity) {
        case 'Informational':
          width = '15%'
          break
        case 'Low':
          width = '30%'
          break
        case 'None':
        case 'Medium':
          width = '50%'
          break
        case 'High':
          width = '75%'
          break
        case 'Critical':
          width = '100%'
          break
        default:
          width = '0%'
          break
      }

      return { width }
    },
  },
  methods: {
    clickOutside() {
      this.expanded = false
    },
    toggleExpand() {
      if (!this.userIsProgramManager()) {
        return
      }

      this.expanded = !this.expanded
    },
    async setPriority(priorityId) {
      try {
        this.$solar.show()
        await this.actionEditFinding({
          uuid: this.finding.uuid,
          priority: priorityId,
        })
        this.$caAlert.success('Finding severity updated successfully')
      } catch (e) {
        this.$caAlert.error('Failed to update finding severity')
      } finally {
        this.$solar.hide()
      }
    },
  },
  async mounted() {
    await this.actionLoadFindingPriorities()
  },
}
</script>
