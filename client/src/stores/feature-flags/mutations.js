import { SET_FLAGS } from '@/stores/feature-flags/types'

export default {
    [SET_FLAGS]: (state, payload) => {
        state.flags = {...payload}
    }
}
