<template>
  <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }]"
      @click="toggleDropdownMenu"
    >
      <span>{{ selectedTitleFieldMappingOption.name || 'Inspectiv title field mapping' }}</span>
    </div>
    <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
      <li
        class="u-text-center"
        v-for="(title, index) in fieldMappingOptions"
        :key="`title-${index}`"
        @click="selectTitle(title)"
      >
        {{ title.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'JiraTitleFieldMappingtDropdown',
  components: {},
  directives: {
    clickOutside,
  },
  props: {
    fieldMappingOptions: {
      type: Array,
      default: () => [],
      required: true,
    },
    selectedTitleFieldMappingOption: {
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
    selectTitle(fieldMapping) {
      this.$emit('on-field-mapping-selection', { type: 'title', fieldMapping })
      this.expanded = false
    },
  },
}
</script>
