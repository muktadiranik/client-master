<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap disable-pointer-events">
        <form class="c-form l-form" v-on:submit.prevent>
          <div class="c-box">
            <div class="c-box__header">
              <h6 class="o-h6">Create Finding</h6>
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
                  v-model="findingCreateForm.title"
                  placeholder="Enter the name of the finding"
                  name="finding_title"
                  id="finding_title"
                  class="o-input"
                />
              </div>

              <!-- Finding Vulnerability Types -->
              <div class="c-form__group l-form__group-inline">
                <label class="u-maxw-200-at-768">
                  <h6 class="o-h6">Vulnerability Types</h6>
                  <p class="o-text o-text--sm u-mt-5">Select the type of the potential issue you have discovered.</p>
                </label>
                <VulnerabilityTypeEditor
                  :report-vulnerability-types="findingCreateForm.vulnerabilityTypes"
                  @on-add-remove-vulnerability-type="addOrRemoveVulnerabilityType"
                />
              </div>

              <!-- Finding Details -->
              <div class="c-form__group l-form__group-inline">
                <label for="finding-details-editor" class="u-maxw-200-at-768">
                  <h6 class="o-h6">Details</h6>
                  <p class="o-text o-text--sm u-mt-5">Describe the vulnerability and its impact.</p>
                </label>
                <markdown-editor
                  v-model="findingCreateForm.details"
                  id="finding-details-editor"
                  :configs="markdownConfig"
                  placeholder="Enter details for this finding. Include endpoints exploited."
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
                  class="o-btn o-btn--outline o-btn--outline-coolgrey o-btn--rounded-sm"
                  @click.stop="cancelFinding()"
                >
                  <span>Cancel</span>
                </button>
                <button
                  id="submit-finding-button"
                  class="o-btn o-btn--primary o-btn--long o-btn--rounded-sm"
                  :disabled="submitDisabled"
                  @click.prevent="submitForm()"
                >
                  <span>Create Finding</span>
                </button>
              </div>
            </div>
            <!-- /.c-box__footer -->
          </div>
        </form>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import CaFileUpload from '@/modules/core/_components/ca-file-upload/CaFileUpload'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { FindingMixin } from '@/modules/findings/_mixins/finding'
