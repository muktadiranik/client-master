<template>
  <div class="c-box u-p-0">
    <div class="c-box__header">
      <h6 class="o-h6">Submission Template</h6>
    </div>
    <!-- /.c-box__header -->
    <div class="c-box__body">
      <form class="c-form">
        <label class="c-form__label c-form__label--small">Details</label>
        <markdown-editor
          id="submissionTemplate"
          name="submissionTemplate"
          :configs="markdownConfig"
          @input="submissionTemplateChanged"
          :value="submissionTemplate"
        >
        </markdown-editor>
      </form>
      <div class="u-d-f u-jc-fe">
        <button type="button" class="o-btn o-btn--link o-btn--no-padding u-font-12 u-minw-auto" @click="resetTemplate">
          Reset to default
        </button>
      </div>
    </div>
    <!-- /.c-box__body -->
  </div>
  <!-- /.c-box -->
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { MarkdownMixin } from '@/mixins/markdown'

export default {
  name: 'SubmissionTemplate',
  mixins: [AccountMixin, MarkdownMixin],
  data() {
    return {
      submissionTemplateAlertId: 'submission-template-alert',
      submissionTemplateAlertShowing: false,
      submissionTemplate: '',
      markdownConfig: {
        status: false,
        spellChecker: false,
      },
    }
  },
  props: {
    program: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {},
  methods: {
    createSubmissionTemplateAlert() {
      this.$caAlert.create({
        id: this.submissionTemplateAlertId,
        closable: false,
        buttons: [
          {
            text: 'Revert Changes',
            callback: () => {
              this.submissionTemplate = this.program.submission_template
              this.submissionTemplateAlertShowing = false
            },
          },
          {
            text: 'Save',
            callback: () => {
              this.$emit('on-save-submission-template', this.submissionTemplate)
              this.$caAlert.close(this.submissionTemplateAlertId)
              this.submissionTemplateAlertShowing = false
            },
          },
        ],
        customClass: this.getUserTypeClass(),
        position: 'bottom',
        container: 'CaAlerts',
        text: 'Would you like to update the submission template for this program?',
        type: 'FormUpdate',
      })

      this.submissionTemplateAlertShowing = true
    },
    submissionTemplateChanged(markdown) {
      this.submissionTemplate = markdown
      const originalTemplate = this.program.submission_template

      if (!this.equalIgnoringNewlines(this.submissionTemplate, originalTemplate)) {
        this.createSubmissionTemplateAlert()
        return
      }

      this.$caAlert.close(this.submissionTemplateAlertId)
    },
    resetTemplate() {
      const dialogId = 'reset-template-confirmation'
      const defaultTemplate =
        '# Description\nEnter a description of the vulnerability. Include URLs and any other useful information.\n\n# Steps to Reproduce\n1. Enter steps to reproduce the issue\n\n# Remediation\nThis is an example remediation'

      this.$caDialog.confirm({
        id: dialogId,
        title: 'Reset to default?',
        text: 'Are you sure you want to reset the submission template to default settings?',
        confirmButtonText: 'Reset to Default',
        confirmCallback: () => {
          this.submissionTemplate = defaultTemplate
          this.$emit('on-reset-submission-template', this.submissionTemplate)
        },
        cancelCallback: () => {
          this.$caDialog.close(dialogId)
        },
        dialogClass: this.getUserTypeClass(),
      })
    },
  },
  mounted() {
    this.submissionTemplate = this.program.submission_template
  },
}
</script>
