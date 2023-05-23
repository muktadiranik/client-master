<template>
  <div class="ca-tag-input" v-dynamic-color>
    <label :for="inputName" class="form__label" v-show="label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        v-show="!readonly"
        autocomplete="off"
        type="text"
        class="form__control"
        :name="inputName"
        :id="inputName"
        :value="inputText"
        :placeholder="placeholder"
        @click="onTextInputClick"
        @input="onTextInput($event.target.value)"
        @keydown.up.prevent="onTextInputArrowKey($event)"
        @keydown.down.prevent="onTextInputArrowKey($event)"
        @keydown.enter.prevent="onTextInputEnterKeyDown"
      />
    </div>
    <transition-group v-if="tags && tags.length > 0" name="tag" tag="ul" class="tag-list" :class="tagListClass">
      <li class="tag-list__tag" v-for="(tag, index) in tags" :key="`${inputName}-tag-${index}`">
        <div>
          <span>
            {{ tag.name }}
            <i v-if="!readonly" class="fal fa-times" @click="removeTag(tag)"></i>
          </span>
        </div>
      </li>
    </transition-group>
    <div class="dropdownMenu center" v-if="showSuggestions" v-click-outside="onSuggestionsClickOutside">
      <div class="dropdownMenuHeader">
        <h4 class="title">Vulnerability Types</h4>
      </div>
      <ul
        class="option-list"
        @keydown.up.prevent="onTextInputArrowKey($event)"
        @keydown.down.prevent="onTextInputArrowKey($event)"
      >
        <li
          v-for="(suggestion, index) in suggestions"
          :class="{ focused: focusedSuggestion && focusedSuggestion === suggestion }"
          :key="`${inputName}-tag-${index}`"
          :id="suggestion.uuid"
          @click="onSuggestionClick(suggestion)"
        >
          <div>
            <span>{{ suggestion.name }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { dynamicColor } from '@/directives/dynamic-color'
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'CaQueryInput',
  directives: {
    dynamicColor,
    clickOutside,
  },
  props: {
    name: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
      required: false,
    },
    suggestions: {
      type: Array,
      default: () => [],
      required: false,
    },
    tags: {
      type: Array,
      default: () => [],
      required: false,
    },
    showSuggestions: {
      type: Boolean,
      default: false,
      required: true,
    },
    inputText: {
      type: String,
      default: '',
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      defaultName: 'text-input-' + Date.now(),
      focusedSuggestion: undefined,
    }
  },
  computed: {
    inputName() {
      return this.name || this.defaultName
    },
    tagListClass() {
      return { readonly: this.readonly }
    },
  },
  methods: {
    shiftSuggestionFocusNext(currentIndex) {
      if (currentIndex >= this.suggestions.length - 1) {
        this.focusedSuggestion = this.suggestions[0]
        return
      }

      this.focusedSuggestion = this.suggestions[currentIndex + 1]
    },
    shiftSuggestionFocusPrevious(currentIndex) {
      if (currentIndex === 0) {
        this.focusedSuggestion = this.suggestions[this.suggestions.length - 1]
        return
      }

      this.focusedSuggestion = this.suggestions[currentIndex - 1]
    },
    onTextInputArrowKey(e) {
      if (!this.suggestions || !this.suggestions.length) {
        return
      }

      const cur = this.suggestions.findIndex(x => x === this.focusedSuggestion)
      switch (e.keyCode) {
        case 38:
          this.shiftSuggestionFocusPrevious(cur)
          return
        case 40:
          this.shiftSuggestionFocusNext(cur)
      }
    },
    onSuggestionClick(suggestion) {
      this.$emit('on-suggestion-selected', suggestion)
    },
    onSuggestionsClickOutside() {
      this.$emit('on-suggestions-click-outside')
    },
    onTextInput(val) {
      this.$emit('on-text-input', val)
    },
    onTextInputClick() {
      this.$emit('on-text-input-click')
    },
    onTextInputEnterKeyDown() {
      if (!this.focusedSuggestion) {
        return
      }

      this.$emit('on-suggestion-selected', this.focusedSuggestion)
    },
    removeTag(tag) {
      this.$emit('on-remove-tag', tag)
    },
  },
  watch: {
    suggestions(newVal, oldVal) {
      if (!newVal || !newVal.length) {
        this.focusedSuggestion = undefined
        return
      }

      if (this.focusedSuggestion === undefined || !newVal.includes(this.focusedSuggestion)) {
        this.focusedSuggestion = newVal[0]
      }
    },
  },
}
</script>
