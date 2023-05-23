<template>
  <main class="c-site-main" v-if="showFindingEditor">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <form class="c-form l-form" v-on:submit.prevent>
          <div class="c-box">
            <div class="c-box__header">
              <h6 class="o-h6">Edit Finding</h6>
            </div>
            <!-- /.c-box__header -->
            <div class="c-box__body l-grid l-grid--row-gap-30">
              <!-- Finding Title -->
              <div class="c-form__group l-form__group-inline">
                <label for="finding_title" class="u-maxw-200-at-768">
                  <h6 class="o-h6">Title</h6>
                  <p class="o-text o-text--sm u-mt-5">Help us get an idea of what this vulnerability is about.</p>
                </label>
                <input
                  type="text"
                  v-model="findingEditForm.title"
                  placeholder="Enter the name of the finding"
                  name="finding_title"
                  id="finding_title"
                  class="o-input"
                />
              </div>

              <!-- Finding Vulnerability Type -->
              <div class="c-form__group l-form__group-inline">
                <label class="u-maxw-200-at-768">
                  <h6 class="o-h6">Vulnerability Types</h6>
                  <p class="o-text o-text--sm u-mt-5">Select the type of the potential issue you have discovered.</p>
                </label>
                <VulnerabilityTypeEditor
                  :report-vulnerability-types="findingEditForm.vulnerabilityTypes"
                  @on-add-vulnerability-type="addVulnerabilityType"
                />
              </div>

              <!-- Finding Details -->
              <div class="c-form__group l-form__group-inline">
                <label for="finding-details-editor" class="u-maxw-200-at-768">
                  <h6 class="o-h6">Details</h6>
                  <p class="o-text o-text--sm u-mt-5">Describe the vulnerability and its impact.</p>
                </label>
                <markdown-editor
                  v-if="finding && finding.uuid"
                  v-model="findingEditForm.details"
                  id="finding-details-editor"
                  :configs="markdownConfig"
                  placeholder="Enter details for this finding."
                  name="finding_details"
                />
              </div>

              <!-- Finding Attachments -->
              <div class="c-form__group l-form__group-inline">
                <label class="u-maxw-200-at-768">
                  <h6 class="o-h6">Attachments</h6>
                  <p class="o-text o-text--sm u-mt-5">
                    Attach proof-of-concept scripts, screenshots, screen recordings, etc.
                  </p>
                </label>
                <ca-file-upload
                  :attachments="caFileAttachments"
                  :binary-form-data="true"
                  @on-file-drop="caFileOnFileDrop"
                  @on-delete-attachment="caFileOnDeleteAttachment"
                />
              </div>
            </div>
            <!-- /.c-box__body -->
            <div class="c-box__footer">
              <div class="u-flex-buttons u-jc-sb">
                <button
                  @click.stop="cancelFinding()"
                  class="o-btn o-btn--outline o-btn--outline-coolgrey o-btn--rounded-sm"
                >
                  <span>Cancel</span>
                </button>
                <button
                  id="submit-finding-button"
                  class="o-btn o-btn--primary o-btn--rounded-sm o-btn--long"
                  :disabled="submitDisabled || !findingHasUpdates || loading"
                  @click.prevent="submitForm()"
                >
                  <span>Update Finding</span>
                </button>
              </div>
            </div>
            <!-- /.c-box__footer -->
          </div>
          <!-- /.c-box -->
        </form>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import CaFileUpload from '@/modules/core/_components/ca-file-upload/CaFileUpload'
import { FindingEditMixin } from '@/modules/findings/_mixins/finding-edit'
import { ProgramsMixin } from '@/mixins/programs'
import VulnerabilityTypeEditor from '@/modules/vulnerability-types/components/VulnerabilityTypeEditor'

