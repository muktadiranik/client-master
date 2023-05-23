export const DatesMixin = {
  methods: {
    getIsoDateStringFromDate(date) {
      const offset = date.getTimezoneOffset()
      date = new Date(date.getTime() + offset * 60 * 1000)
      date.setHours(0, 0, 0, 0)
      date = date.toISOString().split('T')[0]
      return date
    },
  },
}
