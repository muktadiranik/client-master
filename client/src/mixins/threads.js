import { mapActions, mapGetters } from 'vuex'
import {
  STORE_KEY,
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  EDIT_MESSAGE,
  GET_THREAD,
  LOAD_THREAD,
  RESET_STORE,
} from '@/stores/threads/types'
import store from '@/stores/threads'

export const ThreadsMixin = {
  computed: {
    ...mapGetters(STORE_KEY, {
      getThread: GET_THREAD,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadThread: LOAD_THREAD,
      actionCreateMessage: CREATE_MESSAGE,
      actionDeleteMessage: DELETE_MESSAGE,
      actionEditMessage: EDIT_MESSAGE,
      actionResetThreadStore: RESET_STORE,
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
