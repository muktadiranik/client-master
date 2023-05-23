<template>
  <div class="report-meta-menu" :class="{ readonly: !userIsProgramManager() }">
    <ul v-click-outside="closeAllMenus">
      <li class="hasDropdown" @click="toggleStatusMenu">
        <i class="fal fa-power-off"></i>
        {{ submissionStatusName | titleCase }}
        <div class="ca-tag-input">
          <div class="dropdownMenu center" v-show="showStatusMenu" v-if="userIsProgramManager()">
            <div class="dropdownMenuHeader">
              <h4 class="title">Status</h4>
            </div>
            <ul class="option-list text-left">
              <li
                v-for="(status, index) in submissionStatuses"
                :key="`submission-status-${index}`"
                @click="updateMetaField(status.id, 'status')"
              >
                {{ status.name }}
              </li>
            </ul>
          </div>
        </div>
      </li>
      <li class="hasDropdown" @click="toggleSeverityMenu">
        <i class="fal fa-heartbeat"></i>
        {{ submissionPriorityName }}
        <div class="ca-tag-input">
          <div class="dropdownMenu center" v-show="showSeverityMenu" v-if="userIsProgramManager()">
            <div class="dropdownMenuHeader">
              <h4 class="title">Severity</h4>
            </div>
            <div class="dropdownMenuBody u-p-0">
              <ul class="option-list text-left">
                <li
                  v-for="(priority, index) in submissionPriorities"
                  :key="`submission-priority-${index}`"
                  @click="updateMetaField(priority.id, 'priority')"
                >
                  {{ priority.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
      <li class="hasDropdown" @click="toggleResolutionMenu($event)">
        <i :class="resolutionIcon"></i>
        {{ resolutionText }}
        <div class="ca-tag-input">
          <div class="dropdownMenu width-320 center" v-show="showResolutionMenu" v-if="userIsProgramManager()">
            <div class="dropdownMenuHeader">
              <h4 class="title">Resolution</h4>
            </div>
            <div class="dropdownMenuBody">
              <div class="form">
                <div class="form__group">
                  <label for="submission-resolution" class="form__label text-left">Resolution</label>
                  <div class="c-select-container" id="submission-resolution">
                    <select
                      id="submission-resolution-select"
                      class="form__control"
                      name="submission-resolution"
                      @change="updateMetaField(Number($event.target.value), 'resolution')"
                    >
                      <option
                        :selected="resolution.id === submissionMetaForm.resolution"
                        v-for="(resolution, index) in submissionResolutions"
                        :value="resolution.id"
                        :key="`submission-resolution-${index}`"
                        >{{ resolution.name }}</option
                      >
                    </select>
                  </div>
                </div>
                <div class="form__group" v-show="resolutionIsAccepted">
                  <label for="submission-payout" class="form__label text-left">Payout (USD)</label>
                  <input
                    id="payout-input"
                    type="text"
                    class="form__control"
                    name="submission-payout"
                    @input="updateMetaField($event.target.value, 'payout')"
                    :value="submissionMetaForm.payout"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <CompleteSubmissionPanel
      :submission="submission"
      :visible="showCompleteSubmissionPanel"
      @on-complete-submission="completeSubmission"
      @cancel-click="onCompleteSubmissionCancelClick"
    />
  </div>
</template>

<script>
import { STORE_KEY, EDIT_SUBMISSION, SET_SUBMISSION } from '@/modules/submissions/_store/types'
import store from '@/modules/submissions/_store'
import { mapActions, mapState } from 'vuex'
import { AccountMixin } from '@/mixins/account'
import { clickOutside } from '@/directives/click-outside'
import TextFilters from '@/filters/text-filters'
import CompleteSubmissionPanel from '@/modules/submissions/_components/CompleteSubmissionPanel'

export default {
  name: 'SubmissionMetaMenu',
  directives: {
    clickOutside,
  },
  filters: TextFilters,
  mixins: [AccountMixin],
  components: {
    CompleteSubmissionPanel,
  },
  data() {
    return {
      alertId: 'submission-info-edit-alert',
      showStatusMenu: false,
      showSeverityMenu: false,
      showResolutionMenu: false,
      showCompleteSubmissionPanel: false,
      submissionMetaForm: {
        resolution: undefined,
        payout: undefined,
        status: undefined,
        priority: undefined,
      },
    }
  },
  computed: {
    ...mapState(STORE_KEY, {
      submission: state => state.submission,
      submissionStatuses: state => state.submissionStatuses,
      submissionResolutions: state => state.submissionResolutions,
      submissionPriorities: state => state.submissionPriorities,
    }),
    resolutionIcon() {
      if (!this.submission || !this.submission.resolution) {
        return 'fa fa-spinner'
      }

      const resolution = this.submission.resolution
      switch (resolution) {
        // Unresolved
        case 1:
          return 'fa fa-spinner'
        // Accepted (with or without payout)
        case 2:
          return this.submission.payout && this.submission.payout >= 0 ? 'fal fa-usd-circle' : ' fal fa-check-circle'
        // Rejected
        case 3:
          return 'fal fa-octagon'
        // Duplicate
        case 4:
          return 'fal fa-clone'
        default:
          return 'fa fa-spinner'
      }
    },
    resolutionText() {
      if (!this.submission || !this.submission.resolution) {
        return ''
      }

      const resolution = this.submission.resolution
      switch (resolution) {
        // Unresolved
        case 1:
          return 'Unresolved'
        // Accepted (with and without payout)
        case 2:
          return this.submission.payout && this.submission.payout >= 0
            ? `Accepted - $${this.submission.payout}`
            : 'Accepted'
        // Rejected
        case 3:
          return 'Not Accepted'
        // Duplicate
        case 4:
          return 'Duplicate'
        default:
          return 'fa fa-spinner'
      }
    },
    resolutionIsAccepted() {
      const acceptedResolution = this.submissionResolutions.find(x => x.name === 'Accepted')
      if (!acceptedResolution) {
        return false
      }

      return this.submissionMetaForm.resolution === acceptedResolution.id
    },
    submissionPriorityName() {
      if (!this.submission || !this.submissionPriorities) {
        return ''
      }
      const priority = this.submissionPriorities.find(x => x.id === this.submissionMetaForm.priority)
      return priority ? priority.name : ''
    },
    submissionStatusName() {
      if (!this.submission || !this.submissionStatuses) {
        return ''
      }
      const status = this.submissionStatuses.find(x => x.id === this.submissionMetaForm.status)
      return status ? status.name : ''
    },
    submissionResolutionName() {
      if (!this.submission || !this.submissionResolutions) {
        return ''
      }
      const resolution = this.submissionResolutions.find(x => x.id === this.submissionMetaForm.resolution)
      return resolution ? resolution.name : ''
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      editSubmission: EDIT_SUBMISSION,
      setSubmission: SET_SUBMISSION,
    }),
    closeAllMenus() {
      this.showSeverityMenu = false
      this.showResolutionMenu = false
      this.showStatusMenu = false
    },
    toggleStatusMenu() {
      this.showStatusMenu = !this.showStatusMenu
      this.showResolutionMenu = false
      this.showSeverityMenu = false
    },
    toggleResolutionMenu(e) {
      const targetId = e && e.target && e.target.id ? e.target.id : ''

      if (targetId && (targetId === 'submission-resolution-select' || targetId === 'payout-input')) {
        return
      }

      this.showResolutionMenu = !this.showResolutionMenu
      this.showStatusMenu = false
      this.showSeverityMenu = false
    },
    toggleSeverityMenu() {
      this.showSeverityMenu = !this.showSeverityMenu
      this.showResolutionMenu = false
      this.showStatusMenu = false
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
