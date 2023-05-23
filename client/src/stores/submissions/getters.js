import {
  GET_SUBMISSION_PRIORITIES,
  GET_SUBMISSION_RESOLUTIONS,
  GET_KANBAN_STATUS,
  GET_SUBMISSIONS,
} from '@/stores/submissions/types'

export default {
  [GET_SUBMISSION_PRIORITIES]: state => state.submissionPriorities,
  [GET_SUBMISSION_RESOLUTIONS]: state => state.submissionResolutions,
  [GET_KANBAN_STATUS]: state => state.isSubmissionKanban,
  [GET_SUBMISSIONS]: state => state.submissions,
}
