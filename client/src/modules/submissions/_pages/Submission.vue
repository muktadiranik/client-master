<template>
  <main class="c-site-main">
    <section class="u-pt-20 u-pb-20">
      <div class="l-wrap" v-if="submission">
        <router-link :to="{ name: 'Submissions' }">
          <button class="u-ml--16 u-mb-20 o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center">
            <i class="fal fa-arrow-left o-btn--icon-sm"></i>
            Back
          </button>
        </router-link>
        <!-- Submission Title -->
        <div class="u-mb-34">
          <div>
            <div class="l-grid l-grid--row-gap-20 u-d-f-at-768 u-ai-center u-jc-sb u-font-fira-sams">
              <div class="c-media c-media--40">
                <img class="u-img-circle" :src="programImage" :alt="programName" />
                <div class="c-media__body u-lh-1">
                  <h1 class="u-font-22 o-text--500">{{ submission.title }}</h1>
                  <div class="u-font-12 u-mt-8 u-d-f u-ai-center">
                    <div v-if="submission.program && submission.program.title">
                      <router-link
                        class="o-text--dark"
                        :to="{ name: 'Program', params: { uuid: submission.program.uuid } }"
                      >
                        <i class="o-text--gray">{{ submission.program.title }}</i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="u-mr-20-at-768">
                <h1 class="u-font-22 o-text--500">{{ submission.title }}</h1>
                <div class="u-font-12 u-mt-8 u-d-f u-ai-center">
                  <div v-if="submission.program && submission.program.title">
                    <router-link
                      class="o-text--dark"
                      :to="{ name: 'Program', params: { uuid: submission.program.uuid } }"
                    >
                      <i>{{ submission.program.title }}</i>
                    </router-link>
                  </div>
                </div>
              </div> -->
              <div class="u-ml-20">
                <router-link
                  :to="{
                    name: 'SubmissionEdit',
                    params: {
                      programUuid: submission.program.uuid,
                      submissionUuid: submission.uuid,
                    },
                  }"
                  class="o-btn o-btn--primary o-btn--sm o-btn--rounded-sm u-d-if u-ai-center u-minw-auto"
                  v-if="showEditButton"
                >
                  <span>Edit</span>
                </router-link>
                <!-- <div class="c-media c-media--40" v-if="submission.researcher">
                  <img class="u-img-circle" :src="researcherProfileImage" :alt="submission.researcher.username" />
                  <div class="c-media__body u-lh-1">
                    <div class="u-font-14 u-text-nowrap">
                      <strong>{{ fullName }}</strong>
                    </div>
                    <div class="u-font-12 u-text-nowrap u-mt-8">
                      <strong class="u-text-mute">
                        {{ submission.researcher.username }}
                      </strong>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>

        <div class="l-submission-details">
          <div>
            <div class="c-box">
              <div class="c-box__header u-d-f u-ai-center u-jc-sb">
                <h6 class="c-box__header__text">Submission Details</h6>
              </div>
              <!-- /.c-box__header -->
              <div class="c-box__body">
                <!-- Markdown Content -->
                <div class="c-markdown-content">
                  <vue-markdown v-if="submission.details" :source="submission.details" />
                </div>

                <section class="u-mt-20" v-show="submission.vulnerability_types > 0">
                  <h6 class="u-fs-12 u-d-f u-ai-center u-mb-15">
                    <span>Vulnerability Payout</span>
                  </h6>
                  <ul class="c-badge-list">
                    <li class="c-badge--vuln" v-for="type in submission.vulnerability_types" :key="type.uuid">
                      <span>{{ type.name }}</span>
                    </li>
                  </ul>
                </section>
              </div>
              <!-- /.c-box__body -->
            </div>

            <!-- Attachments -->
            <div class="c-box u-mt-20" v-show="showAttachments">
              <div class="c-box__header">
                <div class="c-box__header__text">Attachments</div>
              </div>
              <div class="c-box__body u-p-0">
                <ca-file-upload-attachments :attachments="submission.attachments" :allow-deleting="false" />
              </div>
            </div>

            <!-- /.c-box -->
          </div>
          <div>
            <!-- Triage Box -->
            <div class="c-box u-mb-20">
              <div class="c-box__header">
                <h6 class="c-box__header__text">Details</h6>
              </div>
              <!-- .c-box__header -->
              <div class="c-box__body">
                <ul>
                  <li class="c-dictionary c-dictionary--font-sm l-flex u-ai-center">
                    <div class="c-dictionary__key u-d-if u-ai-center">
                      <span>Created</span>
                    </div>
                    <div class="c-dictionary__value">
                      {{ submission.date_created | date }}
                    </div>
                  </li>
                  <li class="c-dictionary c-dictionary--font-sm l-flex u-ai-center">
                    <div class="c-dictionary__key u-d-if u-ai-center">
                      <span>Status</span>
                    </div>
                    <div class="c-dictionary__value" v-if="!userIsProgramManager()">
                      <ResolutionBadge
                        v-if="submission.resolution_display"
                        :resolution="submission.resolution_display"
                      />
                    </div>
                    <div class="c-dictionary__value u-color-coolgrey" v-if="userIsProgramManager()">
                      <StatusDropdown :submission="submission" />
                    </div>
                  </li>
                  <li class="c-dictionary c-dictionary--font-sm l-flex u-ai-center">
                    <div class="c-dictionary__key u-d-if u-ai-center">
                      <span>Severity</span>
                    </div>
                    <div class="c-dictionary__value" v-if="!userIsProgramManager() && submissionSelectedPriority">
                      <span
                        class="c-badge"
                        :class="
                          `c-badge--severity-${submissionSelectedPriority.name.replace(/\s+/g, '-').toLowerCase()}`
                        "
                      >
                        {{
                          submissionSelectedPriority && submissionSelectedPriority.name
                            ? submissionSelectedPriority.name === 'Informational'
                              ? 'Info'
                              : submissionSelectedPriority.name
                            : ''
                        }}
                      </span>
                    </div>
                    <div class="c-dictionary__value u-color-coolgrey" v-if="userIsProgramManager()">
                      <SeverityDropdown :submission="submission" />
                    </div>
                  </li>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-flex u-ai-center"
                    v-show="submission.payout_display !== null"
                  >
                    <div class="c-dictionary__key u-d-if u-ai-center">
                      <span>Bounty</span>
                    </div>
                    <div class="c-dictionary__value" v-if="!userIsProgramManager()">
                      <div class="l-flex u-ai-center">
                        <div class="u-mr-10 o-text--gray">
                          <i class="far fa-money-bill-wave u-mr-2"></i>
                          <span>{{ submission.payout_display }}</span>
                        </div>

                        <!-- TO DO: re-review when transactions is refactored -->
                        <div
                          v-if="submission.links"
                          :class="
                            `c-badge--payment c-badge--payment-${
                              submission.links.payment && submission.links.payment.id ? 'paid' : 'pending'
                            }`
                          "
                        >
                          <span>{{
                            submission.links.payment && submission.links.payment.id ? 'Paid' : 'Pending'
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="c-dictionary__value" v-if="userIsProgramManager()">
                      <BountyInput :submission="submission" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Links Box -->
            <div class="c-box u-mb-20" v-if="userIsProgramManager()">
              <div class="c-box__header">
                <h6 class="c-box__header__text">
                  <span>Links</span>
                </h6>
              </div>
              <div class="c-box__body u-p-0">
                <div class="o-linked-findings" v-if="links && links.jira">
                  <ul class="c-list-group c-list-group--flush">
                    <li
                      class="c-dictionary c-dictionary--font-sm l-dictionary"
                      v-for="(finding, index) in submission.findings"
                      :key="`finding-link-${index}`"
                    >
                      <span class="u-text-mute">Finding:</span>
                      <router-link :to="{ name: 'Finding', params: { uuid: finding.uuid } }">{{
                        finding.title
                      }}</router-link>
                    </li>
                    <li class="c-dictionary c-dictionary--font-sm l-dictionary" v-if="links.jira">
                      <span class="u-text-mute">Jira:</span>
                      <a :href="links.jira.url" :target="_blank">{{ links.jira.title }}</a>
                    </li>
                  </ul>
                </div>
                <div class="o-linked-payments" v-if="links && links.payment">
                  <ul class="c-list-group c-list-group--flush">
                    <li class="c-dictionary c-dictionary--font-sm l-dictionary">
                      <span class="u-text-mute">Payment:</span>
                      <router-link
                        :to="{
                          name: 'PaymentDetailsPage',
                          params: { uuid: links.payment.uuid },
                        }"
                        >{{ links.payment.id }}</router-link
                      >
                    </li>
                  </ul>
                </div>
                <div class="o-linked-transactions" v-if="links && links.transaction">
                  <ul class="c-list-group c-list-group--flush">
                    <li class="c-dictionary c-dictionary--font-sm l-dictionary">
                      <span class="u-text-mute">Transaction:</span>
                      <router-link
                        :to="{
                          name: 'TransactionDetails',
                          params: { uuid: links.transaction.uuid },
                        }"
                        >{{ links.transaction.id }}</router-link
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Comment Box -->
            <div class="c-box">
              <div class="c-box__header">
                <div class="c-box__header__text">Comments</div>
              </div>
              <div class="c-box__body">
                <chat-window v-if="showChatWindow" :thread-uuid="submission.thread_uuid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { SubmissionMixin } from '@/mixins/submission'
