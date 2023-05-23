import {
  GET_LOADING_STATE,
  GET_SUBMISSION,
  GET_SUBMISSION_STATUS,
  GET_SUBMISSION_PRIORITY,
  GET_SUBMISSION_RESOLUTION,
} from '@/modules/submissions/_store/types'

export default {
  [GET_SUBMISSION]: state => state.submission,
  [GET_LOADING_STATE]: state => key => !!state.loadingStates[key],
  [GET_SUBMISSION_STATUS]: state => {
    if (!state.submissionStatuses || !state.submission) {
      return ''
    }
    const status = state.submissionStatuses.find(x => x.id === state.submission.status)
    return status
  },
  [GET_SUBMISSION_PRIORITY]: state => {
    if (!state.submissionPriorities || !state.submission) {
      return ''
    }
    const priority = state.submissionPriorities.find(x => x.id === state.submission.priority)
    return priority
  },
  [GET_SUBMISSION_RESOLUTION]: state => {
    if (!state.submissionResolutions || !state.submission) {
      return ''
    }
    const resolution = state.submissionResolutions.find(x => x.id === state.submission.resolution)
    return resolution
  },
}
