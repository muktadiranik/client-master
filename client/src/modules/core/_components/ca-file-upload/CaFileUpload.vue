<template>
  <div>
    <ca-file-upload-drag-overlay v-show="dragging" />
    <!-- Add Attachment Button -->
    <div class="o-add-attachment">
      <div class="o-add-attachment__label u-fd-column u-d-f u-ai-center">
        Drag and drop files here or
        <label class="o-btn o-btn--sm o-btn--outline-primary o-btn--rounded" for="file-drop" v-dynamic-color>
          Browse
        </label>
      </div>
      <p class="u-fs-10 o-text--gray u-text-italic u-mt-8">
        You can attach up to 20 files. Each file can be <b>100MB</b> or less.
      </p>
      <input
        type="file"
        class="u-hide-input"
        id="file-drop"
        name="file-drop"
        @change="processFiles($event, true)"
        ref="caFileInput"
        multiple
      />
    </div>
    <!-- Attachment List -->
    <div class="u-mt-24" v-if="attachments.length">
      <div class="c-box">
        <div class="c-box__header">
          <div class="c-box__header__text">Attachments</div>
        </div>
        <div class="c-box__body u-p-0">
          <ca-file-upload-attachments
            :allow-deleting="true"
            :attachments="attachments"
            @on-delete-attachment="deleteAttachment"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CaFileUploadDragOverlay from '@/modules/core/_components/ca-file-upload/CaFileUploadDragOverlay'
import CaFileUploadAttachments from '@/modules/core/_components/ca-file-upload/CaFileUploadAttachments'
import { dynamicColor } from '@/directives/dynamic-color'

export default {
  name: 'CaFileUpload',
  components: {
    CaFileUploadDragOverlay,
    CaFileUploadAttachments,
  },
  directives: {
    dynamicColor,
  },
  props: {
    attachments: {
      type: Array,
      default: () => [],
    },
    binaryFormData: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      dragging: false,
      lastTarget: null,
    }
  },
  methods: {
    processFiles(e, click) {
      e.preventDefault()
      this.dragging = false

      const files = Array.from(click ? e.target.files : e.dataTransfer.files)

      files.forEach((file) => {
        let formData = new FormData()
        formData.append('attachment', file, file.name)
        formData.append('filename', file.name)

        this.$emit('on-file-drop', { formData: formData, files: files })
        this.$refs.caFileInput.value = ''
      })
    },
    onDrop(e) {
      this.dragging = false
      e.preventDefault()
      this.processFiles(e)
    },
    onDragLeave(e) {
      e.preventDefault()
      if (e.target === this.lastTarget) {
        this.dragging = false
      }
    },
    onDragEnter(e) {
      this.lastTarget = e.target
      this.dragging = true
    },
    deleteAttachment(attachment) {
      this.$emit('on-delete-attachment', attachment)
    },
  },
  mounted() {
    window.addEventListener('dragenter', this.onDragEnter)
    window.addEventListener('dragleave', this.onDragLeave)
    window.addEventListener('dragover', this.onDragOver)
    window.addEventListener('drop', this.onDrop)
  },
  beforeDestroy() {
    window.removeEventListener('dragenter', this.onDragEnter)
    window.removeEventListener('dragleave', this.onDragLeave)
    window.removeEventListener('dragover', this.onDragOver)
    window.removeEventListener('drop', this.onDrop)
  },
}
</script>

<style lang="scss">
ul.attachmentLists {
  font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
  padding: 0;

  .fileType {
    color: #999;
  }

  .fileName {
    color: #f15555;
    margin: 0 10px;
  }

  .fileSize {
    color: #999;
  }

  & > li {
    cursor: pointer;

    .fa-trash {
      display: none;
      margin-left: 30px;
      font-weight: 900;
    }

    &:hover {
      .fa-trash {
        display: inline-block;
      }
    }
  }
}
</style>
