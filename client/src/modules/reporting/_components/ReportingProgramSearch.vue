<template>
  <div>
    <div class="c-input-icon c-input-icon--left c-input-icon--sm c-clear-input">
      <input
        class="o-input"
        type="text"
        id="program-search"
        placeholder="Search programs..."
        data-lpignore="true"
        :value="searchTerms"
        @input="onInput($event.target.value)"
      />
      <i class="far fa-search c-input-icon__element"></i>
      <i class="fal fa-times-circle c-clear-input__icon" v-show="searchTerms" @click="onInput('')"></i>
    </div>
    <div
      :class="{ 'u-mt-10': availablePrograms.length > 0 || selectedPrograms.length > 0 }"
      v-show="showSearchResults || selectedPrograms"
    >
      <ul
        class="c-list-group c-list-group--alt-border-color c-list-group--default c-list-group--rounded-3 u-overflow-hidden"
      >
        <li
          class="u-d-f u-ai-center u-jc-sb selected u-bgc-gray-default-on-hover u-pl-15 u-pr-15"
          v-for="(program, index) in selectedPrograms"
          :key="`selected-program-${index}`"
          @click="toggleProgramSelected(program)"
        >
          <span class="u-mr-10">{{ program.title }}</span>
          <i class="fal fa-times-circle u-cursor-pointer"></i>
        </li>
        <li
          class=" u-bgc-gray-default-on-hover u-pl-15 u-pr-15"
          v-for="(program, index) in availablePrograms"
          :key="`program-${index}`"
          @click="toggleProgramSelected(program)"
        >
          <span>{{ program.title }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportingProgramSearch',
  props: {
    searchTerms: {
      type: String,
      default: '',
      required: false,
    },
    showSearchResults: {
      type: Boolean,
      default: false,
      required: true,
    },
    programs: {
      type: Array,
      default: () => [],
      required: true,
    },
    selectedPrograms: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    availablePrograms() {
      if (!this.programs) {
        return []
      }

      if (!this.selectedPrograms) {
        return this.programs
      }

      return this.programs.filter(x => !this.selectedPrograms.includes(x))
    },
  },
  methods: {
    toggleProgramSelected(programUuid) {
      this.$emit('on-toggle-program-selected', programUuid)
    },
    async onInput(val) {
      this.$emit('on-program-search-input', val)
    },
  },
}
</script>
