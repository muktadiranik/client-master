<template>
  <div class="c-modal" :class="{ 'u-hidden': !visible }">
    <div class="c-modal__inner u-br-3">
      <div class="c-modal__header">
        <h6 class="o-h6 u-color-white">Publish Finding?</h6>
        <i class="fal fa-times u-font-150 u-cursor-pointer" @click="cancelButtonClick"></i>
      </div>
      <div class="c-modal__body">
        <div class="c-copy">
          <p>Are you sure you want to create a finding from this submission?</p>
          <h6>Requirements:</h6>
          <ul>
            <li>Check spelling and formatting</li>
            <li>Verify submission title is clear and descriptive</li>
            <li>Make sure submission body is clear and concise</li>
            <li>Make sure all attachments are hi-res and useful</li>
            <li>Verify attachment file names are clear and descriptive</li>
            <li>Verify attached photos do not include unnecessary content</li>
          </ul>
          <p>Click the Create Finding button below to create a client-visible finding.</p>
        </div>
      </div>
      <div class="c-modal__footer">
        <div class="u-flex-buttons u-jc-sb">
          <button
            class="o-btn o-btn--outline o-btn--outline-coolgrey o-btn--sm o-btn--rounded-sm"
            @click="cancelButtonClick"
          >
            <span>Cancel</span>
          </button>
          <button
            class="o-btn o-btn--primary o-btn--sm o-btn--rounded-sm o-btn--long"
            :disabled="loading"
            @click="publishFindingClick"
          >
            <span>Publish Finding</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublishFindingPanel',
  data() {
    return {}
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  computed: {},
  methods: {
    cancelButtonClick() {
      this.$emit('cancel-click')
    },
    publishFindingClick() {
      this.$emit('on-publish-finding')
    },
  },
}
</script>
