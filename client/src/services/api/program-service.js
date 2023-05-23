import axios from 'axios'

const RESOURCE = 'programs'

const ProgramService = {
  createProgram(data) {
    return axios.post(`${RESOURCE}/create/`, data)
  },
  editProgram(programUuid, data) {
    return axios.put(`${RESOURCE}/edit/${programUuid}/`, data)
  },
  getFollowedPrograms() {
    return axios.get('programs/followed/')
  },
  getProgram(uuid) {
    return axios.get(`${RESOURCE}/${uuid}/`)
  },
  getProgramPublic(programName) {
    return axios.get(`public/program/${programName}/`)
  },
  getProgramsList(url) {
    return axios.get(url)
  },
  getAllProgramsList() {
    return axios.get(`${RESOURCE}/all/`)
  },
  getShortProgramsList(page, search) {
    return axios.get(`${RESOURCE}/short-list/?page=${page}&search=${search || ''}`)
  },
  setFavoriteState(uuid) {
    return axios.post(`${RESOURCE}/favorite/${uuid}/`)
  },
  inviteProgramOwner(programUuid, emailAddress, userType) {
    const postData = {
      action: 'invite',
      email_address: emailAddress,
      user_type: userType || '',
    }
    return axios.post(`${RESOURCE}/${programUuid}/team/`, postData)
  },
  teamMemberAction(programUuid, action, profileUuid, userType) {
    const postData = {
      action,
      profile_uuid: profileUuid,
      user_type: userType || '',
    }
    return axios.post(`${RESOURCE}/${programUuid}/team/`, postData)
  },
  toggleActive(uuid) {
    return axios.get(`${RESOURCE}/${uuid}/action/activate/`)
  },
  toggleFollowing(uuid) {
    return axios.get(`${RESOURCE}/follow/${uuid}/`)
  },
  toggleFreeze(uuid) {
    return axios.get(`${RESOURCE}/${uuid}/action/freeze/`)
  },
  toggleVisibility(uuid) {
    return axios.get(`${RESOURCE}/${uuid}/action/visibility/`)
  },
  getAllPrograms() {
    return axios.get(`${RESOURCE}/all/`)
  },
  cancelInvitation(payload) {
    return axios.put(`${RESOURCE}/edit/${payload.program_uuid}/cancel-invitation`, payload)
  },
  getFeaturedPrograms() {
    return axios.get(`${RESOURCE}/featured-list/`)
  },
}

export default ProgramService
