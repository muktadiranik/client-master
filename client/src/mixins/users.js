import { mapActions } from 'vuex'
import { STORE_KEY, GET_USER_PROFILE } from '@/stores/users/types'
import store from '@/stores/users'

export const UserMixin = {
  methods: {
    ...mapActions(STORE_KEY, {
      getUserProfile: GET_USER_PROFILE,
    }),
  },
  mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
}
