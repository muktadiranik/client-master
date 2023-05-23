<template>
  <ul class="c-breadcrumb u-fg-1" v-if="breadcrumbs">
    <li :class="{ 'has-child': hasChild }">
      <input v-if="child" id="childParam" type="hidden" :value="child.copyValue" />
      <router-link :to="parent.route" v-if="parent.route">{{ parent.title || parent.route.name }}</router-link>
      <span v-else>{{ parent.title }}</span>
    </li>
    <li v-if="child" :class="{ 'has-child': hasGrandChild }">
      <router-link ref="uid" :to="child.route" v-if="child.route">{{ child.title }}</router-link>
      <span ref="uid" v-else>{{ child.title }}</span>
      <span
        v-if="hasChild && child.route && child.copyValue"
        data-title="Copy id"
        ref="copyIcon"
        class="c-copy-to-clipboard u-cursor-pointer u-ml-5"
        @mousemove="onMouseMove"
        @click="copyToClipboard(false)"
      >
        <i class="fas fa-copy"></i>
      </span>
    </li>
    <li v-if="grandChild">
      <input v-if="grandChild.copyValue" id="grandChildParam" type="hidden" :value="grandChild.copyValue" />
      <router-link ref="uid" :to="grandChild.route" v-if="grandChild.route">{{ grandChild.title }}</router-link>
      <span ref="uid" v-else>{{ grandChild.title }}</span>
      <span
        v-if="grandChild.copyValue"
        data-title="Copy id"
        ref="copyIcon"
        class="c-copy-to-clipboard u-cursor-pointer u-ml-5"
        @mousemove="onMouseMove"
        @click="copyToClipboard(true)"
      >
        <i class="fas fa-copy"></i>
      </span>
    </li>
  </ul>
</template>

<script>
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'

export default {
  name: 'c-breadcrumb',
  mixins: [BreadcrumbsMixin],
  data() {
    return {}
  },
  methods: {
    onMouseMove() {
      if (!this.$refs.copyIcon) {
        return
      }
      this.$refs.copyIcon.setAttribute('data-title', 'Copy id')
    },
    copyToClipboard(grandChild) {
      const paramId = grandChild ? 'grandChild' : 'child'
      let childParam = document.querySelector(`#${paramId}Param`)
      childParam.setAttribute('type', 'text')
      childParam.select()

      try {
        document.execCommand('copy')
        this.$caAlert.success('Copied to clipboard')
      } catch (err) {
        this.$caAlert.success('Failed to copy to clipboard')
      }
      childParam.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    },
  },
}
</script>
