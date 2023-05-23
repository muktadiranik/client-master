import {
  GET_SUBMISSIONS,
  GET_FILTER_OPTION,
  GET_FILTER_OPTIONS,
  GET_SORT_OPTION,
  GET_SORT_OPTIONS,
  GET_SORT_ORDER,
  GET_QUERY,
  GET_PROGRAM,
} from '@/stores/program-submissions/types'

export default {
  [GET_SUBMISSIONS]: state => state.submissions,
  [GET_FILTER_OPTION]: state => state.filterOption,
  [GET_FILTER_OPTIONS]: state => state.filterOptions,
  [GET_SORT_OPTION]: state => state.sortOption,
  [GET_SORT_OPTIONS]: state => state.sortOptions,
  [GET_SORT_ORDER]: state => state.sortOrder,
  [GET_QUERY]: state => state.query,
  [GET_PROGRAM]: state => state.program,
}
