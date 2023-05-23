let loadingStates = {
  submissionDetails: false,
}
const loadingStateKeys = Object.keys(loadingStates)

const SubmissionModel = [
  {
    id: 0,
    title: '',
    active: false,
    deleted: false,
    researcher: {
      profile_picture: '',
      username: '',
      uuid: '',
    },
    program_managers: [
      {
        profile_picture: '',
        username: '',
        uuid: '',
      },
    ],
    program: {
      id: 0,
      uuid: '',
      title: '',
      details: '',
      private: false,
      active: false,
      image: null,
      date_created: '',
      date_modified: '',
      company: null,
      critical: 0.0,
      high: 0.0,
      medium: 0.0,
      low: 0.0,
      informational: 0.0,
      invited: [],
    },
    date_created: '',
    date_modified: '',
    last_updated: '',
    status: '',
    resolution: -1,
    thread_uuid: '',
    image: '',
    uuid: '',
    url: '',
    notes: '',
    details: '',
    attachment: '',
    payout: 0,
    priority: 0,
    owner: 0,
    attachments: [],
  },
]

export const InitialState = {
  submission: { ...SubmissionModel },
  submissionResolutions: [],
  submissionStatuses: [],
  submissionPriorities: [],
  loadingStates: loadingStates,
  loadingStateKeys: loadingStateKeys,
}
