export const MarkdownMixin = {
  data() {
    return {
      newLineRegex: /([\r|\n]+)/g,
    }
  },
  methods: {
    equalIgnoringNewlines(str1, str2) {
      const str1Cleaned = (str1 || '').replace(this.newLineRegex, '\n')
      const str2Cleaned = (str2 || '').replace(this.newLineRegex, '\n')
      return str1Cleaned === str2Cleaned
    },
  },
}
