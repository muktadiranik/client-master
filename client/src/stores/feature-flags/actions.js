import { SET_FLAGS } from '@/stores/feature-flags/types'

export default {
    [SET_FLAGS]({commit}, payload){
        commit(SET_FLAGS, payload)
    }
}
