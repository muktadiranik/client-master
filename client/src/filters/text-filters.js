export default {
  titleCase(input) {
    if (!input) return ''
    let ret = input.toLowerCase().split(' ')
    for (let i = 0, len = ret.length; i < len; i++) {
      ret[i] = `${ret[i].charAt(0).toUpperCase()}${ret[i].slice(1)}`
    }
    return ret.join(' ')
  },
}
