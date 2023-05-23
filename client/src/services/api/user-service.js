import axios from 'axios'

const RESOURCE = 'users'
const UserService = {
  getUserProfile(profileUuid) {
    return axios.get(`${RESOURCE}/${profileUuid}/`)
  },
}

export default UserService
