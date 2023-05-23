<template>
  <div v-dynamic-color>
    <form v-on:submit.prevent>
      <div class="u-position-relative">
        <div class="c-input-icon c-input-icon--sm c-clear-input">
          <input
            type="text"
            class="o-input with-value"
            placeholder="Search by name or company"
            v-on:input="updateLocalSearchTerm($event.target.value)"
            v-on:keyup.enter="onSearchSubmit($event.target.value)"
            :value="localInputText.hasChanged ? localInputText.text : searchTerms"
          />
          <i class="far fa-search c-clear-input__icon" @click="onSearchSubmit(localInputText.text)"></i>
          <i
            class="far fa-times-circle c-clear-input__icon"
            v-bind:style="{ right: '3em' }"
            @click="clearSearch"
            v-show="searchTerms != ''"
          ></i>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { dynamicColor } from '@/directives/dynamic-color'

export default {
  name: 'ProgramsSearchBar',
  data() {
    return {
      showClearIcon: false,
      localInputText: {
        hasChanged: false,
        text: '',
      },
    }
  },
  directives: {
    dynamicColor,
  },
  props: {
    searchTerms: {
      type: String,
      default: '',
      required: true,
    },
  },
  methods: {
    clearSearch() {
      this.$emit('search-terms-submit', '')
      this.localInputText.text = ''
    },
    onSearchSubmit(value) {
      this.$emit('search-terms-submit', value)
      this.showClearIcon = value && value.length > 0
    },
    updateLocalSearchTerm(value) {
      this.localInputText.hasChanged = true
      this.localInputText.text = value
    },
  },
}
</script>
