<template>
  <main class="c-site-main">
    <section class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <form class="c-form">
          <router-view key="account-settings-router"></router-view>
        </form>
      </div>
      <!-- /.l-wrap -->
    </section>
  </main>
</template>

<script>
import VueScrollTo from 'vue-scrollto'
import { mapActions, mapState } from 'vuex'
import {
  STORE_KEY,
  UPDATE_PROFILE,
  ADD_UPDATED_FIELD,
  CLEAR_UPDATED_FIELDS,
  REMOVE_UPDATED_FIELD,
  REVERT_CHANGES,
  LOAD_PROFILE,
} from '@/modules/account-settings/_store/types'
import { AccountMixin } from '@/mixins/account'
import store from '@/modules/account-settings/_store'

export default {
  name: 'Account',
  mixins: [AccountMixin],
  data: function() {
    return {
      loading: true,
      menuItems: [
        { name: 'Overview', hash: 'basics' },
        { name: 'Password', hash: 'password' },
        { name: 'Payment', hash: 'payment' },
      ],
    }
  },
  computed: {
    ...mapState(STORE_KEY, {
      form: state => state.form,
      updatedFields: state => state.updatedFields,
      profile: state => state.profile,
      alertId: state => state.formUpdateAlertId,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      addUpdatedField: ADD_UPDATED_FIELD,
      clearUpdatedFields: CLEAR_UPDATED_FIELDS,
      loadProfile: LOAD_PROFILE,
      removeUpdatedField: REMOVE_UPDATED_FIELD,
      revertChanges: REVERT_CHANGES,
    }),
    async saveChanges() {
      await this.$store.dispatch(`${STORE_KEY}/${UPDATE_PROFILE}`)
    },
  },
  mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
    this.loading = false
    this.$store.dispatch(`${STORE_KEY}/${LOAD_PROFILE}`)
  },
  beforeDestroy() {
    this.$caAlert.close(this.alertId)

    if (STORE_KEY in this.$store._modules.root._children) {
      this.$store.unregisterModule(STORE_KEY)
    }
  },
  watch: {
    $route(to, from) {
      const hash = to.hash || 'basics'
      VueScrollTo.scrollTo(hash, 500, {
        el: `#${hash}`,
        container: 'body',
        offset: -60,
        force: true,
      })
    },
  },
}
</script>
