export default {
  clickOutside: {
    bind(el, binding, vnode) {
      el.outsideClick = event => {
        if (el !== event.target && !el.contains(event.target)) {
          const targetId = event.target.id || ''
          binding.value(event, targetId)
        }
      }
      document.addEventListener('click', el.outsideClick)
    },
    unbind(el) {
      document.removeEventListener('click', el.outsideClick)
      delete el.outsideClick
    },
  },
}
