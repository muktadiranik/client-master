<template>
  <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }]"
      @click="toggleDropdownMenu"
    >
      <span>{{ selectedIssue.name || 'Select Jira issue type to create' }}</span>
    </div>
    <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
      <li
        class="u-text-center"
        v-for="(issue, index) in issueTypes"
        :key="`issue-${index}`"
        @click="selectIssue(issue)"
      >
        {{ issue.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'JiraIssueTypeDropdown',
  components: {},
  directives: {
    clickOutside,
  },
  props: {
    issueTypes: {
      type: Array,
      default: () => [],
      required: true,
    },
    selectedIssue: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      expanded: false,
    }
  },
  methods: {
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
    selectIssue(issue) {
      this.$emit('on-issue-type-selected', issue)
      this.expanded = false
    },
  },
}
</script>
