import axios from 'axios'

const RESOURCE = 'bank'
export const BankService = {
  getUserProfile(profileUuid) {
    return axios.get(`${RESOURCE}/user/${profileUuid}/`)
  },
  editUserProfile(profileUuid, data) {
    return axios.patch(`${RESOURCE}/user/${profileUuid}/`, data)
  },
  getProgramSummary(programUuid) {
    return axios.get(`${RESOURCE}/program/${programUuid}/`)
  },
}
export default BankService
