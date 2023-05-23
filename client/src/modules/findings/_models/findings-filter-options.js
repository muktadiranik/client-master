export const FINDINGS_FILTER_OPTIONS = Object.freeze({
  // All: {
  //   id: 0,
  //   name: 'All',
  //   description: 'Show findings of all resolutions.',
  //   property: 'all',
  // },
  New: {
    id: 1,
    name: 'New',
    description: 'Show only new findings.',
    property: 'new',
  },
  InProgress: {
    id: 4,
    name: 'In Progress',
    description: 'Show findings that are not remiated or accepted.',
    property: 'in_progress',
  },
  Remediated: {
    id: 2,
    name: 'Remediated',
    description: 'Show only Remediated findings.',
    property: 'remediated',
  },
  AcceptedRisk: {
    id: 3,
    name: 'Risk Accepted',
    description: 'Show findings that are resolved but have not been remediated.',
    property: 'risk_accepted',
  },
  NewRediscovered: {
    id: 5,
    name: 'New Rediscovered',
  },
  ClosedVerified: {
    id: 6,
    name: 'Closed Verified',
  },
})

export const getFilterOptionById = id => {
  switch (id) {
    case 0:
      return FINDINGS_FILTER_OPTIONS.All
    case 1:
      return FINDINGS_FILTER_OPTIONS.New
    case 2:
      return FINDINGS_FILTER_OPTIONS.Remediated
    case 3:
      return FINDINGS_FILTER_OPTIONS.AcceptedRisk
    case 4:
      return FINDINGS_FILTER_OPTIONS.InProgress
    default:
      return FINDINGS_FILTER_OPTIONS.All
  }
}
