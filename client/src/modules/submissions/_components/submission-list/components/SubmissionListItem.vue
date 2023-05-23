<template>
  <div>
    <router-link tag="div" :to="{ name: 'Submission', params: { uuid: submission.uuid } }">
      <div class="c-kanban__card">
        <div class="l-flex u-jc-sb u-ai-center u-mb-10">
          <div class="l-flex u-ai-center">
            <div class="u-fs-10 o-text--500 u-mr-8 l-flex u-ai-center">
              <div class="c-kanban__card--thumb">
                <img
                  :src="submission.program_image ? submission.program_image : '/static/images/avatar-endpoint.svg'"
                />
              </div>
              <span class="c-kanban__card-program">
                {{ submission.program_title }}
              </span>
            </div>
          </div>
          <div v-show="submission.resolution_display !== 'Unresolved'">
            <ResolutionBadge :resolution="submission.resolution_display" />
          </div>
        </div>
        <div class="l-flex u-ai-center u-mb-8">
          <span
            class="c-kanban__card-severity u-mr-10"
            :class="`c-badge c-badge--severity-${submission.priority_display.toLowerCase()}`"
          >
            {{ submission.priority_display === 'Informational' ? 'Info' : submission.priority_display }}
          </span>
          <div class="c-kanban__card-title">{{ submission.title }}</div>
        </div>
        <div class="u-mt-15 l-flex u-jc-sb u-ai-end">
          <div>
            <ul class="c-badge-list">
              <li class="c-badge--vuln-type" v-for="vuln in submission.vulnerability_types" :key="vuln.uuid">
                <span>{{ vuln.name }}</span>
              </li>
            </ul>
            <div class="l-flex u-mt-15 u-ai-center">
              <div class="u-mr-10">
                <i class="far fa-money-bill-wave u-mr-2"></i>
                <span>{{ submission.payout_display }}</span>
              </div>

              <!-- TO DO: check if paid pending condition is correct -->
              <!-- <div :class="`c-badge--payment c-badge--payment-${submission.payout > 0 ? 'paid' : 'pending'}`">
                <span>{{ submission.payout > 0 ? 'Paid' : 'Pending' }}</span>
              </div> -->
            </div>
          </div>
          <span class="c-kanban__card-date">{{ submission.date_created | date }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import DateTimeFilters from '@/filters/date-time-filters'
import ResolutionBadge from '@/modules/findings/_components/findings-list/ResolutionBadge'

export default {
  name: 'SubmissionListItem',
  data() {
    return {}
  },
  components: {
    ResolutionBadge,
  },
  filters: { ...DateTimeFilters },
  props: {
    submission: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    reportBounty() {
      return this.submission && this.submission.payout_display ? this.submission.payout_display : ''
    },
    programImage() {
      if (!this.submission) {
        return DEFAULT_PROGRAM_IMAGE
      }
      const image = this.submission.program_image
      if (!image) {
        return DEFAULT_PROGRAM_IMAGE
      }
      return image
    },
  },
}
</script>

<style></style>
