export default {
  methods: {
    emailIsValid(email) {
      /* eslint-disable no-useless-escape */
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    },
    uuidIsValid(uuid) {
      if (!uuid) {
        return false
      }
      /* eslint-disable no-useless-escape */
      var re = /^[0-9a-z]{22}$/i
      return re.test(String(uuid).toLowerCase())
    },
  },
}
