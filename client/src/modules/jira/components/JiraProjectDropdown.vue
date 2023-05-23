<template>
  <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }]"
      @click="toggleDropdownMenu"
    >
      <span>{{ selectedProject.name || 'Select Jira Project to configure' }}</span>
    </div>
    <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
      <li
        class="u-text-center"
        v-for="(project, index) in projects"
        :key="`project-${index}`"
        @click="selectProject(project)"
      >
        {{ project.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'JiraProjectDropdown',
  components: {},
  directives: {
    clickOutside,
  },
  props: {
    projects: {
      type: Array,
      default: () => [],
      required: true,
    },
    selectedProject: {
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
    selectProject(project) {
      this.$emit('on-project-selected', project)
      this.expanded = false
    },
  },
}
</script>
