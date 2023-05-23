export default {
  date: input => {
    var options = { day: 'numeric', year: 'numeric', month: 'numeric', timeZone: 'UTC' }
    const date = new Date(input)
    return date.toLocaleDateString('en-US', options)
  },
  localDateTime: input => {
    if (!input) {
      return ''
    }

    const dateInput = new Date(input)
    const dateFormatted = dateInput.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    return dateFormatted
  },
  daysAgo: input => {
    const dateInput = new Date(input)
    const timeInput = dateInput.getTime()

    const dateToday = new Date()
    const timeToday = dateToday.getTime()

    const secondsLapsed = (timeToday - timeInput) / 1000
    if (secondsLapsed <= 86400) {
      return 'Today'
    }

    const days = Math.floor(secondsLapsed / 86400)
    return `${days} days ago`
  },
  elapsedTime: (input, now) => {
    if (!input) {
      return ''
    }

    const dateInput = new Date(input)
    const timeInput = dateInput.getTime()

    const timeToday = now.getTime()

    const seconds = (timeToday - timeInput) / 1000
    const years = Math.floor(seconds / 31536000)
    if (years >= 1) {
      return `${years} ${years > 1 ? 'Years' : 'Year'} ago`
    }

    const months = Math.floor(seconds / 2592000)
    if (months >= 1) {
      return `${months} ${months > 1 ? 'Months' : 'Month'} ago`
    }

    const days = Math.floor(seconds / 86400)
    if (days >= 1) {
      return `${days} ${days > 1 ? 'Days' : 'Day'} ago`
    }

    const hours = Math.floor(seconds / 3600)
    if (hours >= 1) {
      return `${hours} ${hours > 1 ? 'Hours' : 'Hour'} ago`
    }

    const minutes = Math.floor(seconds / 60)
    if (minutes >= 1) {
      return `${minutes} ${minutes > 1 ? 'Minutes' : 'Minute'} ago`
    }

    return 'Just now'
  },
  elapsedTimeToDay: (input, now) => {
    if (!input) {
      return ''
    }

    const dateInput = new Date(input)
    const timeInput = dateInput.getTime()

    const timeToday = now.getTime()

    const seconds = (timeToday - timeInput) / 1000
    const years = Math.floor(seconds / 31536000)
    if (years >= 1) {
      return `${years} ${years > 1 ? 'Years' : 'Year'} ago`
    }

    const months = Math.floor(seconds / 2592000)
    if (months >= 1) {
      return `${months} ${months > 1 ? 'Months' : 'Month'} ago`
    }

    const days = Math.floor(seconds / 86400)
    if (days > 1) {
      return `${days} Days ago`
    } else if (days === 1) {
      return 'Yesterday'
    }

    return 'Today'
  },
  localTime: (input, now) => {
    if (!input) {
      return ''
    }

    const inputDate = new Date(input)
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true }
    const time = inputDate.toLocaleTimeString([], timeOptions)
    return time
  },
  friendlyDateTime(input) {
    if (!input) {
      return ''
    }

    const inputDate = new Date(input)
    const inputTime = inputDate.getTime()

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true }
    const time = inputDate.toLocaleTimeString([], timeOptions)

    const currentTime = new Date().getTime()
    const seconds = (currentTime - inputTime) / 1000
    const days = Math.floor(seconds / 86400)

    const dateOptions = {
      weekday: 'long',
      day: 'numeric',
      year: 'numeric',
      month: 'long',
    }
    let date = inputDate.toLocaleDateString('en-US', dateOptions)

    if (days === 0) {
      date = 'Today'
    } else if (days === 1) {
      date = 'Yesterday'
    }

    return `${date} at ${time}`
  },
  relativeDate(input) {
    if (!input) {
      return ''
    }

    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    let inputDate = new Date(input)
    inputDate.setHours(0, 0, 0, 0)

    let yesterdaysDate = new Date(currentDate)
    yesterdaysDate.setDate(currentDate.getDate() - 1)

    if (currentDate.valueOf() === inputDate.valueOf()) {
      return 'Today'
    }

    if (yesterdaysDate.valueOf() === inputDate.valueOf()) {
      return 'Yesterday'
    }

    return inputDate.toLocaleDateString('en-US')
  },
  getFormattedTime() {
    var today = new Date()
    var y = today.getFullYear()
    var m = today.getMonth() + 1
    var d = today.getDate()
    return y + '-' + m + '-' + d
  },
}
