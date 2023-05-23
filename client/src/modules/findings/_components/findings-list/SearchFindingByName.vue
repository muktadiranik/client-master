<template>
  <div class="section-vulnerability-type">
    <div class="u-position-relative">
      <div class="c-input-icon c-input-icon--sm c-input-icon--left">
        <input
          class="o-input with-value"
          placeholder="Search by title..."
          @input="updateLocalSearchTerm($event.target.value)"
          v-on:keyup.enter="searchByTitle($event.target.value)"
          :value="localInputText.hasChanged ? localInputText.text : inputText"
        />
        <i class="far fa-search c-clear-input__icon" @click="searchByTitle(localInputText.text)"></i>
        <i
          class="far fa-times-circle c-clear-input__icon"
          v-bind:style="{ right: '3em' }"
          @click="clearSearchText()"
          v-show="inputText !== ''"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFindingByName',
  comonents: {},
  data() {
    return {
      localInputText: {
        hasChanged: false,
        text: '',
      },
    }
  },
  props: {
    inputText: {
      required: true,
      type: String,
    },
  },
  methods: {
    searchByTitle(value) {
      this.$emit('apply-search-text', value)
    },
    clearSearchText() {
      this.localInputText.text = ''
      this.$emit('clear-search-text')
    },
    updateLocalSearchTerm(value) {
      this.localInputText.hasChanged = true
      this.localInputText.text = value
    },
  },
}
</script>
