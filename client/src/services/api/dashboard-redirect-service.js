import axios from 'axios'

const RESOURCE = 'gscan'

const DashboardRedirectService = {
  checkIfRedirect(uuid) {
    return axios.get(`${RESOURCE}/redirect/${uuid}`)
  },
}

export default DashboardRedirectService