export default {
  name: 'FindingEdit',
  mixins: [BreadcrumbsMixin, FindingEditMixin, ProgramsMixin],
  data() {
    return {
      caFileAttachments: [],
      attachmentFile: File,
      pendingAttachments: [],
      files: [],
      findingEditForm: {
        title: '',
        attachment: '',
        details: '',
        filename: '',
        vulnerabilityTypes: [],
      },
      markdownConfig: {
        status: false,
        spellChecker: false,
      },
      loading: false,
      showFindingEditor: false,
    }
  },
  components: {
    CaFileUpload,
    VulnerabilityTypeEditor,
  },
  methods: {
    addOrRemoveVulnerabilityType(vulnerabilityType) {
      const index = this.findingEditForm.vulnerabilityTypes.findIndex(x => x === vulnerabilityType)
      if (index === -1) {
        this.findingEditForm.vulnerabilityTypes.push(vulnerabilityType)
      } else {
        this.findingEditForm.vulnerabilityTypes.splice(vulnerabilityType, 1)
      }
    },
    async uploadAttachments() {
      const pendingAttachments = this.caFileAttachments.filter(x => x.pending)

      for (let i = 0, len = pendingAttachments.length; i < len; i++) {
        try {
          const index = this.caFileAttachments.findIndex(x => x.uuid === pendingAttachments[i].uuid)
          this.$set(this.caFileAttachments[index], 'loading', true)

          const response = await this.actionUploadAttachment({
            formData: pendingAttachments[i].formData,
            findingUuid: this.$route.params.findingUuid,
          })

          this.finding = { ...response.data }

          this.$delete(this.caFileAttachments, index)
          this.setExistingAttachments(response.data.attachments)
        } catch (e) {
          continue
        }
      }
    },
    setExistingAttachments(attachments) {
      for (let i = 0, len = attachments.length; i < len; i++) {
        const existingAttachments = this.caFileAttachments.findIndex(x => x.uuid === attachments[i].uuid)
        if (existingAttachments !== -1) {
          continue
        }

        this.$set(this.caFileAttachments, this.caFileAttachments.length, {
          ...attachments[i],
          pending: false,
          loading: false,
          formData: new FormData(),
        })
      }
    },
    caFileOnFileDrop(data) {
      const formData = data.formData
      for (let entry of formData.entries()) {
        const file = entry[1]
        if (!file.name || !file.lastModified) {
          continue
        }

        const newFile = {
          uuid: file.name.toString(),
          file_name: file.name.toString(),
          date_created: new Date().toString(),
          file_size: file.size.toString(),
          url: '',
          formData: formData,
          pending: true,
          loading: false,
        }

        this.$set(this.caFileAttachments, this.caFileAttachments.length, newFile)
      }
    },
    async caFileOnDeleteAttachment(data) {
      try {
        const index = this.caFileAttachments.findIndex(x => x.uuid === data.uuid)
        this.$set(this.caFileAttachments[index], 'loading', true)
        if (data.pending) {
          this.$delete(this.caFileAttachments, index)
          this.$caAlert.success('Attachment removed.')
          throw new Error('Pending attachment was removed.')
        }

        const payload = {
          findingUuid: this.$route.params.findingUuid,
          attachmentUuid: data.uuid,
        }

        const response = await this.actionDeleteAttachment(payload)
        this.$caAlert.success('Attachment removed.')

        this.finding = { ...response.data }
        this.$delete(this.caFileAttachments, index)
      } catch (e) {
        if (!data.pending) {
          this.$caAlert.error('Sorry, this attachement cannot be removed at this time.')
        }
      }
    },
    cancelFinding() {
      this.$router.push({
        name: 'Finding',
        params: { uuid: this.finding.uuid },
      })
    },
    async submitForm() {
      const payload = {
        uuid: this.finding.uuid,
        program_uuid: this.finding.program.uuid,
        details: this.findingEditForm.details,
        terms: true,
        title: this.findingEditForm.title,
        attachment: '',
        filename: '',
        status: this.finding.status,
        resolution: this.finding.resolution,
        vulnerability_types: this.findingEditForm.vulnerabilityTypes,
      }

      try {
        this.$solar.show()
        this.loading = true

        await this.actionEditFinding(payload)
        await this.uploadAttachments()

        this.$caAlert.success('Finding updated.')
        this.$router.push({
          name: 'Finding',
          params: { uuid: this.$route.params.findingUuid },
        })
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to update finding'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
        this.loading = false
      }
    },
    async loadFinding() {
      this.files = []
      this.$solar.show()
      this.loading = true
      try {
        await this.actionLoadFinding(this.$route.params.findingUuid)

        this.findingEditForm.details = this.finding.details
        this.findingEditForm.title = this.finding.title
        Object.assign(this.findingEditForm.vulnerabilityTypes, this.finding.vulnerability_types)
        this.setExistingAttachments(this.finding.attachments)
      } catch (e) {
        this.$caAlert.error('Sorry, there was an issue loading this finding.')
      } finally {
        this.$solar.hide()
        this.loading = false
      }
    },
    addVulnerabilityType(vuln) {
      this.findingEditForm.vulnerabilityTypes = [vuln]
    },
  },
  computed: {
    submitDisabled() {
      return !this.findingEditForm.title
    },
    findingHasUpdates() {
      return (
        this.finding.title !== this.findingEditForm.title ||
        this.finding.details !== this.findingEditForm.details ||
        (this.caFileAttachments && this.caFileAttachments.length) ||
        this.vulnerabilityTypesUpdated
      )
    },
    disableEditing() {
      return !this.finding || !this.finding.uuid
    },
    vulnerabilityTypesUpdated() {
      let findingVulnTypes = this.finding.vulnerability_types
      let editedVulnTypes = this.findingEditForm.vulnerabilityTypes

      findingVulnTypes = findingVulnTypes.sort((a, b) => b.name - a.name)
      editedVulnTypes = editedVulnTypes.sort((a, b) => b.name - a.name)
      return JSON.stringify(findingVulnTypes) !== JSON.stringify(editedVulnTypes)
    },
  },
  async mounted() {
    this.findingUuid = this.$route.params.findingUuid

    await this.loadFinding()
    document.title = `Inspectiv | ${this.finding.title}`
    if (this.disableEditing) {
      this.$router.push({
        path: '/findings',
      })
    } else {
      this.showFindingEditor = true
    }

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Findings' }).route,
      },
      child: {
        title: this.finding.title,
        route: this.$router.resolve({
          name: 'Finding',
          params: { uuid: this.finding.uuid },
        }).route,
        copyValue: this.finding.uuid,
      },
      grandChild: {
        title: 'Edit',
        route: this.$route,
      },
    })
  },
}
</script>
