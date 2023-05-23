<template>
  <div>
    <ul v-if="attachments">
      <li
        class="c-attachment"
        v-for="(attachment, index) in attachments"
        :key="`attachment-${index}`"
        @click="onSelectFile(index, attachment)"
      >
        <div class="c-attachment__details u-mr-15">
          <span class="c-attachment__name" v-if="attachment && attachment.url">
            {{ attachment.file_name }}
          </span>
          <span class="c-attachment__name" v-if="attachment && !attachment.url" v-dynamic-color>
            {{ attachment.file_name }} at {{ getLastModified(attachment.date_created) }}
          </span>
          <span class="c-attachment__size" v-if="attachment">
            {{ getFormattedFileSize(attachment.file_size) }}
          </span>
        </div>
        <div class="c-attachment__actions">
          <i class="far fa-circle-notch fa-spin c-attachment__loading-icon" v-if="attachment.loading"></i>
          <i
            v-else-if="allowDeleting"
            class="fal fa-trash-alt c-attachment__remove-icon"
            @click="deleteAttachment(attachment)"
          ></i>
        </div>
      </li>
    </ul>
    <ca-attachment-preview-carousel
      :showModal="showModal"
      @on-progress-carousel="onProgressCarousel"
      @on-close-modal="onCloseModal"
      :selectedAttachment="selectedAttachment"
    />
  </div>
</template>

<script>
import CaFileMixins from '@/modules/core/_components/ca-file-upload/_mixins/ca-file-mixins'
import { dynamicColor } from '@/directives/dynamic-color'
import CaAttachmentPreviewCarousel from '@/modules/core/_components/ca-file-upload/CaAttachmentPreviewCarousel'

export default {
  name: 'CaFileUploadAttachments',
  mixins: [CaFileMixins],
  directives: {
    dynamicColor,
  },
  components: {
    CaAttachmentPreviewCarousel,
  },
  props: {
    attachments: {
      type: Array,
      default: () => [],
      required: true,
    },
    allowDeleting: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      selectedFileIndex: 0,
      selectedAttachment: {
        file_name: '',
        file_url: '',
      },
    }
  },
  methods: {
    deleteAttachment(attachment) {
      this.$emit('on-delete-attachment', attachment)
    },
    onSelectFile(index, attachment) {
      this.showModal = true
      this.selectedFileIndex = index
      this.selectedAttachment = attachment
    },
    onCloseModal() {
      this.showModal = false
      this.selectedFileIndex = 0
      this.selectedAttachment = {
        file_name: '',
        file_url: '',
      }
    },
    onProgressCarousel(change) {
      // modulo arithmetic around possible index values
      this.selectedFileIndex =
        (((this.selectedFileIndex + change) % this.attachments.length) + this.attachments.length) %
        this.attachments.length

      this.selectedAttachment = this.attachments[this.selectedFileIndex]
    },
  },
  computed: {
    fileiconClass() {
      return this.getFileIconClass()
    },
  },
}
</script>
