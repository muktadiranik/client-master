<template>
  <div class="c-form__group">
    <label class="c-form__label c-form__label--small">
      <span v-show="title">{{ title }}</span>
    </label>
    <div class="u-overflow-hidden">
      <prism-editor
        v-if="expanded"
        id="editor"
        v-model="codeSet"
        language="html"
        emit-events
        line-numbers
      ></prism-editor>
    </div>
  </div>
</template>

<script>
import PrismEditor from 'vue-prism-editor'

export default {
  name: 'CodeEditor',
  components: { PrismEditor },
  props: {
    fieldName: {
      type: String,
      default: '',
      required: true,
    },
    code: {
      type: String,
      default: '',
      required: true,
    },
    title: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      expanded: true,
    }
  },
  computed: {
    codeSet: {
      get() {
        return this.code
      },
      set(val) {
        this.$emit('on-code-updated', this.fieldName, val)
      },
    },
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded
    },
  },
}
</script>
