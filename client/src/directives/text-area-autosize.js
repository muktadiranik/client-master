const defaultHeight = '40px'

export default {
  autoSize: {
    bind(el) {},
    update(el) {
      if (!el || !el.value) {
        el.style.height = defaultHeight
        // el.style.maxHeight = defaultHeight
        el.style.minHeight = defaultHeight
        return
      }

      const scrollHeight = el.scrollHeight
      if (scrollHeight < 40) {
        return
      }
      const height = scrollHeight + 'px'

      el.style.height = height
      el.style.maxHeight = '150px'
      // el.style.minHeight = height
    },
    unbind(el) {},
  },
}
