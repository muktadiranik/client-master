import axios from 'axios'

const RESOURCE = 'threads'
const ThreadsService = {
  createMessage(threadUuid, postData) {
    return axios.post(`${API_BASE_URL}/threads/${threadUuid}/create-message/`, postData)
  },
  deleteMessage(threadUuid, messageUuid) {
    const url = `${API_BASE_URL}/threads/${threadUuid}/delete-message/${messageUuid}/`
    return axios.delete(url)
  },
  editMessage(threadUuid, messageUuid, postData) {
    const url = `${API_BASE_URL}/threads/${threadUuid}/edit-message/${messageUuid}/`
    return axios.put(url, postData)
  },
  getThread(uuid) {
    return axios.get(`${RESOURCE}/${uuid}/`)
  },
}

export default ThreadsService
