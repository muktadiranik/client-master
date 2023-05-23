export const HttpsMixin = {
  methods: {
    convertUrlToHttps(url) {
      if (!url) {
        return ''
      }

      const env = process.env.NODE_ENV
      if (env !== 'development') {
        return url.replace('http://', 'https://')
      }

      return url
    },
  },
}
