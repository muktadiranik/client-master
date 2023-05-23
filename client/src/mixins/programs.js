import { mapActions } from 'vuex'
import { STORE_KEY, GET_PROGRAM } from '@/modules/programs/_store/types'
import store from '@/modules/programs/_store'

export const ProgramsMixin = {
  methods: {
    ...mapActions(STORE_KEY, {
      getProgram: GET_PROGRAM,
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
