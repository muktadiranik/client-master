<template>
  <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }]"
      @click="toggleDropdownMenu"
    >
      <span>{{ selectedEpic.name || 'Add to Epic' }}</span>
    </div>
    <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
      <li @click="selectEpic({ name: '', id: '', key: '' })">None</li>
      <li
        class="u-text-center"
        v-for="(epic, index) in selectedProjectEpics"
        :key="`project-${index}`"
        @click="selectEpic(epic)"
      >
        {{ epic.name }}
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
    selectedProjectEpics: {
      type: Array,
      default: () => [],
      required: true,
    },
    selectedEpic: {
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
    selectEpic(epic) {
      this.$emit('on-epic-selected', epic)
      this.expanded = false
    },
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
  },
}
</script>
