<template>
  <div>
    <div v-if="userIsProgramManager()">
      <ul class="c-submission-pm-toolbar">
        <li class="u-d-f u-ai-center u-jc-center">
          <div class="u-d-f u-ai-center u-mr-10 u-font-14 u-color-dark">
            <i class="far fa-shield-check u-mr-10"></i>
            <span class="u-fw-700">Status:</span>
          </div>
          <div class="c-dropdown-group">
            <CustomSelectDropdown
              v-if="userIsProgramManager() && submissionStatuses && submissionSelectedStatus"
              title="status"
              :selected-option="submissionSelectedStatus"
              @on-option-clicked="updateStatusField"
              :options="submissionStatuses"
            />
            <CustomSelectDropdown
              v-if="
                submissionIsClosed && userIsProgramManager() && submissionResolutions && submissionSelectedResolution
              "
              title="resolution"
              :selected-option="submissionSelectedResolution"
              @on-option-clicked="updateResolutionField"
              :options="filteredSubmissionResolutions"
            />
          </div>
        </li>
        <li class="u-d-f u-ai-center u-jc-center">
          <div class="u-d-f u-ai-center u-mr-10 u-font-14 u-color-dark">
            <i class="far fa-bug u-mr-10"></i>
            <span class="u-fw-700">Severity:</span>
          </div>
          <CustomSelectDropdown
            :selected-option="submissionSelectedPriority"
            v-if="userIsProgramManager() && submissionPriorities && submissionSelectedPriority"
            @on-option-clicked="updatePriorityField"
            title="severity"
            :options="submissionPriorities"
          />
        </li>
        <li class="u-d-f u-ai-center u-jc-center" v-if="showPayoutDisplay">
          <div class="u-d-f u-ai-center u-mr-10 u-font-14 u-color-dark">
            <i class="far fa-usd-circle u-mr-10"></i>
            <span class="u-fw-700">Bounty:</span>
          </div>
          <div>
            <div class="o-input-group o-input-group--xs o-input-group--prepend">
              <div class="o-input-group__text">$</div>
              <input
                type="text"
                class="o-input o-input--xs o-input--border u-maxw-70"
                :value="submission.payout"
                @change="updatePayout($event.target.value)"
              />
            </div>
          </div>
        </li>
      </ul>
    </div>

    <CompleteSubmissionPanel
      :submission="submission"
      :visible="showCompleteSubmissionPanel"
      @on-complete-submission="completeSubmission"
      @cancel-click="onCompleteSubmissionCancelClick"
    />
  </div>
</template>

<script>
import { clickOutside } from '@/directives/click-outside'
import { AccountMixin } from '@/mixins/account'
import { SubmissionMixin } from '@/mixins/submission'
import DateTimeFilters from '@/filters/date-time-filters'
import CustomSelectDropdown from './CustomSelectDropdown'
import {
  STORE_KEY,
  DELETE_SUBMISSION,
  EDIT_SUBMISSION,
  EDIT_SUBMISSION_VULNERABILITY_TYPES,
  GET_SUBMISSION_PRIORITY,
  GET_SUBMISSION_RESOLUTION,
  GET_SUBMISSION_STATUS,
  LINK_SUBMISSION_TO_FINDING,
  SET_SUBMISSION,
  SET_SUBMISSION_PROPERTY,
} from '@/modules/submissions/_store/types'
import store from '@/modules/submissions/_store'
import { mapActions, mapGetters, mapState } from 'vuex'
import CompleteSubmissionPanel from '@/modules/submissions/_components/CompleteSubmissionPanel'

