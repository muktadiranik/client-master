export default {
  methods: {
    getFileNameFromFilePath(filePath) {
      /* eslint-disable no-useless-escape */
      return filePath.replace(/^.*[\\\/]/, '')
    },
    getFileIconClassFromFilePath(filePath) {
      const fileExtension = filePath
        .split('.')
        .pop()
        .toLowerCase()
      let prefix = 'far fa-'

      if (/\.(gif|jpg|jpe?g|tiff|png)$/i.test(fileExtension)) {
        return prefix + 'file-image'
      }

      if (/\.('txt')$/i.test(fileExtension)) {
        return prefix + 'file-alt'
      }

      if (/\.('html|css|js')$/i.test(fileExtension)) {
        return prefix + 'file-code'
      }

      return prefix + 'file'
    },
    getFileIconClass(fileType) {
      let prefix = 'far fa-'
      switch (fileType) {
        case 'image/gif':
        case 'image/jpeg':
        case 'image/png':
        case 'image/svg+xml':
          return prefix + 'file-image'
        case 'text/plain':
          return prefix + 'file-alt'
        case 'text/html':
        case 'text/css':
        case 'text/javascript':
          return prefix + 'file-code'
        default:
          return prefix + 'file'
      }
    },
    getFormattedFileSize(bytes) {
      if (isNaN(bytes)) {
        return bytes
      }

      if (bytes < 1024) return `${bytes} bytes`
      if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} MB`
      if (bytes >= 1024 && bytes < 1048576) {
        return `${(bytes / 1024).toFixed(1)} KB`
      }
    },
    getLastModified(date) {
      const lastModified = new Date(date)
      return lastModified.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
    },
  },
}
