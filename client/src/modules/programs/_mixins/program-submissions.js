import {
  STORE_KEY,
  GET_SUBMISSIONS,
  GET_SORT_OPTION,
  GET_SORT_OPTIONS,
  GET_SORT_ORDER,
  GET_FILTER_OPTION,
  GET_FILTER_OPTIONS,
  GET_QUERY,
  GET_PROGRAM,
  LOAD_SUBMISSIONS,
  SET_FILTER_OPTION,
  SET_QUERY_PAGE,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_PROGRAM,
  RESET_QUERY,
  RESET_STORE,
} from '@/stores/program-submissions/types'
import store from '@/stores/program-submissions'
import { mapActions, mapGetters } from 'vuex'

export const ProgramSubmissionsMixin = {
  computed: {
    ...mapGetters(STORE_KEY, {
      submissions: GET_SUBMISSIONS,
      filterOption: GET_FILTER_OPTION,
      filterOptions: GET_FILTER_OPTIONS,
      sortOption: GET_SORT_OPTION,
      sortOptions: GET_SORT_OPTIONS,
      sortOrder: GET_SORT_ORDER,
      query: GET_QUERY,
      program: GET_PROGRAM,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadSubmissions: LOAD_SUBMISSIONS,
      actionSetFilterOption: SET_FILTER_OPTION,
      actionSetQueryPage: SET_QUERY_PAGE,
      actionSetSortOption: SET_SORT_OPTION,
      actionSetSortOrder: SET_SORT_ORDER,
      actionSetProgram: SET_PROGRAM,
      actionResetStore: RESET_STORE,
      actionResetQuery: RESET_QUERY,
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
