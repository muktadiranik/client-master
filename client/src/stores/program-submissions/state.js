import {
  SUBMISSION_SORT_OPTIONS,
  getSortOptionById,
} from '@/modules/submissions/_components/submission-list/models/submission-sort-options'
import {
  SUBMISSION_FILTER_OPTIONS,
  getFilterOptionById,
} from '@/modules/submissions/_components/submission-list/models/submission-filter-options'

let sortOption =
  JSON.parse(localStorage.getItem('programSubmissionsListSortOption')) || SUBMISSION_SORT_OPTIONS.DateUpdated
let filterOption =
  JSON.parse(localStorage.getItem('programSubmissionsListFilterOption')) || SUBMISSION_FILTER_OPTIONS.All
let sortOrder = `${localStorage.getItem('programSubmissionsListSortOrder') || 'desc'}`

let viewPreferences = {}

export let InitialState = {
  program: {},
  submissions: [],
  query: {
    page: 1,
    count: 0,
    next: '',
    previous: '',
    total_pages: 0,
  },
  ...viewPreferences,
  filterOption: getFilterOptionById(filterOption.id),
  filterOptions: SUBMISSION_FILTER_OPTIONS,
  sortOption: getSortOptionById(sortOption.id),
  sortOptions: SUBMISSION_SORT_OPTIONS,
  sortOrder: sortOrder,
}
