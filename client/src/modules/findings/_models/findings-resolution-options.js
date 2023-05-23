export const FINDINGS_RESOLUTION_OPTIONS = Object.freeze({
  NEW: {
    id: 1,
    name: 'New',
  },
  CLOSED_REMEDIATED: {
    id: 2,
    name: 'Closed Remediated',
  },
  CLOSED_ACCEPTED: {
    id: 3,
    name: 'Closed Accepted',
  },
  IN_PROGRESS: {
    id: 4,
    name: 'In Progress',
  },
  NEW_REDISCOVERED: {
    id: 5,
    name: 'New Rediscovered',
  },
  CLOSED_VERIFIED: {
    id: 6,
    name: 'Closed Verified',
  },
})

export const getFindingResolutionById = id => {
  switch (id) {
    case 1:
      return FINDINGS_RESOLUTION_OPTIONS.NEW
    case 2:
      return FINDINGS_RESOLUTION_OPTIONS.CLOSED_REMEDIATED
    case 3:
      return FINDINGS_RESOLUTION_OPTIONS.CLOSED_ACCEPTED
    case 4:
      return FINDINGS_RESOLUTION_OPTIONS.IN_PROGRESS
    case 5:
      return FINDINGS_RESOLUTION_OPTIONS.NEW_REDISCOVERED
    case 6:
      return FINDINGS_RESOLUTION_OPTIONS.CLOSED_VERIFIED
  }
}
