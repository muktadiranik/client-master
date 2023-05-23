import axios from 'axios'

const RESOURCE = 'accounts'
const AccountService = {
  changePassword(data) {
    return axios.post(`${RESOURCE}/change-password/`, data)
  },
  checkConfirmation(token) {
    return axios.get(`${RESOURCE}/confirm/check/${token}/`)
  },
  checkEmailAvailability(email) {
    return axios.get(`${RESOURCE}/email/check/${email}/`)
  },
  checkUsernameAvailability(username) {
    return axios.get(`${RESOURCE}/username/check/${username}/`)
  },
  completeProfile(data) {
    return axios.post(`${RESOURCE}/register/complete-profile/`, data)
  },
  confirmEmail(data) {
    return axios.post(`${RESOURCE}/email/confirm/`, data)
  },
  createAccount(data) {
    return axios.post(`${RESOURCE}/register/`, data)
  },
  getDashboard(userType) {
    return axios.get(`${RESOURCE}/${userType}-dashboard/`)
  },
  getSubmissionStats() {
    return axios.get(`${RESOURCE}/researcher-stats/`)
  },
  getProfile() {
    return axios.get(`${RESOURCE}/profile/`)
  },
  login(data) {
    return axios.post(`${RESOURCE}/login/`, data)
  },
  syntheticLogin(data) {
    return axios.get(`${RESOURCE}/synthetic-login?code=${data.code}&username=${data.username}`)
  },
  logout() {
    return axios.get(`${RESOURCE}/logout/`)
  },
  updateProfile(data) {
    return axios.post(`${RESOURCE}/profile/`, data)
  },
  userSearch(searchTerms, userType) {
    return axios.get(`${RESOURCE}/users/search/?search=${searchTerms}&user_type=${userType}`)
  },
  requestPasswordRecovery(data) {
    return axios.post(`${RESOURCE}/recover/`, data)
  },
  resetPassword(data) {
    return axios.post(`${RESOURCE}/recover/change-password/`, data)
  },
  inititateTaxForm(data) {
    return axios.get(`integrations/docusign/${data.user}/${data.form}`)
  },
  loadUserFromToken(token){
    // runs before http interceptors are set up, config must be set manually
    const config = {
      headers: {
        Authorization: `Token ${token}`
      }
    }
    return axios.get(`${API_BASE_URL}/accounts/user`, config)
  }
}

export default AccountService
