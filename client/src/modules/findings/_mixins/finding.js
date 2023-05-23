import {
  STORE_KEY,
  COMPLETE_FINDING,
  CREATE_FINDING,
  CREATE_FINDING_FROM_SUBMISSION,
  DELETE_ATTACHMENT,
  DELETE_FINDING,
  EDIT_FINDING,
  EDIT_VULNERABILITY_TYPES,
  FOLLOW_FINDING,
  GET_FINDING,
  LINK_FINDING,
  LINK_FINDING_SUBMISSION,
  LOAD_FINDING,
  LOAD_FINDING_PRIORITIES,
  PUBLISH_FINDING,
  SEARCH_FINDINGS,
  SEARCH_SUBMISSIONS,
  TOGGLE_LINKING_FINDING,
  RESET_STORE,
  UPLOAD_ATTACHMENT,
} from '@/stores/finding/types'
import store from '@/stores/finding'
import { mapActions, mapGetters, mapState } from 'vuex'

export const FindingMixin = {
  computed: {
    ...mapGetters(STORE_KEY, {
      finding: GET_FINDING,
    }),
    ...mapState(STORE_KEY, {
      linkingFinding: state => state.linkingFinding,
      findingPriorities: state => state.findingPriorities,
      findingPrioritiesMap: state => state.findingPrioritiesMap,
      findingResolutionsMap: state => state.findingResolutionsMap,
    }),
    findingIsDraft() {
      return this.finding && this.finding.post_status === 1
    },
    findingIsPublished() {
      return this.finding && this.finding.post_status === 2
    },
    findingIsResolved() {
      return this.finding && this.finding.resolution !== 1
    },
    findingHasSubmission() {
      if (!this.finding || !this.finding.submission) {
        return false
      }
      return this.finding.submission.uuid && this.finding.submission.uuid.length > 0
    },
    findingSubmission() {
      if (!this.finding || !this.finding.submission || !this.finding.submission.uuid) {
        return null
      }
      return this.finding.submission
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionCompleteFinding: COMPLETE_FINDING,
      actionCreateFinding: CREATE_FINDING,
      actionCreateFindingFromSubmission: CREATE_FINDING_FROM_SUBMISSION,
      actionDeleteAttachment: DELETE_ATTACHMENT,
      actionDeleteFinding: DELETE_FINDING,
      actionEditFinding: EDIT_FINDING,
      actionEditVulnerabilityTypes: EDIT_VULNERABILITY_TYPES,
      actionFollowFinding: FOLLOW_FINDING,
      actionLinkFinding: LINK_FINDING,
      actionLinkFindingSubmission: LINK_FINDING_SUBMISSION,
      actionLoadFinding: LOAD_FINDING,
      actionLoadFindingPriorities: LOAD_FINDING_PRIORITIES,
      actionPublishFinding: PUBLISH_FINDING,
      actionSearchFindings: SEARCH_FINDINGS,
      actionSearchSubmissions: SEARCH_SUBMISSIONS,
      actionResetStore: RESET_STORE,
      actionUploadAttachment: UPLOAD_ATTACHMENT,
      actionToggleLinkingFinding: TOGGLE_LINKING_FINDING,
    }),
    findingIsLinked(findingUuid) {
      if (!this.finding || !this.finding.related_findings) {
        return false
      }
      const index = this.finding.related_findings.findIndex(x => x.uuid === findingUuid)
      return index >= 0
    },
    isFollowingFinding(findingUuid) {
      const profile = this.profile
      if (!profile || !profile.followed_findings) {
        return false
      }

      const finding = profile.followed_findings.find(x => x.uuid === findingUuid)
      return finding && finding.uuid
    },
  },
  created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
}
