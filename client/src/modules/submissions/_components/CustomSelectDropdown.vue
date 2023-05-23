<template>
  <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--outline o-btn--xs o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }, className]"
      @click="toggleDropdownMenu"
    >
      <span>{{ selectedOption.name || selectedOption }}</span>
    </div>
    <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
      <li
        v-for="(option, index) in options"
        :key="`${title}-option-${index}`"
        @click="handleSelection(option)"
        :class="{ 'is-selected': selectedOption === option }"
      >
        {{ option.name || option }}
      </li>
    </ul>
    <select :name="title" :id="title">
      <option v-for="(option, index) in options" :key="index"> {{ option }}</option>
    </select>
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'CustomSelectDropdown',
  directives: {
    clickOutside,
  },
  props: {
    title: {
      type: String,
      default: '',
      required: true,
    },
    options: {
      type: Array,
      default: () => [],
      required: true,
    },
    selectedOption: {
      type: [Object, String],
      default: () => {},
      required: true,
    },
    className: {
      type: String,
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
    handleSelection(option) {
      this.$emit('on-option-clicked', option)
      this.expanded = false
    },
  },
}
</script>

<style></style>
