<template>
  <div class="c-alert c-alert--warning c-alert--padding-lg">
    <div class="u-space-between u-ai-center u-nm-5">
      <div class="u-d-f u-ai-center u-m-5">
        <i class="far fa-info-circle u-font-18 u-mr-10"></i>
        <span>This finding is a draft and is hidden to application owners.</span>
      </div>
      <button
        type="button"
        class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm u-m-5"
        :disabled="loading"
        @click="publishFindingClick"
      >
        Publish Finding
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublishFindingBar',
  props: {
    loading: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    publishFindingClick() {
      this.$emit('on-publish-finding-click')
    },
  },
}
</script>
