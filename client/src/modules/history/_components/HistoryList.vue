<template>
  <div>
    <ul class="c-history">
      <HistoryItem v-for="(item, index) in historyList" :historyItem="item" :key="`history-${index}`" />
    </ul>
    <div v-if="historyList.length === 0" class="u-text-mute u-pt-15 u-pr-15 u-pb-15 u-pl-15">No history to show.</div>
  </div>
</template>

<script>
import HistoryItem from '@/modules/history/_components/HistoryItem'

export default {
  name: 'HistoryList',
  components: {
    HistoryItem,
  },
  props: {
    historyList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
}
</script>
