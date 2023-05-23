export const FINDINGS_SORT_OPTIONS = Object.freeze({
  Name: {
    id: 1,
    name: 'Name',
    description: 'Name (title) of the finding.',
    property: 'title',
  },
  DatePublished: {
    id: 2,
    name: 'Date Published',
    description: 'Date the finding was created.',
    property: 'date_published',
  },
  DateUpdated: {
    id: 3,
    name: 'Date Updated',
    description: 'Date the finding was last updated.',
    property: 'last_updated',
  },
  Severity: {
    id: 4,
    name: 'Severity',
    description: 'Severity of the finding.',
    property: 'priority',
  },
  Status: {
    id: 5,
    name: 'Status',
    description: 'Status of the finding.',
    property: 'resolution',
  },
  Program: {
    id: 6,
    name: 'Program',
    description: 'Program name',
    property: 'program__title',
  },
})

export const getSortOptionById = id => {
  switch (id) {
    case 1:
      return FINDINGS_SORT_OPTIONS.Name
    case 2:
      return FINDINGS_SORT_OPTIONS.DatePublished
    case 3:
      return FINDINGS_SORT_OPTIONS.DateUpdated
    case 4:
      return FINDINGS_SORT_OPTIONS.Severity
    case 5:
      return FINDINGS_SORT_OPTIONS.Status
    default:
      return FINDINGS_SORT_OPTIONS.Name
  }
}
