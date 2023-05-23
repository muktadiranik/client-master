import { FINDINGS_SORT_OPTIONS, getSortOptionById } from '@/modules/findings/_models/findings-sort-options'

import { FINDINGS_FILTER_OPTIONS, getFilterOptionById } from '@/modules/findings/_models/findings-filter-options'

import { DatesMixin } from '@/mixins/dates'

let sortOption = JSON.parse(localStorage.getItem('findingsListSortOption')) || FINDINGS_SORT_OPTIONS.DateUpdated
let sortOrder = `${localStorage.getItem('findingsListSortOrder') || 'desc'}`

let filterOption = JSON.parse(localStorage.getItem('findingsListFilterOption')) || FINDINGS_FILTER_OPTIONS.All

let viewPreferences = {}

const today = new Date()
// let lastMonth = new Date()
// lastMonth.setDate(1)
// lastMonth.setMonth(today.getMonth() - 1)

const endDate = DatesMixin.methods.getIsoDateStringFromDate(today)

export let InitialState = {
  program: {},
  findings: [],
  programUuid: '',
  findingsQuery: {
    page: 1,
    count: 0,
    next: '',
    previous: '',
    total_pages: 0,
    vulnerabilityTypes: [],
    findingNameSearch: '',
    priorities: [],
  },
  ...viewPreferences,
  filterOption: getFilterOptionById(filterOption.id),
  filterOptions: FINDINGS_FILTER_OPTIONS,
  sortOption: getSortOptionById(sortOption.id),
  sortOptions: FINDINGS_SORT_OPTIONS,
  sortOrder: sortOrder,
  startDate: '',
  endDate: endDate,
  acceptedFindings: [],
  remediatedFindings: [],
  newFindings: [],
  inProgressFindings: [],
  closedFindings: [],
}
