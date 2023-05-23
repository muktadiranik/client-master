import { STORE_KEY, LOAD_COUNTRIES, LOAD_PAYMENT_METHOD_TYPES, LOAD_VULNERABILITY_TYPES } from '@/stores/common/types'
import { mapActions, mapState } from 'vuex'

export const CommonMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      countries: state => state.countries,
      paymentMethodTypes: state => state.paymentMethodTypes,
      vulnerabilityTypes: state => state.vulnerabilityTypes,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadCountries: LOAD_COUNTRIES,
      actionLoadPaymentMethodTypes: LOAD_PAYMENT_METHOD_TYPES,
      actionLoadVulnerabilityTypes: LOAD_VULNERABILITY_TYPES,
    }),
  },
}
