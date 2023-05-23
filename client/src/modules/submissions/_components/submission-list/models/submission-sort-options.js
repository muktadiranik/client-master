export const SUBMISSION_SORT_OPTIONS = Object.freeze({
  Name: {
    id: 1,
    name: 'Name',
    description: 'Name (title) of the submission.',
    property: 'title',
  },
  DateCreated: {
    id: 2,
    name: 'Date Created',
    description: 'Date the submission was created.',
    property: 'date_created',
  },
  DateUpdated: {
    id: 3,
    name: 'Date Updated',
    description: 'Date the submission was last updated.',
    property: 'last_updated',
  },
  Severity: {
    id: 4,
    name: 'Severity',
    description: 'Severity of the submission.',
    property: 'priority',
  },
  Bounty: {
    id: 5,
    name: 'Bounty',
    description: 'Bounty amount.',
    property: 'payout',
  },
  Status: {
    id: 6,
    name: 'Status',
    description: 'Status of the submission.',
    property: 'status',
  },
})

export const getSortOptionById = id => {
  switch (id) {
    case 1:
      return SUBMISSION_SORT_OPTIONS.Name
    case 2:
      return SUBMISSION_SORT_OPTIONS.DateCreated
    case 3:
      return SUBMISSION_SORT_OPTIONS.DateUpdated
    case 4:
      return SUBMISSION_SORT_OPTIONS.Severity
    case 5:
      return SUBMISSION_SORT_OPTIONS.Bounty
    default:
      return SUBMISSION_SORT_OPTIONS.DateUpdated
  }
}
