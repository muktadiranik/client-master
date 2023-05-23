<template>
  <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }]"
      @click="toggleDropdownMenu"
    >
      <span>{{ selectedDomain || 'All Domains' }}</span>
    </div>
    <ul class="c-dropdown__menu c-dropdown__menu--no-scroll" :class="{ 'is-visible': expanded }">
      <li
        @click="selectDomain('')">
        All Domains
      </li>
      <li
        v-for="(domain, index) in domainOptions"
        :key="`domain-${index}`"
        @click="selectDomain(domain.name)"
      >
        {{ domain.displayName }}
      </li>
    </ul>
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'DomainSelector',
  components: {},
  directives: {
    clickOutside,
  },
  data() {
    return {
      selectedDomain: 'Domain',
      expanded: false,
    }
  },
  props: {
    domainOptions: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  methods: {
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
    selectDomain(domain) {
      this.expanded = false
      this.selectedDomain = domain
      this.$emit('domain-selected', domain)
    },
  },
}
</script>
