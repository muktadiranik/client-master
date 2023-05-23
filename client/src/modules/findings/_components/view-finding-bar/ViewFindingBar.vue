<template>
  <div class="finding-bar">
    <div class="finding-bar-content">
      <div class="finding-bar__header">Finding Created</div>
      <div class="finding-bar__details">
        <p>Click the View Finding button to view the finding record.</p>
      </div>
    </div>
    <div class="finding-bar__actions">
      <button type="button" class="button outline programManager" @click="viewFindingClick">View Finding</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewFindingBar',
  props: {
    findingUuid: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    viewFindingClick() {
      this.$router.push({
        name: 'Finding',
        params: { uuid: this.findingUuid },
      })
    },
  },
}
</script>
