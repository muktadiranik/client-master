import { mapActions, mapGetters } from 'vuex'
import { STORE_KEY as ACCOUNT_STORE_KEY, GET_PROFILE, LOAD_PROFILE } from '@/stores/account/types'
import { STORE_KEY as SUBMISSION_STORE_KEY, TOGGLE_SUBMISSION_FOLLOW } from '@/modules/submissions/_store/types'

export const SubmissionMixin = {
  computed: {
    ...mapGetters(ACCOUNT_STORE_KEY, {
      profile: GET_PROFILE,
    }),
  },
  methods: {
    ...mapActions(ACCOUNT_STORE_KEY, {
      loadProfile: LOAD_PROFILE,
    }),
    ...mapActions(SUBMISSION_STORE_KEY, {
      toggleSubmissionFollow: TOGGLE_SUBMISSION_FOLLOW,
    }),
    isFollowingSubmission(submissionUuid) {
      const profile = this.profile
      if (!profile || !profile.followed_submissions) {
        return false
      }

      const submission = profile.followed_submissions.find(x => x.uuid === submissionUuid)
      return submission && submission.uuid
    },
    async toggleSubmissionFollowing(submissionUuid) {
      try {
        const response = await this.toggleSubmissionFollow(submissionUuid)
        await this.loadProfile()
        return response.data
      } catch (e) {
        throw e
      }
    },
  },
}
