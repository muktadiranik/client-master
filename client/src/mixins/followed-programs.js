import { STORE_KEY, LOAD_FOLLOWED_PROGRAMS, TOGGLE_FOLLOWING } from '@/stores/followed-programs/types'
import store from '@/stores/followed-programs'
import { mapActions, mapState } from 'vuex'

export const FollowedProgramsMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      followedPrograms: state => state.followedPrograms,
      followedProgramsLoading: state => state.loading,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadFollowedPrograms: LOAD_FOLLOWED_PROGRAMS,
      actionToggleFollowing: TOGGLE_FOLLOWING,
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
