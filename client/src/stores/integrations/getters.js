import { CREATE_ISSUE_FAILED } from '@/stores/integrations/types'

export default {
  [CREATE_ISSUE_FAILED]: state => id => {
    return state.errorCreatingFindings.indexOf(id) !== -1
  },
}