import { mapActions, mapGetters, mapState } from 'vuex'
import CaFileUploadAttachments from '@/modules/core/_components/ca-file-upload/CaFileUploadAttachments'
import ChatWindow from '@/modules/chat/_components/ChatWindow'
import { FindingMixin } from '@/modules/findings/_mixins/finding'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import StatusDropdown from '@/modules/submissions/_components/StatusDropdown'
import SeverityDropdown from '@/modules/submissions/_components/SeverityDropdown'
import BountyInput from '@/modules/submissions/_components/BountyInput'
import DateTimeFilters from '@/filters/date-time-filters'
import ResolutionBadge from '@/modules/findings/_components/findings-list/ResolutionBadge'
import {
  STORE_KEY,
  EDIT_SUBMISSION,
  GET_LOADING_STATE,
  LOAD_SUBMISSION,
  SET_SUBMISSION,
  SET_LOADING_STATE,
  LINK_SUBMISSION_TO_FINDING,
  LOAD_SUBMISSION_PRIORITIES,
  LOAD_SUBMISSION_RESOLUTIONS,
  LOAD_SUBMISSION_STATUSES,
  GET_SUBMISSION_STATUS,
  GET_SUBMISSION_RESOLUTION,
  GET_SUBMISSION_PRIORITY,
  RESET_STORE,
} from '@/modules/submissions/_store/types'
import store from '@/modules/submissions/_store'

