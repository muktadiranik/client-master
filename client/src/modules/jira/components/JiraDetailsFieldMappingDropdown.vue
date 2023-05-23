<template>
  <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }]"
      @click="toggleDropdownMenu"
    >
      <span>{{ selectedDetailsFieldMappingOption.name || 'CESSPPA details field mapping' }}</span>
    </div>
    <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
      <li
        class="u-text-center"
        v-for="(detail, index) in fieldMappingOptions"
        :key="`detail-${index}`"
        @click="selectDetails(detail)"
      >
        {{ detail.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'JiraDetailsFieldMappingDropdown',
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
    selectedDetailsFieldMappingOption: {
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
    selectDetails(fieldMapping) {
      this.$emit('on-field-mapping-selection', { type: 'details', fieldMapping })
      this.expanded = false
    },
  },
}
</script>
