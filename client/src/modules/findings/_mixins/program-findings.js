import {
  STORE_KEY,
  GET_FINDINGS,
  GET_SORT_OPTION,
  GET_SORT_OPTIONS,
  GET_SORT_ORDER,
  GET_FILTER_OPTION,
  GET_FILTER_OPTIONS,
  GET_FINDINGS_QUERY,
  GET_PROGRAM,
  LOAD_PROGRAM_FINDINGS,
  LOAD_PROGRAM_NEW_FINDINGS,
  LOAD_PROGRAM_IN_PROGRESS_FINDINGS,
  LOAD_PROGRAM_CLOSED_FINDINGS,
  SET_FINDINGS_QUERY_PAGE,
  SET_FILTER_OPTION,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_START_DATE,
  SET_PROGRAM,
  RESET_QUERY,
  RESET_STORE,
  SET_FINDINGS_QUERY_VULN,
  SET_FINDINGS_QUERY_FINDING_NAME,
  GET_FINDING_NAME_SEARCH,
  UPDATE_FINDING_RESOLUTION,
  SET_PRIORITY_QUERY,
  GET_PROGRAM_NEW_FINDINGS,
  GET_PROGRAM_IN_PROGRESS_FINDINGS,
  GET_PROGRAM_CLOSED_FINDINGS,
} from '@/stores/program-findings/types'
import store from '@/stores/program-findings'
import { mapActions, mapGetters, mapState } from 'vuex'
import { SET_END_DATE } from '../../../stores/program-findings/types'

export const ProgramFindingsMixin = {
  computed: {
    ...mapGetters(STORE_KEY, {
      findings: GET_FINDINGS,
      filterOption: GET_FILTER_OPTION,
      filterOptions: GET_FILTER_OPTIONS,
      sortOption: GET_SORT_OPTION,
      sortOptions: GET_SORT_OPTIONS,
      sortOrder: GET_SORT_ORDER,
      findingsQuery: GET_FINDINGS_QUERY,
      program: GET_PROGRAM,
      programFindingNameSearch: GET_FINDING_NAME_SEARCH,
      newFindings: GET_PROGRAM_NEW_FINDINGS,
      inProgressFindings: GET_PROGRAM_IN_PROGRESS_FINDINGS,
      closedFindings: GET_PROGRAM_CLOSED_FINDINGS,
    }),
    ...mapState(STORE_KEY, {
      startDate: state => state.startDate,
      endDate: state => state.endDate,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadFindings: LOAD_PROGRAM_FINDINGS,
      actionLoadNewFindings: LOAD_PROGRAM_NEW_FINDINGS,
      actionLoadInProgressFindings: LOAD_PROGRAM_IN_PROGRESS_FINDINGS,
      actionLoadClosedFindings: LOAD_PROGRAM_CLOSED_FINDINGS,
      actionSetFilterOption: SET_FILTER_OPTION,
      actionSetPage: SET_FINDINGS_QUERY_PAGE,
      actionSetProgram: SET_PROGRAM,
      actionSetSortOption: SET_SORT_OPTION,
      actionSetSortOrder: SET_SORT_ORDER,
      actionSetStartDate: SET_START_DATE,
      actionSetEndDate: SET_END_DATE,
      actionResetStore: RESET_STORE,
      actionResetQuery: RESET_QUERY,
      actionSetFindingQueryVuln: SET_FINDINGS_QUERY_VULN,
      actionSetFindingQueryFindingName: SET_FINDINGS_QUERY_FINDING_NAME,
      actionUpdateFindingResolution: UPDATE_FINDING_RESOLUTION,
      actionSetPriorityQuery: SET_PRIORITY_QUERY,
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
