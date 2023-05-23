<template>
  <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }]"
      @click="toggleDropdownMenu"
    >
      <span>{{ selectedSeverity || 'Severity' }}</span>
    </div>
    <ul class="c-dropdown__menu c-dropdown__menu--no-scroll" :class="{ 'is-visible': expanded }">
      <li @click="selectSeverity('')">All Severities</li>
      <li
        v-for="(severity, index) in severityOptions"
        :key="`severity-${index}`"
        @click="selectSeverity(severity.name)"
      >
        <span class="c-badge" :class="`c-badge--severity-${severity.displayName.toLowerCase()}`">
          {{ severity.displayName }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'

export default {
  directives: {
    clickOutside,
  },
  props: {
    selectedSeverity: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      expanded: false,
      severityOptions: [
        { displayName: 'Critical', name: 'Critical' },
        { displayName: 'High', name: 'High' },
        { displayName: 'Medium', name: 'Medium' },
        { displayName: 'Low', name: 'Low' },
        { displayName: 'Info', name: 'Informational' },
      ],
    }
  },
  methods: {
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
    selectSeverity(severity) {
      this.expanded = false
      this.$emit('set-priority-query', severity)
    },
  },
}
</script>
