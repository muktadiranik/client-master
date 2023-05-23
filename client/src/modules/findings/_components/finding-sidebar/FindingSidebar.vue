<template>
  <div class="c-box c-box--comment u-overflow-hidden" ref="submissionSidebar" :style="sidebarStyle">
    <div class="c-box__header">
      <h6 class="o-h6 u-d-f u-ai-center">
        <i class="far fa-comments u-mr-10"></i>
        <span>Comments</span>
      </h6>
    </div>
    <!-- .c-box__header -->
    <div class="c-box__body u-p-0">
      <chat-window v-if="showChatTab" :thread-uuid="finding.thread_uuid" />
    </div>
    <!-- .c-box__body -->
  </div>
  <!-- .c-box -->
</template>

<script>
import { dynamicColor } from '@/directives/dynamic-color'
import { clickOutside } from '@/directives/click-outside'
import ChatWindow from '@/modules/chat/_components/ChatWindow'
import { AccountMixin } from '@/mixins/account'
import { FindingMixin } from '@/modules/findings/_mixins/finding'

export default {
  name: 'FindingSidebar',
  components: {
    ChatWindow,
  },
  directives: {
    clickOutside,
    dynamicColor,
  },
  mixins: [AccountMixin, FindingMixin],
  props: {
    sidebarStyle: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      deleteToggleAlertId: 'delete-toggle-alert',
      expanded: false,
    }
  },
  computed: {
    showChatTab() {
      return this.finding && this.finding.thread_uuid
    },
  },
  methods: {
    hideDropdown() {
      this.expanded = false
    },
    toggleDropdown() {
      this.expanded = !this.expanded
    },
  },
}
</script>
