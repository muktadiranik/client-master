import axios from 'axios'

const RESOURCE = 'greenroom'
const GreenRoomService = {
    getGreenRoomVulns() {
        return axios.get(`${RESOURCE}/gr/`)
    },
    handleGreenRoomVulns(payload) {
        return axios.post(`${RESOURCE}/process-vulns/`, payload)
    }
}

export default GreenRoomService
