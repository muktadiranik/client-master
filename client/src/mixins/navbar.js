import { STORE_KEY, GET_FILTERED_NAVBAR_PROGRAMS, LOAD_PROGRAM, LOAD_PROGRAMS_LIST } from '@/stores/navbar/types'
import store from '@/stores/navbar'
import { mapActions, mapGetters, mapState } from 'vuex'

export const NavbarMixin = {
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadProgramForNavbar: LOAD_PROGRAM,
      actionLoadProgramsListForNavbar: LOAD_PROGRAMS_LIST,
    }),
  },
  computed: {
    ...mapGetters(STORE_KEY, {
      filteredNavbarPrograms: GET_FILTERED_NAVBAR_PROGRAMS,
    }),
    ...mapState(STORE_KEY, {
      navbarProgram: state => state.program,
      navbarPrograms: state => state.programs,
      navbarProgramsQuery: state => state.query,
      programRouteNames: state => state.programRouteNames,
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
  async destroyed() {
    const routeName = this.$route.name || ''
    const programRoutes = this.programRouteNames || []
    if (!programRoutes.includes(routeName)) {
      await this.actionLoadProgramForNavbar({})
    }
  },
}
