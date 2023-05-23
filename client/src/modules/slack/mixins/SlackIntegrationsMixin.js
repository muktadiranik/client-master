import {
  STORE_KEY,
  GET_CLIENT_INTEGRATIONS,
  GET_SLACK_LINK,
  EDIT_CLIENT_INTEGRATIONS,
  LOAD_PROGRAM,
  RESET_STORE,
} from '@/stores/integrations-slack/types'
import store from '@/stores/integrations-slack'
import { mapActions, mapState } from 'vuex'

export const SlackIntegrationsMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      slackLoading: state => state.loading,
      program: state => state.program,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionGetClientIntegrations: GET_CLIENT_INTEGRATIONS,
      actionGetSlackLink: GET_SLACK_LINK,
      actionEditClientIntegrations: EDIT_CLIENT_INTEGRATIONS,
      actionLoadProgram: LOAD_PROGRAM,
      actionResetSlackIntegrationsStore: RESET_STORE,
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