import { ProgramsMixin } from '@/mixins/programs'
import VulnerabilityTypeEditor from '@/modules/vulnerability-types/components/VulnerabilityTypeEditor'
export default {
  name: 'FindingCreate',
  mixins: [BreadcrumbsMixin, FindingMixin, ProgramsMixin],
  data() {
    return {
      caFileAttachments: [],
      attachmentFile: File,
      findingUuid: '',
      findingCreateForm: {
        title: '',
        attachment: '',
        details: '',
        filename: '',
        vulnerabilityTypes: [],
      },
      program: {},
      markdownConfig: {
        status: false,
        spellChecker: false,
      },
      loading: false,
    }
  },
  props: {
    submission: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  components: {
    CaFileUpload,
    VulnerabilityTypeEditor,
  },
  methods: {
    async addOrRemoveVulnerabilityType(vulnerabilityType) {
      if (this.findingCreateForm.vulnerabilityTypes.includes(vulnerabilityType)) {
        this.findingCreateForm.vulnerabilityTypes = this.findingCreateForm.vulnerabilityTypes.filter(
          x => x !== vulnerabilityType
        )
      } else {
        this.findingCreateForm.vulnerabilityTypes.push(vulnerabilityType)
      }
    },
    async uploadAttachments() {
      const pendingAttachments = this.caFileAttachments.filter(x => x.pending)

      for (let i = 0, len = pendingAttachments.length; i < len; i++) {
        try {
          const index = this.caFileAttachments.findIndex(x => x.uuid === pendingAttachments[i].uuid)
          this.$set(this.caFileAttachments[index], 'loading', true)

          let finding = await this.actionUploadAttachment({
            formData: pendingAttachments[i].formData,
            findingUuid: this.findingUuid,
          })

          this.$set(this.caFileAttachments[index], 'pending', false)
          this.$delete(this.caFileAttachments, index)
          this.setExistingAttachments(finding.attachments)
        } catch (e) {
          continue
        }
      }
    },
    setExistingAttachments(attachments, pending) {
      for (let i = 0, len = attachments.length; i < len; i++) {
        const existingAttachments = this.caFileAttachments.findIndex(x => x.uuid === attachments[i].uuid)
        if (existingAttachments !== -1) {
          continue
        }

        let attachment = {
          ...attachments[i],
          pending: pending || false,
          loading: false,
          formData: new FormData(),
        }

        const attachmentUuid = attachments[i].uuid
        if (attachmentUuid) {
          attachment.formData.append('attachment_uuid', attachmentUuid)
        }

        this.$set(this.caFileAttachments, this.caFileAttachments.length, attachment)
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
          throw new Error('Pending attachment was removed.')
        }

        const payload = {
          attachmentUuid: data.uuid,
        }

        await this.actionDeleteAttachment(payload)
        this.$caAlert.create({ type: 'success', text: 'Attachment removed.' })

        this.$delete(this.caFileAttachments, index)
      } catch (e) {
        if (!data.pending) {
          this.$caAlert.error('Sorry, this attachement cannot be removed at this time.')
        }
      }
    },
    cancelFinding() {
      this.$router.go(-1)
    },
    async submitForm() {
      try {
        this.loading = true
        this.$solar.show()

        const submission = this.$route.params.submission

        const payload = {
          submission_uuid: submission ? submission.uuid : undefined,
          program_uuid: this.$route.params.uuid,
          details: this.findingCreateForm.details,
          title: this.findingCreateForm.title,
          vulnerability_types: this.findingCreateForm.vulnerabilityTypes,
        }

        const finding = await this.actionCreateFinding(payload)

        this.findingUuid = finding.uuid
        await this.uploadAttachments()

        this.$caAlert.create({
          type: 'success',
          text: 'Finding created.',
        })
      } catch (e) {
        if (this.findingUuid) {
          this.$caAlert.create({
            type: 'informational',
            text: 'Your finding was created, but one or more of your attachments failed to upload.',
          })
        } else {
          this.$caAlert.error('Sorry, there was an issue creating the finding.')
        }
      } finally {
        this.loading = false
        this.$solar.hide()

        if (this.findingUuid) {
          this.$router.push({
            name: 'Finding',
            params: { uuid: this.findingUuid },
          })
        }
      }
    },
    setDataFromProgram() {
      this.findingCreateForm.details = this.program.submission_template
    },
    setDataFromSubmission() {
      const submission = this.$route.params.submission
      this.findingCreateForm.title = `Finding for ${submission.title}`
      this.findingCreateForm.details = submission.details || this.program.submission_template
      this.findingCreateForm.vulnerabilityTypes = submission.vulnerability_types || []
      this.setExistingAttachments(submission.attachments, true)
    },
  },
  computed: {
    submitDisabled() {
      return this.loading || !this.findingCreateForm.title
    },
  },
  async mounted() {
    try {
      const response = await this.getProgram(this.$route.params.uuid)
      this.program = response.data
      document.title = `Inspectiv | ${this.program.title}`

      if (this.$route.params.submission) {
        this.setDataFromSubmission()
      } else {
        this.setDataFromProgram()
      }

      this.actionSetBreadcrumbs({
        parent: {
          route: this.$router.resolve({ name: 'Programs' }).route,
        },
        child: {
          title: this.program.title,
          route: this.$router.resolve({
            name: 'Program',
            params: { uuid: this.program.uuid },
          }),
          copyValue: this.program.uuid,
        },
        grandChild: {
          route: this.$route,
          title: 'New Finding',
        },
      })
    } catch (e) {
      this.$caAlert.error('Failed to load program')
    }
  },
}
</script>
