import { FINDINGS_SORT_OPTIONS } from '@/modules/findings/_models/findings-sort-options'

import { DatesMixin } from '@/mixins/dates'

// let sortOrder = `${localStorage.getItem('findingsListSortOrder') || 'desc'}`

let viewPreferences = {}

const today = new Date()
let lastYear = new Date()
lastYear.setFullYear(today.getFullYear() - 1)

const startDate = DatesMixin.methods.getIsoDateStringFromDate(lastYear)
const endDate = DatesMixin.methods.getIsoDateStringFromDate(today)

export let InitialState = {
  findings: [],
  findingsQuery: {
    page: 1,
    count: 0,
    next: '',
    previous: '',
    total_pages: 0,
    vulnerabilityTypes: [],
    findingNameSearch: '',
    priority: '',
    status: '',
    programs: '',
  },
  ...viewPreferences,
  filterOption: {},
  filterOptions: {},
  sortOption: FINDINGS_SORT_OPTIONS.DatePublished,
  sortOptions: FINDINGS_SORT_OPTIONS,
  sortOrder: 'desc',
  startDate: startDate,
  endDate: endDate,
  kanbanNewFindings: [],
  kanbanInProgressFindings: [],
  kanbanClosedFindings: [],
  isKanban: true,
}
