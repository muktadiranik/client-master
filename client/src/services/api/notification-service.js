import axios from 'axios'

const RESOURCE = 'notifications'
const NotificationService = {
  getNotifications(page) {
    return axios.get(`${RESOURCE}/list/?page=${page}`)
  },
  markNotificationRead(notificationUuid) {
    return axios.get(`${RESOURCE}/${notificationUuid}/`)
  },
}

export default NotificationService
