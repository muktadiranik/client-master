export let InitialState = {
  finding: {},
  linkingFinding: false,
  findingPriorities: [],
  findingPrioritiesMap: {
    0: 'Critical',
    1: 'High',
    2: 'Medium',
    3: 'Low',
    4: 'Informational',
    5: 'None',
  },
  findingResolutionsMap: {
    1: 'New',
    2: 'Closed Remediated',
    3: 'Closed Risk Accepted',
    4: 'In Progress',
    5: 'New Rediscovered',
    6: 'Closed Verified',
  },
}
