<template>
  <div class="box u-box-shadow">
    <div class="main p15">
      <div class="space-between align-center">
        <div>Community Rank:</div>
        <div>
          <strong id="community-rank">{{ dashboardDetails.rank || 0 }}</strong>
        </div>
      </div>
      <div class="space-between align-center">
        <div>Programs:</div>
        <div>
          <strong id="program-count">{{ dashboardDetails.program_count || 0 }}</strong>
        </div>
      </div>
      <div class="space-between align-center">
        <div>Companies:</div>
        <div>
          <strong id="company-count">{{ dashboardDetails.company_count || 0 }}</strong>
        </div>
      </div>
      <div class="space-between align-center">
        <div>Submissions:</div>
        <div>
          <strong id="submissions-count">{{ dashboardDetails.submissions_count || 0 }}</strong>
        </div>
      </div>
      <div class="space-between align-center">
        <div>Accuracy:</div>
        <div>
          <strong id="accuracy-percentage">{{ dashboardDetails.accuracy || '0.00%' }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AccountStats',
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      dashboardDetails: '$dashboard/dashboardDetails',
    }),
  },
}
</script>
