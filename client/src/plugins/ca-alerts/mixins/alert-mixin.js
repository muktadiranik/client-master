export default {
  methods: {
    getUpdatedFieldSpan(updatedFieldText) {
      return `<em>${updatedFieldText}</em>`
    },
    getFormUpdateAlertHtml(updatedFields) {
      if (!updatedFields || !updatedFields.length) {
        return ''
      }

      const base = 'Would you like to update your '

      if (updatedFields.length === 1) {
        return base + `<span>${this.getUpdatedFieldSpan(updatedFields[0])}?</span>`
      }

      if (updatedFields.length === 2) {
        return (
          base +
          `<span>
              ${this.getUpdatedFieldSpan(updatedFields[0])}
              and
              ${this.getUpdatedFieldSpan(updatedFields[1])}
              ?</span>`
        )
      }

      let ret = base + '<span>'
      for (let i = 0, len = updatedFields.length; i < len; i++) {
        const label = updatedFields[i]
        if (len > 2 && i === len - 1) {
          ret += ' and '
        }
        ret += `<em>${label}</em>`

        if (i < len - 1) {
          ret += ', '
        }
      }

      ret += '?</span>'
      return ret
    },
  },
}
