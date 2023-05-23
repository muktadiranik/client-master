<template>
  <div>
    <!-- view image modal -->
    <ca-modal v-if="showModal" :visible="showModal">
      <template slot="modal-content">
        <div div class="c-modal__inner c-modal__inner--lg">
          <div class="u-text-left">
            <!-- modal carousel header -->
            <div class="l-flex u-ai-center u-ml-20">
              <span class="o-text--500">{{ selectedAttachment.file_name }}</span>
              <i @click.prevent="downloadAttachement(selectedAttachment.url)" class="u-cursor-pointer o-text--gray u-ml-24 u-fs-16 fal fa-download"></i>
            </div>
            <span class="c-modal__close" @click="$emit('on-close-modal')"><i class="fal fa-times"></i></span>
          </div>
          <div class="u-height-full l-flex u-ai-center u-mt-30">
            <!-- left/right arrows -->
            <span @click="$emit('on-progress-carousel', -1)"><i class="u-mr-20 u-cursor-pointer fal fa-arrow-left u-fs-18 u-br-circle u-border u-p-16"></i></span>
            <!-- if image, display image, else show file icon -->
            <img v-if="fileIsImage" :src="selectedAttachment.url" :alt="selectedAttachment.file_name" class="u-ml-auto u-mr-auto u-height-full" />
            <i v-else class="fas fa-file-download u-width-full u-fs-68 o-text--gray"></i>
            <span @click="$emit('on-progress-carousel', 1)"><i class="u-ml-20 u-cursor-pointer fal fa-arrow-right u-fs-18 u-br-circle u-border u-p-16"></i></span>
          </div>
        </div>
      </template>
    </ca-modal>
  </div>
</template>

<script>
import CaModal from '@/modules/core/_components/ca-modal/CaModal.vue'

export default {
  components: { CaModal },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    selectedAttachment: {
      type: Object,
    },
  },
  data() {
    return {}
  },
  computed: {
    fileIsImage() {
      const fileTypes = ['png', 'jgp', 'jpeg', 'jpg']
      return fileTypes.some(suffix => this.selectedAttachment.file_name.toLowerCase().endsWith(suffix))
    },
  },

  methods: {
    downloadAttachement(url) {
      window.location.assign(url)
    },
  },
}
</script>
