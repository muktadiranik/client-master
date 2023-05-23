import { mapActions } from 'vuex'
import { STORE_KEY, EDIT_PROFILE, LOAD_PROFILE, INITIATE_TAX_FORM } from '@/modules/account-settings/_store/types'
import store from '@/modules/account-settings/_store'

export const AccountSettingsMixin = {
  methods: {
    ...mapActions(STORE_KEY, {
      actionEditProfile: EDIT_PROFILE,
      actionLoadAccountSettingsProfile: LOAD_PROFILE,
      actionInitiateTaxForm: INITIATE_TAX_FORM,
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
  beforeDestroy() {
    if (STORE_KEY in this.$store._modules.root._children) {
      this.$store.unregisterModule(STORE_KEY)
    }
  },
}
