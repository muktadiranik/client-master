import {
    STORE_KEY,
  } from '@/stores/feature-flags/types'

import { mapState, mapActions } from 'vuex'

export const FeatureFlagsMixin = {
    computed: {
        ...mapState(STORE_KEY, {
            findingsMessageBanner: state => state.flags.findingsMessageBanner,
            epicJiraOption: state => state.flags.epicJiraOption
        })
},
    method: {
        ...mapActions(STORE_KEY, {})
        }

}
