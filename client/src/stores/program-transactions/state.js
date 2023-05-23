import {
  TRANSACTION_SORT_OPTIONS,
  getSortOptionById,
} from '@/modules/bank/_components/transaction-list/transaction-sort-options'
import {
  TRANSACTION_FILTER_OPTIONS,
  getFilterOptionById,
} from '@/modules/bank/_components/transaction-list/transaction-filter-options'

let sortOption = JSON.parse(localStorage.getItem('programTransactionsListSortOption')) || TRANSACTION_SORT_OPTIONS.Name
let filterOption =
  JSON.parse(localStorage.getItem('programTransactionsListFilterOption')) || TRANSACTION_FILTER_OPTIONS.All
let sortOrder = `${localStorage.getItem('programTransactionsListSortOrder') || 'desc'}`

let viewPreferences = {}

export let InitialState = {
  transactions: [],
  transactionsQuery: {
    page: 1,
    count: 0,
    next: '',
    previous: '',
    total_pages: 0,
  },
  ...viewPreferences,
  sortOption: getSortOptionById(sortOption.id),
  filterOption: getFilterOptionById(filterOption.id),
  sortOrder: sortOrder,
  loading: false,
  program: {},
}
