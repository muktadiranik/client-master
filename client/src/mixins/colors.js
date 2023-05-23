export const ColorMixin = {
  methods: {
    getBackgroundStyle(color) {
      return this.color ? {} : { backgroundColor: `${this.hexToRgba(color)}` }
    },
    hexToRgba(hexColor) {
      if (!hexColor) {
        return ''
      }
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, 1)`
    },
  },
}
