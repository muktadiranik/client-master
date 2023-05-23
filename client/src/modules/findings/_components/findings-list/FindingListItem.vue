<template>
  <div>
    <div class="c-kanban__card" @click="routeToFinding(finding.uuid)">
      <div class="l-flex u-jc-sb u-ai-center u-mb-10">
        <div class="l-flex u-ai-center">
          <div class="u-fs-11 o-text--500 u-mr-8 l-flex u-ai-center">
            <div class="c-kanban__card--thumb">
              <img :src="finding.program_image ? finding.program_image : '/static/images/avatar-endpoint.svg'" />
            </div>
            <span class="c-kanban__card-program">
              {{ finding.program_title }}
            </span>
          </div>
        </div>
        <ResolutionBadge :resolution="finding.resolution" />
      </div>
      <div class="l-flex u-ai-center u-mb-8">
        <span
          class="c-kanban__card-severity u-mr-10"
          :class="`c-badge c-badge--severity-${finding.priority.toLowerCase()}`"
        >
          {{ finding.priority === 'Informational' ? 'Info' : finding.priority }}
        </span>
        <div class="c-kanban__card-title">
          {{ finding.title }}
        </div>
      </div>
      <div class="u-mt-15 l-flex u-ai-fe u-jc-sb">
        <ul class="c-badge-list">
          <li class="c-badge--vuln-type" v-for="vuln in finding.vulnerability_types" :key="vuln.uuid">
            <span>{{ vuln.name }}</span>
          </li>
        </ul>
        <span class="c-kanban__card-date">{{ finding.date_published | date }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import DateTimeFilters from '@/filters/date-time-filters'
import { AccountMixin } from 'mixins/account'
import ResolutionBadge from '@/modules/findings/_components/findings-list/ResolutionBadge'

export default {
  name: 'FindingListItem',
  mixins: [AccountMixin],
  components: {
    ResolutionBadge,
  },
  data() {
    return {}
  },
  filters: { ...DateTimeFilters },
  props: {
    finding: {
      type: Object,
      default: () => {},
      required: true,
    },
    dragging: {
      type: Boolean,
      default: () => false,
      required: true,
    },
  },
  computed: {
    severityClass() {
      if (!this.finding || !this.finding.priority) {
        return 'none'
      }
      return this.finding.priority.toLowerCase()
    },
    programImage() {
      return this.finding && this.finding.program_image ? this.finding.program_image : DEFAULT_PROGRAM_IMAGE
    },
  },
  methods: {
    routeToFinding(uuid) {
      if (!this.dragging) {
        this.$router.push({ name: 'Finding', params: { uuid } })
      }
    },
  },
}
</script>

<style></style>
