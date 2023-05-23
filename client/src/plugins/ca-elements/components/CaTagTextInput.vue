<template>
  <div>
    <transition-group name="tag" tag="ul" class="c-badge-list u-fd-row">
      <li v-for="(tag, index) in tags" :key="`${tag}-${index}`">
        <div
          class="c-badge c-badge--primary-light c-badge--btn-xs u-d-if u-ai-center"
          :class="{ loading: tag.loading }"
        >
          <span class="u-mr-10">{{ tag.text }}</span>
          <i class="fal fa-times u-cursor-pointer" @click="onTagClick(tag)"></i>
        </div>
      </li>
    </transition-group>
    <div class="u-mt-10">
      <input
        type="text"
        class="o-input"
        :placeholder="placeholder"
        :value="textValue"
        @input="onTextInput($event.target.value)"
        @keydown.enter.prevent="onTextInputEnterKeyDown"
        @click="onTextInputClick"
      />
    </div>
  </div>
</template>

<script>
import { dynamicColor } from '@/directives/dynamic-color'

export default {
  name: 'CaTagTextInput',
  directives: { dynamicColor },
  props: {
    placeholder: {
      type: String,
      default: '',
      required: false,
    },
    textValue: {
      type: String,
      default: '',
      required: true,
    },
    tags: {
      type: Array,
      default: () => [],
      required: true,
    },
    textInputStyle: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    onTextInput(val) {
      this.$emit('on-text-input', val)
    },
    onTextInputClick() {
      this.$emit('on-text-input-click')
    },
    onTextInputEnterKeyDown() {
      this.$emit('on-text-input-enter-key-down')
    },
    onTagClick(tag) {
      this.$emit('on-tag-click', tag)
    },
  },
}
</script>

<style lang="scss">
.tag-enter-active,
.tag-leave-active {
  transition: all 200ms;
}
.tag-enter {
  opacity: 0;
  transform: translateY(50%);
}
.tag-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}
</style>
