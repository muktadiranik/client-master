<template>
  <div class="c-dropdown c-dropdown--select u-mr-8" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }]"
      @click="onClick"
    >
      <span>{{ selectedOption.name || placeholder }}</span>
    </div>
    <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
      <li
        v-for="(select, index) of selectOptions"
        :key="`${index}-select`"
        @click="onSelect(select)"
      >
        {{ select.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'Dropdown',
  directives: {
    clickOutside,
  },
  props: {
    selectOptions: {
      type: Array,
      required: true,
    },
    selectedOption: {
      type: Object,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      expanded: false,
    }
  },
  methods: {
    onSelect(option) {
      this.$emit('on-select', option)
      this.expanded = false
    },
    hideDropdownMenu() {
      this.expanded = false
    },
    onClick() {
      this.expanded = !this.expanded
    },
  },
}
</script>
