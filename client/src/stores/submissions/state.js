import { DatesMixin } from '@/mixins/dates'
import { SUBMISSIONS_SORT_OPTIONS } from '@/modules/submissions/_models/submissions-sort-options'

// let sortOrder = `${localStorage.getItem('submissionsListSortOrder') || 'desc'}`

let viewPreferences = {}

const today = new Date()
let lastYear = new Date()
lastYear.setFullYear(today.getFullYear() - 1)
const startDate = DatesMixin.methods.getIsoDateStringFromDate(lastYear)
const endDate = DatesMixin.methods.getIsoDateStringFromDate(today)

export let InitialState = {
  activeResearcherPopover: '',
  submissions: [],
  submissionsQuery: {
    page: 1,
    count: 0,
    next: '',
    previous: '',
    total_pages: 0,
    submissionNameSearch: '',
    priority: '',
    status: '',
    programs: [],
    payment: '',
    validOnly: false,
  },
  sortOrder: '',
  startDate: startDate,
  endDate: endDate,
  ...viewPreferences,
  submissionResolutions: [],
  submissionPriorities: [],
  submissionPriorityKeys: [],
  submissionStatuses: [],
  sortOption: {
    property: '',
  },
  sortOptions: SUBMISSIONS_SORT_OPTIONS,
  filterOption: {},
  isSubmissionKanban: true,
  kanbanNewSubmissions: [],
  kanbanInProgressSubmissions: [],
  kanbanClosedSubmissions: [],
}