export default {
  name: 'SubmissionTopBar',
  components: {
    CompleteSubmissionPanel,
    CustomSelectDropdown,
  },
  directives: { clickOutside },
  filters: DateTimeFilters,
  mixins: [AccountMixin, SubmissionMixin],
  data() {
    return {
      alertId: 'submission-info-edit-alert',
      now: new Date(),
      showCompleteSubmissionPanel: false,
      submissionMetaForm: {
        resolution: undefined,
        payout: undefined,
        status: undefined,
        priority: undefined,
      },
    }
  },
  props: {
    submission: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    ...mapGetters(STORE_KEY, {
      submissionSelectedStatus: GET_SUBMISSION_STATUS,
      submissionSelectedPriority: GET_SUBMISSION_PRIORITY,
      submissionSelectedResolution: GET_SUBMISSION_RESOLUTION,
    }),
    ...mapState(STORE_KEY, {
      submissionStatuses: state => state.submissionStatuses,
      submissionPriorities: state => state.submissionPriorities,
      submissionResolutions: state => state.submissionResolutions,
    }),
    links() {
      if (!this.submission || !this.submission.links) {
        return null
      }

      return this.submission.links
    },
    filteredSubmissionResolutions() {
      if (!this.submissionResolutions) {
        return []
      }
      return this.submissionResolutions.filter(x => x.name !== 'Unresolved')
    },
    showPayoutDisplay() {
      if (!this.submission) {
        return false
      }
      return this.userIsProgramManager() || this.userIsBanker() || this.submission.payout_display
    },
    submissionIsClosed() {
      if (!this.submission || !this.submission.status) {
        return false
      }

      return this.submission.status === 3
    },
    researcherProfileImage() {
      if (!this.submission || !this.submission.researcher) {
        return DEFAULT_USER_IMAGE
      }
      return this.submission.researcher.profile_picture || DEFAULT_USER_IMAGE
    },
    vulnerabilityTypeNames() {
      if (!this.submission || !this.submission.vulnerability_types) {
        return ''
      }
      const vulnTypes = this.submission.vulnerability_types.map(x => x.name)
      return vulnTypes.join(', ')
    },
    showEditButton() {
      if (!this.submission || !this.submission.program) {
        return false
      }
      return this.userIsProgramManager() || this.userIsResearcher()
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      deleteSubmission: DELETE_SUBMISSION,
      editSubmission: EDIT_SUBMISSION,
      editSubmissionVulnerabilityType: EDIT_SUBMISSION_VULNERABILITY_TYPES,
      linkSubmissionToFinding: LINK_SUBMISSION_TO_FINDING,
      setSubmission: SET_SUBMISSION,
      setSubmissionProperty: SET_SUBMISSION_PROPERTY,
    }),
    updateResolutionField(option) {
      this.updateMetaField(option.id, 'resolution')
    },
    updateStatusField(option) {
      this.updateMetaField(option.id, 'status')
    },
    updatePriorityField(option) {
      this.updateMetaField(option.id, 'priority')
    },
    updatePayout(payout) {
      this.updateMetaField(payout, 'payout')
    },
    updateMetaField(val, field) {
      if (field === 'status' && this.userIsProgramManager()) {
        const completeStatus = this.submissionStatuses.find(x => x.name === 'Closed').id
        if (val === completeStatus) {
          this.showCompleteSubmissionPanel = true
          return
        }
      }

      this.submissionMetaForm[field] = val
      this.formFieldChanged(val, field)
    },
    async completeSubmission(form) {
      try {
        let payload = {
          ...this.submission,
          ...form,
          submission_uuid: this.submission.uuid,
        }
        payload.status = 3

        const response = await this.editSubmission(payload)
        if (response.status !== 200) {
          this.$caAlert.error('Failed to close submission.')
          return
        }

        await this.setSubmission(response.data)
        this.$caAlert.success('Submission closed.')
      } catch (e) {
        this.$caAlert.error('Failed to close submission.')
      } finally {
        this.showCompleteSubmissionPanel = false
      }
    },
    onCompleteSubmissionCancelClick() {
      this.showCompleteSubmissionPanel = false
    },
    async updateSubmission() {
      try {
        const submission = this.submission
        const payload = {
          ...submission,
          ...this.submissionMetaForm,
          submission_uuid: this.$route.params.uuid,
        }

        const response = await this.editSubmission(payload)
        if (response.status !== 200) {
          this.$caAlert.error('Failed to update submission.')
          return
        }

        await this.setSubmission(response.data)
        this.$caAlert.success('Submission updated successfully.')
      } catch (e) {
        this.$caAlert.error('Failed to update submission.')
      } finally {
        this.resetForm()
      }
    },
    formFieldChanged(value, field) {
      this.submissionMetaForm[field] = value

      if (this.submissionMetaForm[field] === this.submission[field]) {
        this.$caAlert.close(this.alertId)
        return
      }

      this.$caAlert.createOrUpdate({
        id: this.alertId,
        type: 'informational',
        text: 'Would you like to save your changes to this submission?',
        closable: false,
        buttons: [
          {
            text: 'Revert',
            callback: () => {
              this.resetForm()
              this.$caAlert.close(this.alertId)
            },
          },
          {
            text: 'Save',
            callback: async () => {
              await this.updateSubmission()
              this.$caAlert.close(this.alertId)
            },
          },
        ],
        customClass: this.getUserTypeClass(),
      })
    },
    async addOrRemoveVulnerabilityType(vulnerabilityType) {
      try {
        const payload = {
          submissionUuid: this.submission.uuid,
          vulnerabilityTypeUuid: vulnerabilityType.uuid,
        }

        const response = await this.editSubmissionVulnerabilityType(payload)
        await this.setSubmission(response.data)
      } catch (e) {
        this.$caAlert.error('Failed to set vulnerability type.')
      }
    },
    async onDeleteSubmission() {
      if (this.submission.deleted) {
        await this.onRecoverSubmission()
        return
      }

      this.$solar.show()

      try {
        this.$caDialog.close('submission-delete-confirmation')
        const response = await this.deleteSubmission(this.submission.uuid)
        if (response.status !== 200) {
          throw new Error('Failed to delete submission.')
        }

        this.setSubmissionProperty({
          property: 'deleted',
          value: true,
        })

        this.$caAlert.createOrUpdate({
          id: 'submission-deleted-alert',
          type: 'action',
          text: 'This submission has been deleted successfully.',
          closable: false,
          buttons: [
            {
              text: 'Undelete',
              callback: () => {
                this.onRecoverSubmission(this.submission.uuid)
              },
            },
          ],
        })
      } catch (e) {
        this.$caAlert.error('Failed to delete submission')
      } finally {
        this.$solar.hide()
      }
    },
    async onRecoverSubmission() {
      this.$caAlert.close('submission-deleted-alert')
      this.$solar.show()
      try {
        this.$caDialog.close('submission-delete-confirmation')
        const response = await this.deleteSubmission(this.submission.uuid)
        if (response.status !== 200) {
          throw new Error('Failed to recover submission.')
        }

        this.setSubmissionProperty({
          property: 'deleted',
          value: false,
        })

        this.$caAlert.createOrUpdate({
          id: 'submission-recovered-alert',
          type: 'success',
          text: 'This submission has been recovered successfully.',
          closable: true,
        })
      } catch (e) {
        this.$caAlert.error('Failed to delete submission')
      } finally {
        this.$solar.hide()
      }
    },
    async toggleFindingLink(uuid) {
      this.$solar.show()
      this.$caAlert.close('submission-finding-link-alert')
      const action = this.submission.findings && this.submission.findings.length > 0 ? 'unlinked' : 'linked'
      try {
        const submissionUuid = this.submission.uuid
        const findingUuid = uuid || this.submission.findings[0].uuid
        const payload = {
          submissionUuid: submissionUuid,
          findingUuid: findingUuid,
        }
        const submission = await this.linkSubmissionToFinding(payload)
        await this.setSubmission(submission)
        const alertMessage = `Successfully ${action} finding.`
        const alertOptions = {
          id: 'submission-finding-link-alert',
          buttons: [
            {
              text: `${action === 'linked' ? 'Unlink' : 'Relink'} Finding`,
              callback: () => {
                this.toggleFindingLink(findingUuid)
              },
            },
          ],
        }
        this.$caAlert.success(alertMessage, alertOptions)
      } catch (e) {
        this.$caAlert.error(`Finding could not be ${action}`)
      } finally {
        this.$solar.hide()
      }
    },
    resetForm() {
      this.submissionMetaForm = {
        resolution: this.submission.resolution,
        payout: this.submission.payout,
        status: this.submission.status,
        priority: this.submission.priority,
      }
    },
  },
  created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  mounted() {
    this.resetForm()
  },
  watch: {
    submission(newValue, oldValue) {
      this.resetForm()
    },
  },
}
</script>
