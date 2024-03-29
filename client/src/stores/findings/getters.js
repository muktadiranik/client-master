import {
  GET_FINDING,
  GET_FINDINGS,
  GET_FILTER_OPTION,
  GET_FILTER_OPTIONS,
  GET_SORT_OPTION,
  GET_SORT_OPTIONS,
  GET_SORT_ORDER,
  GET_FINDINGS_QUERY,
  GET_VULNERABILITY_TYPES,
  GET_FINDING_NAME_SEARCH,
  GET_NEW_FINDINGS,
  GET_IN_PROGRESS_FINDINGS,
  GET_CLOSED_FINDINGS,
  GET_KANBAN_STATUS,
} from '@/stores/findings/types'

export default {
  [GET_FINDING]: state => state.finding,
  [GET_FINDINGS]: state => state.findings,
  [GET_FILTER_OPTION]: state => state.filterOption,
  [GET_FILTER_OPTIONS]: state => state.filterOptions,
  [GET_SORT_OPTION]: state => state.sortOption,
  [GET_SORT_OPTIONS]: state => state.sortOptions,
  [GET_SORT_ORDER]: state => state.sortOrder,
  [GET_FINDINGS_QUERY]: state => state.findingsQuery,
  [GET_VULNERABILITY_TYPES]: state => state.vulnerabilityTypes,
  [GET_FINDING_NAME_SEARCH]: state => state.findingsQuery.findingNameSearch,
  [GET_NEW_FINDINGS]: state => state.kanbanNewFindings,
  [GET_IN_PROGRESS_FINDINGS]: state => state.kanbanInProgressFindings,
  [GET_CLOSED_FINDINGS]: state => state.kanbanClosedFindings,
  [GET_KANBAN_STATUS]: state => state.isKanban,
}
