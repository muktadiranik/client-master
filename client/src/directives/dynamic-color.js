import { STORE_KEY, GET_USER } from '@/stores/account/types'
import store from '@/stores'

const getUserType = () => {
  return store.getters[`${STORE_KEY}/${GET_USER}`].user_type
}

const getUserTypeClass = () => {
  const userType = getUserType()
  if (!userType) {
    return ''
  }

  switch (userType) {
    case 'researcher':
      return 'researcher'
    case 'program_manager':
      return 'programManager'
    case 'application_owner':
      return 'appOwner'
    default:
      return ''
  }
}

export default {
  dynamicColor: {
    bind(el) {
      const userTypeClass = getUserTypeClass()

      if (userTypeClass) {
        el.classList.add(userTypeClass)
      }
    },
    update(el) {
      const userTypeClass = getUserTypeClass()

      if (!userTypeClass) {
        el.classList.remove('programManager')
        el.classList.remove('appOwner')
        el.classList.remove('researcher')
      } else {
        el.classList.add(userTypeClass)
      }
    },
    unbind(el) {},
  },
}
