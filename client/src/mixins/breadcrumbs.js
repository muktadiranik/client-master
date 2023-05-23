import { STORE_KEY, RESET_STORE, SET_BREADCRUMBS } from '@/stores/breadcrumbs/types'
import store from '@/stores'
import { mapActions, mapState } from 'vuex'

export const BreadcrumbsMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      breadcrumbs: state => state.breadcrumbs,
    }),
    hasChild() {
      if (!this.child) {
        return false
      }
      return !!(this.child && (this.child.route || this.child.title))
    },
    hasGrandChild() {
      if (!this.grandChild) {
        return false
      }
      return !!(this.grandChild && (this.grandChild.route || this.grandChild.title))
    },
    child() {
      if (!this.breadcrumbs) {
        return null
      }
      return this.breadcrumbs.child
    },
    grandChild() {
      if (!this.breadcrumbs) {
        return null
      }
      return this.breadcrumbs.grandChild
    },
    parent() {
      if (!this.breadcrumbs) {
        return null
      }
      return this.breadcrumbs.parent
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionResetStore: RESET_STORE,
      actionSetBreadcrumbs: SET_BREADCRUMBS,
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
