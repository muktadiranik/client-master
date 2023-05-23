<template>
  <div class="related-findings-panel">
    <div class="related-findings-panel__header">
      <em>Related Findings:</em>
    </div>
    <ul class="related-findings-list">
      <li
        class="related-findings-list__list-item"
        v-for="(relatedFinding, index) in relatedFindings"
        :key="`related-finding-${index}`"
      >
        <div class="related-finding">
          <div class="related-finding__title" @click="relatedFindingClick(relatedFinding.uuid)">
            <i class="fa fa-link"></i>
            <span>{{ relatedFinding.title }}</span>
          </div>
          <div class="related-finding__resolution" :class="relatedFinding.resolution">
            <i class="fal fa-fw fa-check-circle"></i>
            {{ relatedFinding.resolution }}
          </div>
          <button
            class="button text related-finding link-button unlink-button"
            @click="unlinkFinding(relatedFinding.uuid)"
            :disabled="unlinkFindingLoading"
          >
            <i class="fa fa-unlink"></i>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { FindingMixin } from '@/modules/findings/_mixins/finding'

export default {
  name: 'RelatedFindingsPanel',
  mixins: [FindingMixin],
  props: {
    findingUuid: {
      type: String,
      default: '',
      required: true,
    },
    relatedFindings: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      alertId: 'findingLinkAlert',
      unlinkFindingLoading: false,
    }
  },
  methods: {
    relatedFindingClick(uuid) {
      this.$caAlert.close(this.alertId)
      this.$router.push({
        name: 'Finding',
        params: { uuid: uuid },
      })
    },
    async unlinkFinding(findingLinkUuid) {
      this.unlinkFindingLoading = true
      try {
        await this.toggleFindingLink(this.finding.uuid, findingLinkUuid)
        this.$caAlert.success('Finding Unlinked Successfully', {
          id: this.alertId,
          buttons: [
            {
              text: 'Relink Finding',
              callback: async () => {
                await this.toggleFindingLink(this.finding.uuid, findingLinkUuid)
                this.$caAlert.close(this.alertId)
                this.$caAlert.success('Finding relinked successfully')
              },
            },
          ],
        })
      } catch (e) {
        this.$caAlert.error('Failed to unlink finding')
      } finally {
        this.unlinkFindingLoading = false
      }
    },
  },
}
</script>
