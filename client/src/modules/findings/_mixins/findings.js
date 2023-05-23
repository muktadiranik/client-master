import {
  STORE_KEY,
  GET_FINDINGS,
  GET_SORT_OPTION,
  GET_SORT_OPTIONS,
  GET_SORT_ORDER,
  GET_FILTER_OPTION,
  GET_FILTER_OPTIONS,
  GET_FINDINGS_QUERY,
  LOAD_FINDINGS,
  SET_FINDINGS_QUERY_PAGE,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  RESET_QUERY,
  RESET_STORE,
  SET_FINDINGS_QUERY_VULN,
  SET_FINDINGS_QUERY_FINDING_NAME,
  GET_FINDING_NAME_SEARCH,
  GET_NEW_FINDINGS,
  GET_IN_PROGRESS_FINDINGS,
  GET_CLOSED_FINDINGS,
  LOAD_KANBAN_FINDINGS,
  UPDATE_FINDING_RESOLUTION,
  SET_PRIORITY_QUERY,
  SET_PROGRAM_QUERY,
  SET_START_DATE,
  SET_END_DATE,
  SET_STATUS_QUERY,
  GENERATE_CSV,
  GET_KANBAN_STATUS,
  TOGGLE_KANBAN_STATUS,
  SET_KANBAN_STATUS,
} from '@/stores/findings/types'
import store from '@/stores/findings'
import { mapActions, mapGetters, mapState } from 'vuex'

export const FindingsMixin = {
  computed: {
    ...mapGetters(STORE_KEY, {
      findings: GET_FINDINGS,
      filterOption: GET_FILTER_OPTION,
      filterOptions: GET_FILTER_OPTIONS,
      sortOption: GET_SORT_OPTION,
      sortOptions: GET_SORT_OPTIONS,
      sortOrder: GET_SORT_ORDER,
      findingsQuery: GET_FINDINGS_QUERY,
      findingNameSearch: GET_FINDING_NAME_SEARCH,
      newFindings: GET_NEW_FINDINGS,
      inProgressFindings: GET_IN_PROGRESS_FINDINGS,
      closedFindings: GET_CLOSED_FINDINGS,
      isKanban: GET_KANBAN_STATUS,
    }),
    ...mapState(STORE_KEY, {
      startDate: state => state.startDate,
      endDate: state => state.endDate,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadFindings: LOAD_FINDINGS,
      actionLoadKanbanFindings: LOAD_KANBAN_FINDINGS,
      actionSetPage: SET_FINDINGS_QUERY_PAGE,
      actionSetSortOption: SET_SORT_OPTION,
      actionSetSortOrder: SET_SORT_ORDER,
      actionResetStore: RESET_STORE,
      actionResetQuery: RESET_QUERY,
      actionSetFindingQueryVuln: SET_FINDINGS_QUERY_VULN,
      actionSetFindingQueryFindingName: SET_FINDINGS_QUERY_FINDING_NAME,
      actionUpdateFindingResolution: UPDATE_FINDING_RESOLUTION,
      actionSetPriorityQuery: SET_PRIORITY_QUERY,
      actionSetProgramQuery: SET_PROGRAM_QUERY,
      actionSetStartDate: SET_START_DATE,
      actionSetEndDate: SET_END_DATE,
      actionSetStatusQuery: SET_STATUS_QUERY,
      actionGenerateCSVRequest: GENERATE_CSV,
      actionToggleKanban: TOGGLE_KANBAN_STATUS,
      actionSetKanban: SET_KANBAN_STATUS,
    }),
  },
  created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
}
