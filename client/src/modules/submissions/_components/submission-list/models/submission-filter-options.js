export const SUBMISSION_FILTER_OPTIONS = Object.freeze({
  New: {
    id: 1,
    name: 'New',
    description: 'Recently reported submissions.',
    property: 'new',
  },
  Closed: {
    id: 2,
    name: 'Closed',
    description: 'Submissions that are closed.',
    property: 'closed',
  },
  Incomplete: {
    id: 3,
    name: 'In Progress',
    description: 'Submissions that are in progress.',
    property: 'in_review',
  },
  All: {
    id: 4,
    name: 'All',
    description: 'All Submissions.',
    property: 'all',
  },
})

export const getFilterOptionById = id => {
  switch (id) {
    case 1:
      return SUBMISSION_FILTER_OPTIONS.New
    case 2:
      return SUBMISSION_FILTER_OPTIONS.Closed
    case 3:
      return SUBMISSION_FILTER_OPTIONS.Incomplete
    case 4:
    default:
      return SUBMISSION_FILTER_OPTIONS.All
  }
}
