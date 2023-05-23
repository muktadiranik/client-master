import {
  STORE_KEY,
  DELETE_ATTACHMENT,
  EDIT_FINDING,
  EDIT_VULNERABILITY_TYPES,
  GET_FINDING,
  LOAD_FINDING,
  RESET_STORE,
  UPLOAD_ATTACHMENT,
} from '@/stores/finding-edit/types'
import store from '@/stores/finding-edit'
import { mapActions, mapGetters } from 'vuex'

export const FindingEditMixin = {
  computed: {
    ...mapGetters(STORE_KEY, {
      finding: GET_FINDING,
    }),
    findingIsDraft() {
      return this.finding && this.finding.post_status === 1
    },
    findingIsPublished() {
      return this.finding && this.finding.post_status === 2
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionDeleteAttachment: DELETE_ATTACHMENT,
      actionEditFinding: EDIT_FINDING,
      actionEditVulnerabilityTypes: EDIT_VULNERABILITY_TYPES,
      actionLoadFinding: LOAD_FINDING,
      actionResetStore: RESET_STORE,
      actionUploadAttachment: UPLOAD_ATTACHMENT,
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