import VueMarkdown from 'vue-markdown'
import router from '../../../router'

export default {
  name: 'Submission',
  components: {
    CaFileUploadAttachments,
    ChatWindow,
    VueMarkdown,
    StatusDropdown,
    SeverityDropdown,
    BountyInput,
    ResolutionBadge,
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin, BreadcrumbsMixin, FindingMixin, SubmissionMixin],
  props: {
    fromProgramSubmissions: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      attachments: [],
      isMounted: false,
      boxHeight: null,
      vulType: [],
      historyList: [],
    }
  },
  computed: {
    ...mapGetters(STORE_KEY, {
      submissionSelectedStatus: GET_SUBMISSION_STATUS,
      submissionSelectedResolution: GET_SUBMISSION_RESOLUTION,
      submissionSelectedPriority: GET_SUBMISSION_PRIORITY,
      loadingState: GET_LOADING_STATE,
    }),
    ...mapState(STORE_KEY, {
      sidebarWindowClass: state => state.sidebarWindowClass,
      submission: state => state.submission,
    }),
    fullName() {
      if (!this.submission || !this.submission.researcher) {
        return ''
      }
      const researcher = this.submission.researcher
      if (!researcher.first_name) {
        return ''
      }
      if (!researcher.last_name) {
        return `${researcher.first_name}`
      }

      return `${researcher.first_name} ${researcher.last_name}`
    },
    bountyStatus() {
      if (!this.submission || !this.submission.bounty_status) {
        return null
      }
      return this.submission.bounty_status
    },
    statusClass() {
      let status
      if (this.submission.status_display) {
        status = this.submission.status_display
      }
      if (this.submission.resolution_display && !this.submission.status_display) {
        status = this.submission.resolution_display
      }
      if (!status) {
        return 'closed'
      }
      return status.replace(/\s+/g, '-').toLowerCase()
    },
    links() {
      if (!this.submission || !this.submission.links) {
        return null
      }

      return this.submission.links
    },
    showPayoutDisplay() {
      if (!this.submission) {
        return false
      }
      if (!this.submission.links) {
        return false
      }
      return this.userIsProgramManager() || this.userIsBanker() || this.submission.payout_display
    },
    showEditButton() {
      if (!this.submission || !this.submission.program) {
        return false
      }
      return this.userIsProgramManager() || this.userIsResearcher()
    },
    programImage() {
      if (!this.submission || !this.submission.program || !this.submission.program.image) {
        return DEFAULT_PROGRAM_IMAGE
      }
      return this.submission.program.image || DEFAULT_PROGRAM_IMAGE
    },
    programName() {
      if (!this.submission || !this.submission.program || !this.submission.program.title) {
        return 'Program Image'
      }
      return this.submission.program.title || 'Program Image'
    },
    showAttachments() {
      return this.submission && this.submission.attachments && this.submission.attachments.length > 0
    },
    disableStatusChange() {
      if (!this.userIsProgramManager()) {
        return true
      }

      if (!this.submission || !this.submission.finding_uuid) {
        return false
      }

      const findingUuid = this.submission.finding_uuid
      if (!findingUuid || findingUuid.length <= 0) {
        return false
      }

      return true
    },
    programUuid() {
      return !this.submission || !this.submission.program ? '' : this.submission.program.uuid
    },
    showChatWindow() {
      return this.submission && this.submission.thread_uuid
    },
    boxStyle() {
      return {
        height: `${this.boxHeight}px`,
      }
    },

    showProgramNavbar() {
      return this.submission && this.submission.program && this.fromProgramSubmissions
    },
    submissionSidebarStyle() {
      if (!this.showProgramNavbar) {
        return {}
      }
      const sidebar = this.$refs.submissionSidebar
      return !sidebar
        ? {}
        : {
            height: 'calc(100vh - 160px)',
          }
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      loadSubmission: LOAD_SUBMISSION,
      setLoading: SET_LOADING_STATE,
      editSubmission: EDIT_SUBMISSION,
      setSubmission: SET_SUBMISSION,
      resetStore: RESET_STORE,
      loadSubmissionResolutions: LOAD_SUBMISSION_RESOLUTIONS,
      loadSubmissionStatuses: LOAD_SUBMISSION_STATUSES,
      loadSubmissionPriorities: LOAD_SUBMISSION_PRIORITIES,
      linkSubmissionToFinding: LINK_SUBMISSION_TO_FINDING,
    }),
    onWindowResize() {
      if (!this.$refs.boxHeader) {
        return
      }

      const boxHeaderHeight = this.$refs.boxHeader.offsetHeight
      const detailsHeaderHeight = this.$refs.submissionDetailsHeader.offsetHeight + 20
      const sectionPadding = 40
      const programNavbarHeight = this.showProgramNavbar === true ? 120 : 60
      const heightToMinus = boxHeaderHeight + detailsHeaderHeight + sectionPadding + programNavbarHeight
      const height = window.innerHeight - heightToMinus

      this.boxHeight = height
    },
    async onToggleSubmissionFollow(uuid) {
      try {
        const submission = await this.toggleSubmissionFollowing(uuid)
        await this.setSubmission(submission)
      } catch (e) {
        this.$caAlert.error('Failed to update following of submission')
      }
    },
    handle_download_attachment() {
      const {uuid, attachmentUUID} = this.$route.params
      if (!uuid || !attachmentUUID) return
      const attachment = this.submission.attachments.find(attachment => attachment.uuid === attachmentUUID)
      if (!attachment.url) return

      window.location.assign(attachment.url)
      router.push({name: 'Submission', params: {uuid: uuid}})
    }
  },
  created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  async mounted() {
    this.setLoading({
      key: 'submissionDetails',
      value: true,
    })
    this.$solar.show()
    try {
      await this.loadSubmissionStatuses()
      await this.loadSubmissionResolutions()
      await this.loadSubmissionPriorities()
      await this.loadSubmission(this.$route.params.uuid)
      this.handle_download_attachment()
      document.title = `Inspectiv | ${this.submission.title}`

      this.actionSetBreadcrumbs({
        parent: {
          route: this.$router.resolve({ name: 'Submissions' }).route,
        },
        child: {
          route: this.$route,
          title: this.submission.title,
          copyValue: this.$route.params.uuid,
        },
      })
    } catch (e) {
      this.$caAlert.error('Failed to load submission')
    } finally {
      this.$solar.hide()
      this.setLoading({
        key: 'submissionDetails',
        value: false,
      })
    }

    this.isMounted = true

    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize)
  },
  async beforeDestroy() {
    await this.resetStore()
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
  },
}
</script>
