<template>
  <div class="o-dropzone">
    <div class="o-dropzone__inner">
      <i class="fas fa-cloud-upload o-dropzone__icon"></i>
      <div class="o-dropzone__text u-mt-15">{{ overlayText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaFileUploadDragOverlay',
  props: {
    overlayText: {
      type: String,
      default: 'Drop to attach file(s)',
      required: false,
    },
  },
  data() {
    return {}
  },
}
</script>
